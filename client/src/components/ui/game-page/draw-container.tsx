import { Button } from "../button";
import { Label } from "../label";
import { useState } from "react";
import { DrawCanvas } from "./draw-canvas";
import { ReceiveCanvas } from "./receive-canvas";

export const DrawContainer = () => {
  const [isDrawCanvas, setIsDrawCanvas] = useState(true);

  return (
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 w-3/5 gap-5">
      <div className="h-full w-full">{isDrawCanvas ? <DrawCanvas /> : <ReceiveCanvas />}</div>
      <div
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        x-chunk="dashboard-03-chunk-1"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <div className="flex h-32">
          <Button onClick={() => setIsDrawCanvas(!isDrawCanvas)}>{`Switch to ${isDrawCanvas ? "receive" : "draw"} canvas`}</Button>
        </div>
      </div>
    </div>
  );
};
