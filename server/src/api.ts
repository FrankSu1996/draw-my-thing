import { app } from "./app";
import { RedisUtils } from "./redis";
import express from "express";

// Create an Express router
const apiRouter = express.Router();
app.use(`/api/${process.env.APIVERSION}`, apiRouter);

// REST-api stuff
apiRouter.get("/room/:room_id/players", async (req, res) => {
  const { room_id } = req.params;
  const players = await RedisUtils.getPlayers(room_id);
  res.json(players);
});
apiRouter.get("/room/:room_id/details", async (req, res) => {
  const { room_id } = req.params;
  const roomDetails = await RedisUtils.getRoomDetails(room_id);
  res.json(roomDetails);
});
