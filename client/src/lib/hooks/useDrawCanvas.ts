import { useCallback, useEffect, useRef, useState, type MouseEvent, type MouseEventHandler } from "react";
import type { Line, Point } from "../../../../lib";
import _ from "lodash";
import { CanvasUtils, getCanvasContext } from "../utils/canvasUtils";

type UseCanvasConfig = {
  isErasing?: boolean;
};

// hook for encapsulating canvas operations on the drawing canvas
export const useDrawCanvas = ({ isErasing }: UseCanvasConfig) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // state for drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);

  // configure canvas context and watch for change in isErasing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = getCanvasContext(canvas);
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        context;
        // Set the stroke style and globalCompositeOperation based on whether erasing or drawing
        context.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
      }
    }
  }, [isErasing]);

  const onMouseDown = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      setIsDrawing(true);
      const startPoint = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      CanvasUtils.beginDrawLine(canvasRef.current, startPoint);
    }
  }, []);

  const onMouseUp: MouseEventHandler<HTMLCanvasElement> = useCallback(() => {
    if (canvasRef.current) {
      const imageData = CanvasUtils.getImageData(canvasRef.current);
      if (imageData) setCanvasHistory((prev) => [...prev, imageData]);
    }
    setIsDrawing(false);
  }, []);

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !canvasRef.current) return;

      const endPoint: Point = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      CanvasUtils.drawLine(canvasRef.current, [endPoint]);
    },
    [isDrawing]
  );

  const undo = useCallback(() => {
    if (canvasHistory.length <= 0) return;

    if (canvasRef.current) {
      if (canvasHistory.length === 1) {
        setUndoStack((prev) => [...prev, canvasHistory[0]]);
        setCanvasHistory([]);
        CanvasUtils.clear(canvasRef.current);
        return;
      }
      // Set the new canvas history state to all but the last entry
      const undoStepImageData = canvasHistory[canvasHistory.length - 1];
      const newCanvasHistory = canvasHistory.slice(0, -1);
      setCanvasHistory(newCanvasHistory);
      setUndoStack((prev) => [...prev, undoStepImageData]);

      // Clear the canvas
      CanvasUtils.clear(canvasRef.current);

      // Get the second to last canvas image data (now the last after update)
      const lastSavedImageData = newCanvasHistory[newCanvasHistory.length - 1];

      // Put the image data on the canvas
      CanvasUtils.putImageData(canvasRef.current, lastSavedImageData);
    }
  }, [canvasHistory]);

  const redo = useCallback(() => {
    if (undoStack.length <= 0) return;

    const redoImageData = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));
    setCanvasHistory((prev) => [...prev, redoImageData]);
    if (canvasRef.current) {
      // Clear the canvas
      CanvasUtils.clear(canvasRef.current);
      // Put the image data on the canvas
      CanvasUtils.putImageData(canvasRef.current, redoImageData);
    }
  }, [undoStack]);

  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    if (canvasRef.current) {
      CanvasUtils.clear(canvasRef.current);
      setIsDrawing(false);
      setUndoStack([]);
      setCanvasHistory([]);
    }
  }, []);

  return {
    canvasRef,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    undo,
    redo,
    handleMouseLeave,
    clearCanvas,
  };
};
