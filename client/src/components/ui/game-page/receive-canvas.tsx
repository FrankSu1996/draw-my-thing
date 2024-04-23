import { useReceiveCanvas } from "@/lib/hooks/useCanvas";
import { useCanvasCursor } from "@/lib/hooks/useCanvasCursor";
import { useSize } from "@/lib/hooks/useSize";
import { useRef } from "react";

export const ReceiveCanvas = () => {
  const { canvasRef } = useReceiveCanvas();

  const canvasParentRef = useRef<HTMLDivElement | null>(null);

  const size = useSize(canvasParentRef);

  return (
    <div className="flex-1" ref={canvasParentRef}>
      <canvas
        ref={canvasRef}
        className="bg-muted rounded-lg h-full"
        width={size ? size.width - 5 : undefined}
        height={size ? size.height - 5 : undefined}
      ></canvas>
    </div>
  );
};
