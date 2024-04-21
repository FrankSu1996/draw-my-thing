import { Label } from "../label";
import { useRef, useState, type MouseEventHandler } from "react";
import { DrawCanvas } from "./draw-canvas";
import { ReceiveCanvas } from "./receive-canvas";
import { useSize } from "@/lib/hooks/useSize";
import { BrushSize, Color } from "@/lib/config";
import { motion } from "framer-motion";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils/utils";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { Button } from "../button";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Brush, Command, Eraser, Pencil, Trash, Trash2 } from "lucide-react";
import { Input } from "../input";
import { Switch } from "../switch";
import { Toggle } from "../toggle";
import { HoverMotionDiv } from "../animations/hover-motion-div";

export const DrawContainer = () => {
  const [isDrawCanvas, setIsDrawCanvas] = useState(true);
  const canvasParentRef = useRef<HTMLDivElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isErasing, setIsErasing] = useState(false);

  const size = useSize(canvasParentRef);

  const { socket } = useSocketConnection();

  const handleChangeColor = (color: Color) => {
    setSelectedColor(color);
    socket.emit("canvasChangeColor", color);
  };

  const handleClick: MouseEventHandler = (event) => {
    // Find the closest ancestor element that has a 'data-color' attribute
    const element = event.target;
    if (element instanceof HTMLElement) {
      const colorElement = element.closest("[data-color]");
      if (colorElement) {
        // Retrieve the color from the 'data-color' attribute
        const color = colorElement.getAttribute("data-color") as Color;
        if (color) handleChangeColor(color);
      }
    }
  };

  return (
    <div className="relative flex flex-col rounded-xl w-3/5 gap-2">
      <div className="flex-1" ref={canvasParentRef}>
        {isDrawCanvas ? (
          <DrawCanvas width={size && size.width - 5} height={size && size.height - 5} drawColor={selectedColor} />
        ) : (
          <ReceiveCanvas width={size && size.width - 5} height={size && size.height - 5} drawColor={selectedColor} />
        )}
      </div>
      <div className="relative overflow-auto rounded-lg border bg-background py-2">
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <div className="flex h-full overflow-hidden" onClick={handleClick}>
          {Object.values(Color).map((color, index) => {
            return (
              <TooltipProvider key={index}>
                <Tooltip delayDuration={150}>
                  <TooltipTrigger>
                    <HoverMotionDiv key={index} data-color={color} style={{ backgroundColor: color }} className={"h-9 w-9"} />
                  </TooltipTrigger>
                  <TooltipContent align="center" className="rounded-[0.5rem] border text-center bg-accent p-2 mb-1">
                    <p>{color}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
          <Button onClick={() => setIsDrawCanvas(!isDrawCanvas)}>{`Switch to ${isDrawCanvas ? "receive" : "draw"} canvas`}</Button>
          <Popover>
            <PopoverTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button variant="outline" size={"icon"}>
                  <div className={`rounded-full border-foreground border-2 w-5 h-5 bg-foreground`}></div>
                </Button>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="mb-4 bg-accent">
              <div className="grid shadow-2xl rounded">
                {Object.values(BrushSize).map((size, index) => {
                  return (
                    <HoverMotionDiv key={index} className={"cursor-pointer h-10 w-10 relative flex items-center justify-center bg-background"}>
                      <div
                        className={`rounded-full border-foreground border-2`}
                        style={{ backgroundColor: selectedColor || "hsl(var(--foreground))", width: size.cssValue, height: size.cssValue }}
                      ></div>
                    </HoverMotionDiv>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button variant="destructive" size={"icon"}>
              <Trash2 />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Toggle variant="outline" aria-label="Toggle italic" className="px-2" pressed={isErasing} onClick={() => setIsErasing(true)}>
              <Eraser />
            </Toggle>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Toggle variant="outline" aria-label="Toggle italic" className="px-2" pressed={!isErasing} onClick={() => setIsErasing(false)}>
              <Pencil />
            </Toggle>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
