// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, type Color, type BrushSize } from "../../lib/types";

dotenv.config();

const app: Express = express();
app.use(cors());

const port = parseInt(process.env.PORT!);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(port, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("canvasMouseMove", (e) => {
    socket.broadcast.emit("canvasMouseMove", e);
  });
  socket.on("canvasMouseDown", (e) => {
    socket.broadcast.emit("canvasMouseDown", e);
  });
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
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
});
