import { Label } from "../label";
import { useEffect, useRef, useState } from "react";
import { DrawCanvas } from "./draw-canvas";
import { ReceiveCanvas } from "./receive-canvas";
import { useSize } from "@/lib/hooks/useSize";
import { Button } from "../button";

export const DrawContainer = () => {
  const [isDrawCanvas, setIsDrawCanvas] = useState(true);
  const canvasParentRef = useRef<HTMLDivElement | null>(null);

  const size = useSize(canvasParentRef);

  return (
    <div className="relative flex h-full flex-col rounded-xl w-3/5">
      <div className="p-4 flex-1 shrink" ref={canvasParentRef}>
        {isDrawCanvas ? <DrawCanvas width={size?.width} height={size?.height} /> : <ReceiveCanvas width={size?.width} height={size?.height} />}
      </div>
      <div
        className="mx-4 relative overflow-auto rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring basis-1/4"
        x-chunk="dashboard-03-chunk-1"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <div className="flex">
          {/* <Button onClick={() => setIsDrawCanvas(!isDrawCanvas)}>{`Switch to ${isDrawCanvas ? "receive" : "draw"} canvas`}</Button> */}
        </div>
      </div>
    </div>
  );
};
