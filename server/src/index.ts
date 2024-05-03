// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { RedisUtils } from "./redis";
import { CORS } from "./config";

dotenv.config();

const app: Express = express();
app.use(cors(CORS));
export const httpServer = createServer(app);

// Create an Express router
const apiRouter = express.Router();
app.use(`/api/${process.env.APIVERSION}`, apiRouter);

// REST-api stuff
apiRouter.get("/room/:room_id/players", async (req, res) => {
  const { room_id } = req.params;
  const players = await RedisUtils.getPlayers(room_id);
  res.json(players);
});

// websocket stuff
const port = process.env.PORT!;
httpServer.listen(port, () => console.log("Server running on port " + port));
