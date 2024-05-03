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

const getRoomPlayersKey = (roomId: string) => `room:${roomId}:players`;
const getRoomKey = (roomId: string) => `room:${roomId}`;
const getPlayerKey = (playerId: string) => `player:${playerId}`;

export class RedisUtils {
  static async getRoomIds() {
    const roomIds: string[] = [];
    let cursor = "0"; // Start the cursor for SCAN at 0

    do {
      // Use the SCAN command to find keys matching 'room:*'
      const reply = await RedisClient.scan(cursor, "MATCH", "room:*");
      cursor = reply[0];
      const keys = reply[1];

      // Extract the roomId from each key and add to the roomIds array
      // Filter and extract the roomId from each key
      keys.forEach((key) => {
        if (key.match(/^room:\w+$/)) {
          const roomId = key.split(":")[1];
          roomIds.push(roomId);
        }
      });
    } while (cursor !== "0");

    return roomIds;
  }
  static async getPlayerCount(roomId: string) {
    const count = await RedisClient.scard(getRoomPlayersKey(roomId));
    return count;
  }

  // Retrieves all players in a room using pipelining
  static async getPlayers(roomId: string): Promise<Player[]> {
    const playerIds = await RedisClient.smembers(getRoomPlayersKey(roomId));
    const players = [];

    // Retrieve each player's details from Redis
    for (const playerId of playerIds) {
      const playerKey = getPlayerKey(playerId);
      const playerData = await RedisClient.hgetall(playerKey);

      // Construct player objects from the retrieved hash data
      if (playerData) {
        players.push({
          id: playerId,
          name: playerData.name,
          character: playerData.character,
          points: parseInt(playerData.points),
          rank: parseInt(playerData.rank),
        } as Player);
      }
    }

    return players;
  }

  static async addPlayer(player: Player) {
    const playerKey = getPlayerKey(player.id);
    await RedisClient.hset(playerKey, {
      character: player.character,
      name: player.name,
      points: player.points.toString(),
      rank: player.rank.toString(),
    });
    RedisClient.expire(playerKey, DEFAULT_EXPIRY);
  }

  static async addPlayerToRoom(roomId: string, player: Player) {
    await RedisClient.sadd(getRoomPlayersKey(roomId), player.id);
    await RedisClient.expire(getRoomPlayersKey(roomId), 10000);
  }

  static async removePlayerFromRoom(roomId: string, player: Player) {
    await RedisClient.srem(getRoomPlayersKey(roomId), player.id);
  }
  static async deleteRoomPlayersSet(roomId: string) {
    await RedisClient.del(getRoomPlayersKey(roomId));
  }

  static async setRoomLeader(roomId: string, leader: Player) {
    await RedisClient.hset(getRoomKey(roomId), "leader", leader.id);
    await RedisClient.expire(getRoomKey(roomId), DEFAULT_EXPIRY);
  }
}
