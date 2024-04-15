// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();

const app: Express = express();
app.use(cors());

const port = parseInt(process.env.PORT!);
const io = new Server(port, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected!");
});
