import { CanvasHTMLAttributes, useEffect, useRef } from "react";

type CanvasProps = CanvasHTMLAttributes<HTMLCanvasElement>;

export const Canvas: React.FC<CanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  // initialize canvas context on mount
  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext("2d");
    }
  }, []);

  return <canvas {...props} ref={canvasRef}></canvas>;
};
