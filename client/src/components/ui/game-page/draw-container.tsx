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
import { CanvasToolbar } from "./canvas-toolbar";

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
      <CanvasToolbar />
    </div>
  );
};
