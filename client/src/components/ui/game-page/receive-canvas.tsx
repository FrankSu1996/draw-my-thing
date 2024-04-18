import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { useEffect, useRef } from "react";
import { type ReactSketchCanvasRef, ReactSketchCanvas, type CanvasPath } from "react-sketch-canvas";

export const ReceiveCanvas = () => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const { socket } = useSocketConnection();

  useEffect(() => {
    socket.on("canvasOnChange", (canvasPath: CanvasPath[]) => {
      if (canvasRef.current) {
        canvasRef.current.loadPaths(canvasPath);
      }
    });

    return () => {
      socket.off("canvasOnChange");
    };
  }, [socket]);

  return (
    <ReactSketchCanvas
      width="600"
      height="400"
      strokeWidth={4}
      strokeColor="red"
      className="h-full border rounded"
      onChange={(e) => {
        socket.emit("canvasOnChange", e);
      }}
      ref={canvasRef}
    />
  );
};
