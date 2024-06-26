import { useRef } from "react";
import { useDrawCanvas } from "@/lib/hooks/useCanvas";
import { CanvasToolbar } from "./canvas-toolbar";
import { useSize } from "@/lib/hooks/useSize";
import { useCanvasCursor } from "@/lib/hooks/useCanvasCursor";

export const DrawCanvas = () => {
  const { canvasRef, onMouseDown, onMouseMove, onMouseUp, handleMouseLeave, clearCanvas, undo, redo } = useDrawCanvas();
  const canvasParentRef = useRef<HTMLDivElement | null>(null);
  const size = useSize(canvasParentRef);
  const { cursorUrl, hotspotRadius } = useCanvasCursor();

  return (
    <>
      <div className="flex-1" ref={canvasParentRef}>
        <canvas
          style={{ cursor: `url('${cursorUrl}') ${hotspotRadius} ${hotspotRadius}, auto` }}
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={handleMouseLeave}
          className="bg-muted rounded-lg h-full min-h-64"
          width={size ? size.width - 5 : undefined}
          height={size ? size.height - 5 : undefined}
        ></canvas>
      </div>
      <CanvasToolbar onClearCanvas={clearCanvas} undo={undo} redo={redo} />
    </>
  );
};
