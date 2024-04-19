import { ReactSketchCanvas, type CanvasPath, type ReactSketchCanvasRef } from "react-sketch-canvas";
import { useEffect, useRef } from "react";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import _ from "lodash";
import { useDrawCanvas } from "@/lib/hooks/useCanvas";
import { Button } from "../button";

export const DrawCanvas = () => {
  const { canvasRef, onMouseDown, onMouseMove, onMouseUp } = useDrawCanvas({ isErasing: false });

  return <canvas ref={canvasRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}></canvas>;
};
