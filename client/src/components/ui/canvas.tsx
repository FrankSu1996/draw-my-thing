import { CanvasHTMLAttributes, FC, MouseEventHandler, useEffect, useRef, useState } from "react";
import { Button } from "./button";

type CanvasProps = CanvasHTMLAttributes<HTMLCanvasElement>;
type Point = {
  x: number;
  y: number;
};
type Line = Point[];

export const Canvas: FC<CanvasProps> = (props) => {
  // references to html5 canvas and it's context
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  // state for drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineHistory, setLineHistory] = useState<Line[]>([]);
  const [undoStack, setUndoStack] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Line>([]);

  useEffect(() => {
    console.log(undoStack);
  }, [undoStack]);

  // initialize canvas context on mount
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 800;
      canvas.height = 800;
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        canvasCtxRef.current = context;
      }
    }
  }, []);

  const beginDraw: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const contextRef = canvasCtxRef.current;
    if (contextRef) {
      const point: Point = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      contextRef.beginPath();
      contextRef.moveTo(point.x, point.y);
      setIsDrawing(true);
    }
  };

  const updateDraw: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!isDrawing) return;
    const contextRef = canvasCtxRef.current;

    if (contextRef) {
      const point: Point = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      const newLine = [...currentLine];
      newLine.push(point);
      setCurrentLine(newLine);
      contextRef.lineTo(point.x, point.y);
      contextRef.stroke();
    }
  };

  const endDraw = () => {
    const contextRef = canvasCtxRef.current;
    if (contextRef) {
      const newLineHistory = [...lineHistory];
      newLineHistory.push(currentLine);
      setLineHistory(newLineHistory);
      setCurrentLine([]);
      contextRef.closePath();
    }
    setIsDrawing(false);
  };

  const undo = () => {
    const canvasContext = canvasCtxRef.current;
    if (canvasContext) {
      canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
      const newHistory = [...lineHistory];

      if (newHistory.length > 0) {
        const undo = newHistory.pop();
        if (undo) setUndoStack([...undoStack, undo]);

        setLineHistory(newHistory);
        for (const line of newHistory) {
          canvasContext.beginPath();
          for (const point of line) {
            canvasContext.lineTo(point.x, point.y);
            canvasContext.stroke();
          }
          canvasContext.closePath();
        }
      }
    }
  };

  const redo = () => {
    if (undoStack.length <= 0) return;

    const newUndoStack = [...undoStack];
    const redoLine = newUndoStack.pop();
    setUndoStack(newUndoStack);
    if (redoLine) {
      const canvasContext = canvasCtxRef.current;
      if (canvasContext) {
        canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
        const newHistory = [...lineHistory];
        newHistory.push(redoLine);
        setLineHistory(newHistory);

        for (const line of newHistory) {
          canvasContext.beginPath();
          for (const point of line) {
            canvasContext.lineTo(point.x, point.y);
            canvasContext.stroke();
          }
          canvasContext.closePath();
        }
      }
    }
  };

  return (
    <>
      <Button onClick={undo}>Undo</Button>
      <Button onClick={redo}>Redo</Button>
      <canvas {...props} ref={canvasRef} onMouseDown={beginDraw} onMouseMove={updateDraw} onMouseUp={endDraw} className="border-2 border-gray-300 rounded-lg"></canvas>
    </>
  );
};
