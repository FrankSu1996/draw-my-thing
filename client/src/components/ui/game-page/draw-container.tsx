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
import { Brush, Command } from "lucide-react";
import { Input } from "../input";

export const DrawContainer = () => {
  const [isDrawCanvas, setIsDrawCanvas] = useState(true);
  const canvasParentRef = useRef<HTMLDivElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

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
                    <motion.div
                      data-color={color}
                      key={index}
                      className={cn("cursor-pointer h-9 w-9 relative")}
                      style={{ backgroundColor: color }}
                      initial={{ borderRadius: "10%", borderWidth: "1px" }}
                      transition={{ borderWidth: { duration: 0 } }}
                      whileHover={{
                        scale: 1.1,
                        zIndex: 9999,
                        borderRadius: "calc(15% * 1.1)",
                        boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
                        borderWidth: "4px",
                      }}
                    ></motion.div>
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
              <Button variant="outline" size={"icon"}>
                <Brush size={25} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mb-4 bg-accent">
              <div className="grid shadow-2xl rounded">
                {Object.values(BrushSize).map((size, index) => {
                  return (
                    <motion.div
                      key={index}
                      className={cn("cursor-pointer h-10 w-10 relative flex items-center justify-center bg-background")}
                      initial={{ borderRadius: "10%", borderWidth: "1px" }}
                      whileHover={{
                        scale: 1.15,
                        zIndex: 9999,
                        borderWidth: "4px",
                        borderRadius: "calc(15% * 1.1)",
                        boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
                      }}
                      transition={{ borderWidth: { duration: 0 } }}
                    >
                      <div
                        className={`rounded-full border-foreground border-2`}
                        style={{ backgroundColor: selectedColor || "hsl(var(--foreground))", width: size.cssValue, height: size.cssValue }}
                      ></div>
                    </motion.div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
