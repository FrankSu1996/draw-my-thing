import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";
import { Button } from "@/components/ui/button";
import { Canvas } from "@/components/ui/canvas";

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  const sendMessage = () => {
    socket.emit("hello");
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
      <Canvas width={800} height={800} />
    </>
  );
}

export default App;
