// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  type Color,
  type BrushSize,
  type Player,
  type Message,
} from "../../lib/types";
import { createServer } from "http";
import { instrument } from "@socket.io/admin-ui";
import { RedisUtils } from "./redis";

dotenv.config();
const corsOptions = {
  origin: ["http://localhost:3000", "https://admin.socket.io"],
  credentials: true,
};

const app: Express = express();
app.use(cors(corsOptions));
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: corsOptions,
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

// REST-api stuff
app.get("/room/:room_id/players", async (req, res) => {
  const { room_id } = req.params;
  const players = await RedisUtils.getPlayers(room_id);
});

// websocket stuff
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
      await RedisUtils.removePlayerFromRoom(roomId, player);
      // Check if the set is now empty
      const count = await RedisUtils.getPlayerCount(roomId);
      if (count === 0) {
        // Delete the key if no players are left in the room
        await RedisUtils.deleteRoom(roomId);
        console.log(`Room ${roomId} is empty and has been deleted from Redis.`);
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
    callback({ status: "success" });
  });
  socket.on("joinRoom", async (roomId: string, player: Player, callback) => {
    if (roomExists(roomId)) {
      socket.join(roomId);
      await RedisUtils.addPlayerToRoom(roomId, player);
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
const port = process.env.PORT!;
httpServer.listen(port, () => console.log("Server running on port " + port));
