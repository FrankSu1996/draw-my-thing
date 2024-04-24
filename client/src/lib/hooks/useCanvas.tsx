import { useCallback, useEffect, useRef, useState, type MouseEvent, type MouseEventHandler } from "react";
import type { Point } from "../../../../lib";
import _ from "lodash";
import { CanvasUtils, getCanvasContext, getCanvasCursorRadius, getCanvasLineWidth } from "../utils/canvas-utils";
import { useSocketConnection } from "./useSocketConnection";
import { Color } from "@/lib/config";
import { useSelector } from "react-redux";
import { selectBrushSize, selectDrawColor, selectIsErasing } from "@/redux/gameSlice";
import type { BrushSize } from "../config";

// hook for encapsulating canvas operations on the drawing canvas
export const useDrawCanvas = () => {
  const isErasing = useSelector(selectIsErasing);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { socket, isConnected } = useSocketConnection();
  const drawColor = useSelector(selectDrawColor);
  const brushSize = useSelector(selectBrushSize);
  const lineWidth = getCanvasLineWidth(brushSize);

  // state for drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);

  // configure canvas context every time properties change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      CanvasUtils.configureCanvas(canvas, { isErasing, drawColor, lineWidth });
    }
  }, [isErasing, drawColor, lineWidth]);

  // watch for resize events, debounce the handler so it doesn't overfire
  useEffect(() => {
    const resizeCanvas = _.debounce(() => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        if (canvas) {
          CanvasUtils.configureCanvas(canvas, { isErasing, drawColor, lineWidth });
        }
      }
      if (canvas) {
        CanvasUtils.drawFromImageUrl(canvas, canvasHistory[canvasHistory.length - 1]);
      }
    }, 200);

    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isErasing, canvasHistory, drawColor, lineWidth]);

  const onMouseDown = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (canvasRef.current) {
        const context = getCanvasContext(canvasRef.current);
        if (context && context.lineWidth !== lineWidth) context.lineWidth = lineWidth;
        setIsDrawing(true);
        const startPoint: Point = {
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
        };
        CanvasUtils.beginDrawLine(canvasRef.current, startPoint);
        if (isConnected) socket.emit("canvasMouseDown", startPoint);
      }
    },
    [isConnected, socket, lineWidth]
  );

  const onMouseUp: MouseEventHandler<HTMLCanvasElement> = useCallback(() => {
    if (canvasRef.current) {
      const imageUrl = CanvasUtils.getImageUrl(canvasRef.current);
      if (imageUrl) setCanvasHistory((prev) => [...prev, imageUrl]);
    }
    setIsDrawing(false);
    socket.emit("canvasMouseUp");
  }, [socket]);

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !canvasRef.current) return;

      const endPoint: Point = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      CanvasUtils.drawLine(canvasRef.current, [endPoint]);

      if (isConnected) socket.emit("canvasMouseMove", endPoint);
    },
    [isDrawing, isConnected, socket]
  );

  const undo = useCallback(() => {
    if (canvasHistory.length <= 0) return;

    if (canvasRef.current) {
      if (canvasHistory.length === 1) {
        setUndoStack((prev) => [...prev, canvasHistory[0]]);
        setCanvasHistory([]);
        CanvasUtils.clear(canvasRef.current);
        socket.emit("canvasUndo", null);
        return;
      }
      // Set the new canvas history state to all but the last entry
      const undoStepImageData = canvasHistory[canvasHistory.length - 1];
      const newCanvasHistory = canvasHistory.slice(0, -1);
      setCanvasHistory(newCanvasHistory);
      setUndoStack((prev) => [...prev, undoStepImageData]);

      // Get the second to last canvas image data (now the last after update)
      const lastSavedImageData = newCanvasHistory[newCanvasHistory.length - 1];

      // Put the image data on the canvas
      CanvasUtils.drawFromImageUrl(canvasRef.current, lastSavedImageData);

      // send socket message
      socket.emit("canvasUndo", lastSavedImageData);
    }
  }, [canvasHistory, socket]);

  const redo = useCallback(() => {
    if (undoStack.length <= 0) return;

    const redoImageDataUrl = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));
    setCanvasHistory((prev) => [...prev, redoImageDataUrl]);
    if (canvasRef.current) {
      // Put the image data on the canvas
      CanvasUtils.drawFromImageUrl(canvasRef.current, redoImageDataUrl);
      socket.emit("canvasRedo", redoImageDataUrl);
    }
  }, [undoStack, socket]);

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

export const useReceiveCanvas = () => {
  const { socket, isConnected } = useSocketConnection();
  const [isErasing, setIsErasing] = useState(false);
  const [brushSize, setBrushSize] = useState<BrushSize>("medium");
  const [drawColor, setDrawColor] = useState<Color>(Color.BLACK);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lineWidth = getCanvasLineWidth(brushSize);
  // state for drawing. so we can save the draw state for redrawing on resize
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);

  useEffect(() => {
    if (isConnected && canvasRef.current) {
      const canvas = canvasRef.current;
      socket.on("canvasMouseDown", (point: Point) => {
        CanvasUtils.beginDrawLine(canvas, point);
      });
      socket.on("canvasMouseMove", (point: Point) => {
        if (canvasRef.current) {
          const context = getCanvasContext(canvasRef.current);
          if (context && context.lineWidth !== lineWidth) context.lineWidth = lineWidth;
          CanvasUtils.drawLine(canvas, [point]);
        }
      });
      socket.on("canvasChangeColor", (color: Color) => {
        CanvasUtils.changeColor(canvas, color);
        setDrawColor(color);
      });
      socket.on("canvasChangeDrawMode", (isErasing: boolean) => {
        CanvasUtils.changeDrawMode(canvas, isErasing);
        setIsErasing(isErasing);
      });
      socket.on("canvasUndo", (imageDataUrl: string | null) => {
        if (imageDataUrl) CanvasUtils.drawFromImageUrl(canvas, imageDataUrl);
        else CanvasUtils.clear(canvas);
      });
      socket.on("canvasRedo", (imageDataUrl: string) => {
        CanvasUtils.drawFromImageUrl(canvas, imageDataUrl);
      });
      socket.on("canvasChangeBrushSize", (brushSize: BrushSize) => {
        setBrushSize(brushSize);
        CanvasUtils.changeBrushSize(canvas, brushSize);
      });
      socket.on("canvasClear", () => {
        CanvasUtils.clear(canvas);
      });
      socket.on("canvasMouseUp", () => {
        if (canvasRef.current) {
          const imageUrl = CanvasUtils.getImageUrl(canvasRef.current);
          if (imageUrl) setCanvasHistory((prev) => [...prev, imageUrl]);
        }
      });
    }

    return () => {
      socket.off("canvasMouseDown");
      socket.off("canvasMouseMove");
    };
  }, [isConnected, socket, lineWidth]);

  // watch for resize events, debounce the handler so it doesn't overfire
  useEffect(() => {
    const resizeCanvas = _.debounce(() => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        if (canvas) {
          CanvasUtils.configureCanvas(canvas, { isErasing, drawColor, lineWidth });
        }
      }
      if (canvas) {
        CanvasUtils.drawFromImageUrl(canvas, canvasHistory[canvasHistory.length - 1]);
      }
    }, 200);

    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isErasing, canvasHistory, drawColor, lineWidth]);

  return {
    canvasRef,
  };
};
