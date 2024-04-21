import { useReceiveCanvas } from "@/lib/hooks/useCanvas";

export const ReceiveCanvas = ({ width, height, drawColor }) => {
  const { canvasRef } = useReceiveCanvas({ isErasing: false, drawColor });

  return <canvas ref={canvasRef} className="bg-muted/50 rounded-lg" width={width} height={height}></canvas>;
};
