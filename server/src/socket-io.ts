import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, BrushSize, Color, Message, Player } from "../../lib";
import { CORS } from "./config";
import { instrument } from "@socket.io/admin-ui";
import { RedisUtils } from "./redis";
import { httpServer } from "./app";

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: CORS,
});

instrument(io, {
  auth: false,
  mode: "development",
});

const SocketRoomMap = new Map<
  string,
  {
    roomId: string;
    player: Player;
  }
>();

io.on("connection", (socket) => {
  const roomExists = (roomId: string) => {
    const rooms = io.sockets.adapter.rooms;
    if (rooms.has(roomId)) return true;
    return false;
  };

  console.log(`User Connected: ${socket.id}`);

  // canvas related events
  socket.on("canvasMouseMove", (e) => {
    socket.broadcast.emit("canvasMouseMove", e);
  });
  socket.on("canvasMouseDown", (e) => {
    socket.broadcast.emit("canvasMouseDown", e);
  });
  socket.on("disconnect", async (disconnectReason) => {
    const mapObj = SocketRoomMap.get(socket.id);
    if (mapObj) {
      const { player, roomId } = mapObj;
      SocketRoomMap.delete(socket.id);
      socket.to(roomId).emit("playerLeft", player);
      RedisUtils.handlePlayerDisconnect(roomId, player);

      // handle leader leaving, we need to promote a random player to leader
      // and broadcast that to room
      const currentLeaderId = await RedisUtils.getRoomLeader(roomId);
      if (currentLeaderId === player.id) {
        console.log("Current leader has left!!");
        const players = await RedisUtils.getPlayers(roomId);
      }
      console.log(`Socket ${socket.id} disconnecting from roomId: ${roomId}`);
    }
    console.log(`Socket disconnected: ${socket.id}. Reason: ${disconnectReason}`);
  });
  socket.on("canvasChangeColor", (color: Color) => {
    socket.broadcast.emit("canvasChangeColor", color);
  });
  socket.on("canvasChangeDrawMode", (isErasing: boolean) => {
    socket.broadcast.emit("canvasChangeDrawMode", isErasing);
  });
  socket.on("canvasUndo", (imageData: string | null) => {
    socket.broadcast.emit("canvasUndo", imageData);
  });
  socket.on("canvasRedo", (imageData: string) => {
    socket.broadcast.emit("canvasRedo", imageData);
  });
  socket.on("canvasChangeBrushSize", (brushSize: BrushSize) => {
    socket.broadcast.emit("canvasChangeBrushSize", brushSize);
  });
  socket.on("canvasClear", () => {
    socket.broadcast.emit("canvasClear");
  });
  socket.on("canvasMouseUp", () => {
    socket.broadcast.emit("canvasMouseUp");
  });

  // room related events
  socket.on("createRoom", async (roomId: string, player: Player, callback) => {
    if (roomExists(roomId)) return callback({ status: "error", errorMessage: `Internal Error: RoomId ${roomId} already exists` });
    SocketRoomMap.set(socket.id, { roomId, player });
    socket.join(roomId);
    await RedisUtils.addPlayerToRoom(roomId, player);
    await RedisUtils.addPlayer(player);
    await RedisUtils.setRoomLeader(roomId, player);
    callback({ status: "success" });
  });
  socket.on("joinRoom", async (roomId: string, player: Player, callback) => {
    if (roomExists(roomId)) {
      socket.join(roomId);
      await RedisUtils.addPlayerToRoom(roomId, player);
      await RedisUtils.addPlayer(player);
      SocketRoomMap.set(socket.id, { roomId, player });
      socket.to(roomId).emit("playerJoined", player);
      callback({ status: "success" });
    }
    callback({ status: "error", errorMessage: `Room with id: ${roomId} does not exist` });
  });
  socket.on("newChatMessage", (roomId: string, message: Message) => {
    if (roomExists(roomId)) {
      socket.to(roomId).emit("newChatMessage", message);
    }
  });
});
