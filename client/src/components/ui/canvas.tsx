import { CanvasHTMLAttributes, FC, forwardRef, useEffect } from "react";
import { Button } from "./button";
import { useDrawCanvas } from "@/lib/hooks/useDrawCanvas";

interface CanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {}
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
