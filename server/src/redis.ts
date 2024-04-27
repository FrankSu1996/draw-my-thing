import dotenv from "dotenv";
import { Redis } from "ioredis";
dotenv.config();

export const RedisClient = new Redis(process.env.REDIS_URL!);
RedisClient.on("connect", () => {
  console.log("Redis client connected");
});
RedisClient.on("error", (err) => {
  console.log("Redis client could not connect", err);
});
