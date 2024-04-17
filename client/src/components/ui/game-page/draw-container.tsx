import { CornerDownLeft } from "lucide-react";
import { Button } from "../button";
import { Textarea } from "../textarea";
import { Label } from "../label";
import { useRef } from "react";
import { ReactSketchCanvas, type ReactSketchCanvasRef } from "react-sketch-canvas";

export const DrawContainer = () => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const styles = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
  };
  return (
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 w-3/5 gap-5">
      <div className="h-full w-full">
        <ReactSketchCanvas
          style={styles}
          width="600"
          height="400"
          strokeWidth={4}
          strokeColor="red"
          className="h-full"
          onChange={(e) => console.log(e)}
          ref={canvasRef}
        />
      </div>
      <form
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        x-chunk="dashboard-03-chunk-1"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button type="submit" size="sm" className="ml-auto gap-1.5">
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
};
