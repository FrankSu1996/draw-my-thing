import { CanvasHTMLAttributes, FC, useEffect } from "react";
import { Button } from "./button";
import { useCanvas } from "@/lib/hooks/useCanvas";

type CanvasProps = CanvasHTMLAttributes<HTMLCanvasElement>;

export const Canvas: FC<CanvasProps> = (props) => {
  const { canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, redo, undo, handleMouseLeave } = useCanvas();

  return (
    <>
      <Button onClick={undo}>Undo</Button>
      <Button onClick={redo}>Redo</Button>
      <canvas
        {...props}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border-2 border-gray-300 rounded-lg"
      ></canvas>
    </>
  );
};
