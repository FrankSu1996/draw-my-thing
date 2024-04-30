// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, type Color, type BrushSize } from "../../lib/types";
import { DEFAULT_EXPIRY, RedisClient, RedisUtils } from "./redis";
import { createServer } from "http";
import { instrument } from "@socket.io/admin-ui";

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

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("canvasMouseMove", (e) => {
    socket.broadcast.emit("canvasMouseMove", e);
  });
  socket.on("canvasMouseDown", (e) => {
    socket.broadcast.emit("canvasMouseDown", e);
  });
  socket.on("disconnect", (disconnectReason) => {
    console.log(`User Disconnected: ${socket.id}. Reason: ${disconnectReason}`);
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
  socket.on("createRoom", async (roomId, playerName, callback) => {
    const rooms = io.sockets.adapter.rooms;
    if (rooms.has(roomId)) return callback({ status: "error", errorMessage: `Internal Error: RoomId ${roomId} already exists` });
    socket.join(roomId);
    callback({ status: "success" });
  });
  socket.on("joinRoom", (roomId, player) => {
    const rooms = io.sockets.adapter.rooms;
    if (rooms.has(roomId)) {
      socket.join(roomId);
      socket.to(roomId).emit("playerJoined", player);
    }
  });
});
const port = process.env.PORT!;
httpServer.listen(port, () => console.log("Server running on port " + port));
