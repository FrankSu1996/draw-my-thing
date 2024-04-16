import { useCallback, useEffect, useRef, useState, type MouseEvent, type MouseEventHandler } from "react";
import type { Line, Point } from "../../../../lib";
import { CanvasUtils } from "../utils";
import _ from "lodash";

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

  const undo = useCallback(() => {
    if (lineHistory.length <= 0) return;
    const undoLine = lineHistory[lineHistory.length - 1];
    const newHistory = [...lineHistory];
    newHistory.pop();
    setLineHistory(newHistory);
    setUndoStack((prev) => [...prev, undoLine]);
    if (canvasRef.current) {
      CanvasUtils.clear(canvasRef.current);
      for (const line of newHistory) {
        CanvasUtils.beginDrawLine(canvasRef.current, line[0]);
        CanvasUtils.drawLine(canvasRef.current, line);
      }
    }
  }, [lineHistory]);

  const redo = useCallback(() => {
    if (undoStack.length <= 0) return;

    const redoLine = undoStack[undoStack.length - 1];
    const newHistory = [...lineHistory];
    newHistory.push(redoLine);
    setLineHistory(newHistory);
    setUndoStack(undoStack.slice(0, -1));

    if (canvasRef.current) {
      CanvasUtils.clear(canvasRef.current);
      for (const line of newHistory) {
        CanvasUtils.beginDrawLine(canvasRef.current, line[0]);
        CanvasUtils.drawLine(canvasRef.current, line);
      }
    }
  }, [lineHistory, undoStack]);

  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
  }, []);

  return {
    canvasRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    undo,
    redo,
    handleMouseLeave,
  };
};
