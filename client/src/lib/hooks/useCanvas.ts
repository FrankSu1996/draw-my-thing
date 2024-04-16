import { useCallback, useEffect, useRef, useState, type MouseEvent, type MouseEventHandler } from "react";
import type { Line, Point } from "../../../../lib";
import { CanvasUtils } from "../utils";

// hook for encapsulating canvas operations
export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // state for drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineHistory, setLineHistory] = useState<Line[]>([]);
  const [undoStack, setUndoStack] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Line>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
      }
    }
  }, []);

  const handleMouseDown = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      setIsDrawing(true);
      const startPoint = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      CanvasUtils.beginDrawLine(canvasRef.current, startPoint);
    }
  }, []);

  const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = useCallback(() => {
    if (currentLine.length > 0) {
      setLineHistory((history) => [...history, currentLine]);
      setCurrentLine([]);
    }
    setIsDrawing(false);
  }, [currentLine]);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !canvasRef.current) return;

      const endPoint: Point = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      setCurrentLine((current) => [...current, endPoint]);
      CanvasUtils.drawLine(canvasRef.current, [endPoint]);
    },
    [isDrawing]
  );

  const undo = () => {};

  const redo = () => {};

  const methods = {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    undo,
    redo,
  };

  return {
    canvasRef,
    methods,
  };
};
