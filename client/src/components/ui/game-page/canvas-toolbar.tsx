import { BrushSize } from "@/lib/config";
import { Label } from "@radix-ui/react-label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Trash2, Eraser, Pencil } from "lucide-react";
import { Color } from "@/lib/config";
import { HoverMotionDiv } from "../animations/hover-motion-div";
import { Button } from "../button";
import { Toggle } from "../toggle";
import { useState, type MouseEventHandler } from "react";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { cn } from "@/lib/utils/utils";
import { Close } from "@radix-ui/react-popover";

export const CanvasToolbar = () => {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isErasing, setIsErasing] = useState(false);
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
    <div className="relative overflow-auto rounded-lg border bg-background">
      <Label htmlFor="message" className="sr-only">
        Message
      </Label>
      <div className="flex h-full overflow-hidden p-1" onClick={handleClick}>
        {Object.values(Color).map((color, index) => {
          return (
            <TooltipProvider key={index}>
              <Tooltip delayDuration={150}>
                <TooltipTrigger>
                  <HoverMotionDiv key={index} data-color={color} style={{ backgroundColor: color }} className={"h-9 w-9"} />
                </TooltipTrigger>
                <TooltipContent align="center" className="rounded-[0.5rem] border text-center bg-accent p-2 mb-1" side="bottom">
                  <p>{color}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger>
              <Popover>
                <PopoverTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1, zIndex: 9999 }}>
                    <Button variant="outline" size={"icon"}>
                      <div
                        className={`rounded-full border-foreground border-2 w-5 h-5`}
                        style={{ backgroundColor: selectedColor || "hsl(var(--foreground))" }}
                      ></div>
                    </Button>
                  </motion.div>
                </PopoverTrigger>
                <PopoverContent className="bg-accent w-full p-0">
                  <div className="grid shadow-2xl rounded">
                    {Object.values(BrushSize).map((size, index) => {
                      return (
                        <Close>
                          <HoverMotionDiv key={index} className={"cursor-pointer h-10 w-10 relative flex items-center justify-center bg-background"}>
                            <div
                              className={`rounded-full border-foreground border-2`}
                              style={{ backgroundColor: selectedColor || "hsl(var(--foreground))", width: size.cssValue, height: size.cssValue }}
                            ></div>
                          </HoverMotionDiv>
                        </Close>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent align="center" className="rounded-[0.5rem] border text-center bg-accent p-2 mb-1" side="bottom">
              <p>Select Brush Size</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger>
              <motion.div whileHover={{ scale: 1.1, zIndex: 9999 }}>
                <Button variant="destructive" size={"icon"}>
                  <Trash2 />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent align="center" className="rounded-[0.5rem] border text-center bg-accent p-2 mb-1" side="bottom">
              <p>Clear Canvas</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger>
              <motion.div whileHover={{ scale: 1.1, zIndex: 9999 }}>
                <Toggle
                  variant="outline"
                  aria-label="Toggle italic"
                  className={cn("px-2", isErasing && "border-2 border-solid border-foreground")}
                  pressed={isErasing}
                  onClick={() => setIsErasing(true)}
                >
                  <Eraser />
                </Toggle>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent align="center" className="rounded-[0.5rem] border text-center bg-accent p-2 mb-1" side="bottom">
              <p>Erase</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger>
              <motion.div whileHover={{ scale: 1.1, zIndex: 9999 }}>
                <Toggle
                  variant="outline"
                  aria-label="Toggle italic"
                  className={cn("px-2", !isErasing && "border-2 border-solid border-foreground")}
                  pressed={!isErasing}
                  onClick={() => setIsErasing(false)}
                >
                  <Pencil />
                </Toggle>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent align="center" className="rounded-[0.5rem] border text-center bg-accent p-2 mb-1" side="bottom">
              <p>Draw</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
