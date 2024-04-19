import { useDrawCanvas, useReceiveCanvas } from "@/lib/hooks/useCanvas";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { CanvasUtils } from "@/lib/utils/canvas-utils";
import { useEffect, useRef } from "react";
import { type ReactSketchCanvasRef, ReactSketchCanvas, type CanvasPath } from "react-sketch-canvas";

export const ReceiveCanvas = () => {
  const { canvasRef } = useReceiveCanvas({ isErasing: false });

  return <canvas ref={canvasRef} className="bg-muted/50 rounded-lg"></canvas>;
};
