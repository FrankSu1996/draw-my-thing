import { useRef, useState } from "react";
import _ from "lodash";
import { useDrawCanvas } from "@/lib/hooks/useCanvas";
import { CanvasToolbar } from "./canvas-toolbar";
import { BrushSize } from "@/lib/config";
import { useSize } from "@/lib/hooks/useSize";

export const DrawCanvas = () => {
  const [isErasing, setIsErasing] = useState(false);
  const [brushSize, setBrushSize] = useState<BrushSize>("medium");
  const { canvasRef, onMouseDown, onMouseMove, onMouseUp, handleMouseLeave, clearCanvas } = useDrawCanvas({ isErasing });
  const canvasParentRef = useRef<HTMLDivElement | null>(null);

  const size = useSize(canvasParentRef);

  return (
    <>
      <div className="flex-1" ref={canvasParentRef}>
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={handleMouseLeave}
          className="bg-muted/50 rounded-lg h-full"
          width={size ? size.width - 5 : undefined}
          height={size ? size.height - 5 : undefined}
        ></canvas>
      </div>
      <CanvasToolbar
        brushSize={brushSize}
        onChangeBrushSize={(brushSize) => setBrushSize(brushSize)}
        onChangeDrawMode={(isErasing) => setIsErasing(isErasing)}
        isErasing={isErasing}
        onClearCanvas={clearCanvas}
      />
    </>
  );
};
