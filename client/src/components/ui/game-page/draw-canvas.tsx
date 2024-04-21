import { ReactSketchCanvas, type CanvasPath, type ReactSketchCanvasRef } from "react-sketch-canvas";
import { useEffect, useRef, useState } from "react";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import _ from "lodash";
import { useDrawCanvas } from "@/lib/hooks/useCanvas";
import { Button } from "../button";
import { CanvasToolbar } from "./canvas-toolbar";
import type { Color } from "@/lib/config";
import { useSize } from "@/lib/hooks/useSize";

export const DrawCanvas = () => {
  const [drawColor, setDrawColor] = useState<Color | null>(null);
  const { canvasRef, onMouseDown, onMouseMove, onMouseUp, handleMouseLeave } = useDrawCanvas({ isErasing: false, drawColor });
  const canvasParentRef = useRef<HTMLDivElement | null>(null);

  const size = useSize(canvasParentRef);
  const { socket } = useSocketConnection();

  const handleChangeColor = (color: Color) => {
    setDrawColor(color);
    socket.emit("canvasChangeColor", color);
  };

  return (
    <>
      <div className="flex-1" ref={canvasParentRef}>
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={handleMouseLeave}
          className="bg-muted/50 rounded-lg"
          width={size && size.width - 5}
          height={size && size.height - 5}
        ></canvas>
      </div>
      <CanvasToolbar onChangeColor={handleChangeColor} />
    </>
  );
};
