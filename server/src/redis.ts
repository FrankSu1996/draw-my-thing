import dotenv from "dotenv";
import { Redis } from "ioredis";
dotenv.config();

// right now all redis data clears after 6 hours
export const DEFAULT_EXPIRY = 21600;

export const RedisClient = new Redis(process.env.REDIS_URL!);
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
}
