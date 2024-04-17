import { socket } from "@/socket";
import { useCallback, useState } from "react";

export const useSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const connect = useCallback(() => {
    socket.connect();
    setIsConnected(true);
  }, []);

  const disconnect = useCallback(() => {
    socket.disconnect();
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    connect,
    disconnect,
    socket,
  };
};
