import { CanvasHTMLAttributes, FC, forwardRef, useEffect } from "react";
import { Button } from "./button";
import { useCanvas } from "@/lib/hooks/useCanvas";

interface CanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  isErasing?: boolean;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
  return (
    <>
      <canvas
        {...props}
        ref={ref}
        onMouseDown={props.onMouseDown}
        onMouseLeave={props.onMouseLeave}
        onMouseMove={props.onMouseMove}
        onMouseUp={props.onMouseUp}
        className="border-2 border-gray-300 rounded-lg"
      ></canvas>
    </>
  );
});
