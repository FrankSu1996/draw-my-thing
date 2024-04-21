import { ReactSketchCanvas, type CanvasPath, type ReactSketchCanvasRef } from "react-sketch-canvas";
import { useEffect, useRef } from "react";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import _ from "lodash";
import { useDrawCanvas } from "@/lib/hooks/useCanvas";
import { Button } from "../button";

export const DrawCanvas = ({ width, height, drawColor }) => {
  const { canvasRef, onMouseDown, onMouseMove, onMouseUp, handleMouseLeave } = useDrawCanvas({ isErasing: false, drawColor });

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={handleMouseLeave}
      className="bg-muted/50 rounded-lg"
      width={width}
      height={height}
    ></canvas>
  );
};
