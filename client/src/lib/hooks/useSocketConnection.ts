import { socket } from "@/socket";
import { useState } from "react";

export const useSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const connect = () => {
    socket.connect();
    setIsConnected(true);
  };
  const disconnect = () => {
    socket.disconnect();
    setIsConnected(false);
  };

  return {
    isConnected,
    connect,
    disconnect,
    socket,
  };
};
