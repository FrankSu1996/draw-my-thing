import { useCallback, useEffect, useRef, useState, type MouseEvent, type MouseEventHandler } from "react";
import type { Point } from "../../../../lib";
import _ from "lodash";
import { CanvasUtils, getCanvasContext, getCanvasCursorRadius, getCanvasLineWidth } from "../utils/canvas-utils";
import { useSocketConnection } from "./useSocketConnection";
import { type Color } from "../../../../lib";
import { useSelector } from "react-redux";
import { selectBrushSize, selectDrawColor, selectIsErasing, setBrushSize } from "@/redux/gameSlice";
import type { BrushSize } from "../config";

// hook for encapsulating canvas operations on the drawing canvas
export const useDrawCanvas = () => {
  const isErasing = useSelector(selectIsErasing);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { socket, isConnected } = useSocketConnection();
  const drawColor = useSelector(selectDrawColor);
  const brushSize = useSelector(selectBrushSize);
  const radius = getCanvasLineWidth(brushSize);

  // state for drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  console.log(canvasHistory);

  // configure canvas context every time properties change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = getCanvasContext(canvas);
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = drawColor;
        context.lineWidth = radius;
        // Set the stroke style and globalCompositeOperation based on whether erasing or drawing
        context.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
      }
    }
  }, [isErasing, drawColor, radius]);

  // watch for resize events, debounce the handler so it doesn't overfire
  useEffect(() => {
    const resizeCanvas = _.debounce(() => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        const context = canvas.getContext("2d");
        if (context) {
          context.lineCap = "round";
          context.strokeStyle = drawColor;
          context.lineWidth = radius;
          // Set the stroke style and globalCompositeOperation based on whether erasing or drawing
          context.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
        }
      }
      if (canvas) {
        CanvasUtils.drawFromImageUrl(canvas, canvasHistory[canvasHistory.length - 1]);
      }
    }, 250);

    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isErasing, canvasHistory, drawColor, radius]);

  const onMouseDown = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (canvasRef.current) {
        const context = getCanvasContext(canvasRef.current);
        if (context && context.lineWidth !== radius) context.lineWidth = radius;
        setIsDrawing(true);
        const startPoint: Point = {
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
        };
        CanvasUtils.beginDrawLine(canvasRef.current, startPoint);
        if (isConnected) socket.emit("canvasMouseDown", startPoint);
      }
    },
    [isConnected, socket, radius]
  );

  const onMouseUp: MouseEventHandler<HTMLCanvasElement> = useCallback(() => {
    if (canvasRef.current) {
      const imageUrl = CanvasUtils.getImageUrl(canvasRef.current);
      if (imageUrl) setCanvasHistory((prev) => [...prev, imageUrl]);
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [brushSize, setBrushSize] = useState<BrushSize>("medium");
  const radius = getCanvasLineWidth(brushSize);

  useEffect(() => {
    if (isConnected && canvasRef.current) {
      const canvas = canvasRef.current;
      socket.on("canvasMouseDown", (point: Point) => {
        CanvasUtils.beginDrawLine(canvas, point);
      });
      socket.on("canvasMouseMove", (point: Point) => {
        if (canvasRef.current) {
          const context = getCanvasContext(canvasRef.current);
          if (context && context.lineWidth !== radius) context.lineWidth = radius;
          CanvasUtils.drawLine(canvas, [point]);
        }
      });
      socket.on("canvasChangeColor", (color: Color) => {
        CanvasUtils.changeColor(canvas, color);
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
    }

    return () => {
      socket.off("canvasMouseDown");
      socket.off("canvasMouseMove");
    };
  }, [isConnected, socket, radius]);

  // configure canvas context and watch for change in isErasing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = getCanvasContext(canvas);
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = "black";
        context;
        // Set the stroke style and globalCompositeOperation based on whether erasing or drawing
        context.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
      }
    }
  }, [isErasing]);

  // watch for resize events, debounce the handler so it doesn't overfire
  useEffect(() => {
    const resizeCanvas = _.debounce(() => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        const context = canvas.getContext("2d");
        if (context) {
          context.lineCap = "round";
          context.strokeStyle = "black";
          // Set the stroke style and globalCompositeOperation based on whether erasing or drawing
          context.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
        }
      }
    }, 100);

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isErasing]);

  return {
    canvasRef,
  };
};
