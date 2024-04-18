import { ReactSketchCanvas, type CanvasPath, type ReactSketchCanvasRef } from "react-sketch-canvas";
import { useEffect, useRef } from "react";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import _ from "lodash";

export const DrawCanvas = () => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const { socket } = useSocketConnection();

  const throttledCanvasChange = _.throttle((e: CanvasPath[]) => {
    socket.emit("canvasOnChange", e);
  }, 75);

  return (
    <ReactSketchCanvas
      width="600"
      height="400"
      strokeWidth={4}
      strokeColor="red"
      className="h-full border rounded"
      onChange={throttledCanvasChange}
      ref={canvasRef}
    />
  );
};
