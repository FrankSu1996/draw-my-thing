import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";
import { Button } from "@/components/ui/button";
import { Canvas } from "@/components/ui/canvas";
import { ClientToServerEvents } from "../../lib/types";

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  const sendMessage = () => {
    socket.emit("send_message", { message: "hello" });
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <>
      <Button onClick={sendMessage}>Test</Button>
      <Canvas />
    </>
  );
}

export default App;
