// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, type Color, type BrushSize, type Player } from "../../lib/types";
import { createServer } from "http";
import { instrument } from "@socket.io/admin-ui";
import { RedisClient } from "./redis";

dotenv.config();

const app: Express = express();
app.use(cors());
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
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
  console.log(`User Connected: ${socket.id}`);

  socket.on("canvasMouseMove", (e) => {
    socket.broadcast.emit("canvasMouseMove", e);
  });
  socket.on("canvasMouseDown", (e) => {
    socket.broadcast.emit("canvasMouseDown", e);
  });
  socket.on("disconnect", (disconnectReason) => {
    const mapObj = SocketRoomMap.get(socket.id);
    if (mapObj) {
      const { player, roomId } = mapObj;
      SocketRoomMap.delete(socket.id);
      socket.to(roomId).emit("playerLeft", player);
      RedisClient.srem(`room:${roomId}`, player.id);
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
  socket.on("createRoom", async (roomId: string, player: Player, callback) => {
    const rooms = io.sockets.adapter.rooms;
    if (rooms.has(roomId)) return callback({ status: "error", errorMessage: `Internal Error: RoomId ${roomId} already exists` });
    SocketRoomMap.set(socket.id, { roomId, player });
    socket.join(roomId);

    RedisClient.sadd(`room:${roomId}`, player.id);
    callback({ status: "success" });
  });
  socket.on("joinRoom", (roomId, player) => {
    const rooms = io.sockets.adapter.rooms;
    if (rooms.has(roomId)) {
      socket.join(roomId);
      RedisClient.sadd(`room:${roomId}`, player.id);
      SocketRoomMap.set(socket.id, { roomId, player });
      socket.to(roomId).emit("playerJoined", player);
    }
  });
});
const port = process.env.PORT!;
httpServer.listen(port, () => console.log("Server running on port " + port));
