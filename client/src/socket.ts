import { Socket, io } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../lib";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3001";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL!, { autoConnect: false });
