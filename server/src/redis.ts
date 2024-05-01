import dotenv from "dotenv";
import { Redis } from "ioredis";
import type { Player } from "../../lib";
dotenv.config();

// right now all redis data clears after 6 hours
export const DEFAULT_EXPIRY = 21600;

const RedisClient = new Redis(process.env.REDIS_URL!);
RedisClient.on("connect", () => {
  console.log("Redis client connected");
});
RedisClient.on("error", (err) => {
  console.log("Redis client could not connect", err);
});

export class RedisUtils {
  static async getRoomIds() {
    const roomIds: string[] = [];
    let cursor = "0"; // Start the cursor for SCAN at 0

    do {
      // Use the SCAN command to find keys matching 'room:*'
      const reply = await RedisClient.scan(cursor, "MATCH", "room:*");
      cursor = reply[0]; // Update cursor to the next position for SCAN continuation
      const keys = reply[1]; // Retrieve the list of keys from the current scan

      // Extract the roomId from each key and add to the roomIds array
      // Filter and extract the roomId from each key
      keys.forEach((key) => {
        if (key.match(/^room:\w+$/)) {
          // This regex ensures the key has no further colons
          const roomId = key.split(":")[1]; // Assuming the key format is 'room:{roomId}'
          roomIds.push(roomId);
        }
      });
    } while (cursor !== "0"); // Continue scanning until cursor returns to 0

    return roomIds;
  }
  static async getPlayerCount(roomId: string) {
    const count = await RedisClient.scard(`room:${roomId}`);
    return count;
  }

  static async getPlayers(roomId: string) {
    const players = await RedisClient.smembers(`room:${roomId}`);
    return players;
  }

  static async addPlayerToRoom(roomId: string, player: Player) {
    await RedisClient.sadd(`room:${roomId}`, JSON.stringify(player));
    await RedisClient.expire(`room:${roomId}`, 10000);
  }

  static async removePlayerFromRoom(roomId: string, player: Player) {
    await RedisClient.srem(`room:${roomId}`, JSON.stringify(player));
  }
  static async deleteRoom(roomId: string) {
    await RedisClient.del(`room:${roomId}`);
  }
}
