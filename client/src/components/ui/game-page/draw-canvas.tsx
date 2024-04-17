import { ReactSketchCanvas, type ReactSketchCanvasRef } from "react-sketch-canvas";
import { useRef } from "react";

export const DrawCanvas = () => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  return (
    <ReactSketchCanvas
      width="600"
      height="400"
      strokeWidth={4}
      strokeColor="red"
      className="h-full border rounded"
      onChange={(e) => console.log(e)}
      ref={canvasRef}
    />
  );
};
