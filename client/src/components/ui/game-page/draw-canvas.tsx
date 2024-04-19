import { ReactSketchCanvas, type CanvasPath, type ReactSketchCanvasRef } from "react-sketch-canvas";
import { useEffect, useRef } from "react";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import _ from "lodash";
import { useDrawCanvas } from "@/lib/hooks/useCanvas";
import { Button } from "../button";

export const DrawCanvas = ({ width, height }) => {
  const { canvasRef, onMouseDown, onMouseMove, onMouseUp } = useDrawCanvas({ isErasing: false });

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      className="bg-muted/50 rounded-lg"
      width={width}
      height={height}
    ></canvas>
  );
};
