import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";
import { Button } from "@/components/ui/button";
import { Canvas } from "@/components/ui/canvas";
import { useCanvas } from "./lib/hooks/useCanvas";

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [isErasing, setIsErasing] = useState(false);
  const { canvasRef, onMouseDown, onMouseMove, onMouseUp, redo, undo, handleMouseLeave, clearCanvas } = useCanvas({ isErasing });

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
      <Button onClick={undo}>Undo</Button>
      <Button onClick={redo}>Redo</Button>
      <Button onClick={clearCanvas}>Clear</Button>
      <Canvas
        ref={canvasRef}
        width={800}
        height={800}
        isErasing={isErasing}
        onMouseDown={onMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
    </>
  );
}

export default App;
