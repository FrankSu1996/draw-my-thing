import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";
import { Button } from "@/components/ui/button";
import { Canvas } from "@/components/ui/canvas";
import { useDrawCanvas } from "./lib/hooks/useDrawCanvas";
import { useSocketConnection } from "./lib/hooks/useSocketConnection";

export function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <Button onClick={connect}>Connect</Button>
      <Button onClick={disconnect}>Disconnect</Button>
    </>
  );
}

function App() {
  const [isErasing, setIsErasing] = useState(false);
  const { canvasRef, onMouseDown, onMouseMove, onMouseUp, redo, undo, handleMouseLeave, clearCanvas } = useDrawCanvas({ isErasing });

  const { isConnected, connect, disconnect } = useSocketConnection();

  return (
    <>
      <Button onClick={undo}>Undo</Button>
      <Button onClick={redo}>Redo</Button>
      <Button onClick={clearCanvas}>Clear</Button>
      <Button onClick={() => setIsErasing(!isErasing)}>Toggle Eraser</Button>
      <Button onClick={connect}>Connect</Button>
      <Button onClick={disconnect}>Disconnect</Button>

      <div>{`Is erasing: ${isErasing}`}</div>
      <div>{`Is connected: ${isConnected}`}</div>
      <Canvas
        ref={canvasRef}
        width={800}
        height={800}
        onMouseDown={onMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
    </>
  );
}

export default App;
