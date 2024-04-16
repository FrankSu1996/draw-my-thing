import { useState } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Canvas } from "@/components/ui/canvas";
import { useDrawCanvas } from "./lib/hooks/useDrawCanvas";
import { useSocketConnection } from "./lib/hooks/useSocketConnection";
import { ThemeToggle } from "./components/ui/theme-toggle";
import { LobbyPage } from "./pages/lobby-page";

function App() {
  const [isErasing, setIsErasing] = useState(false);
  const { canvasRef, onMouseDown, onMouseMove, onMouseUp, redo, undo, handleMouseLeave, clearCanvas } = useDrawCanvas({ isErasing });

  const { isConnected, connect, disconnect } = useSocketConnection();

  return (
    <>
      {/* <Button onClick={undo}>Undo</Button>
      <Button onClick={redo}>Redo</Button>
      <Button onClick={clearCanvas}>Clear</Button>
      <Button onClick={() => setIsErasing(!isErasing)}>Toggle Eraser</Button>

      <img src="/output-onlinepngtools.png" alt="" />
      <div>{`Is erasing: ${isErasing}`}</div>
      <div>{`Is connected: ${isConnected}`}</div>
      <ThemeToggle />
      <Canvas
        ref={canvasRef}
        width={800}
        height={800}
        onMouseDown={onMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      /> */}
      <LobbyPage />
    </>
  );
}

export default App;
