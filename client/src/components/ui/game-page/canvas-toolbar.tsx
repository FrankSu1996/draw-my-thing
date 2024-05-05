import { BrushSize } from "@/lib/config";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Trash2, Eraser, Pencil, Undo, Undo2, Redo2 } from "lucide-react";
import { Color } from "@/lib/config";
import { HoverMotionDiv } from "../animations/hover-motion-div";
import { Button } from "../button";
import { Toggle } from "../toggle";
import { cn } from "@/lib/utils/utils";
import { Close } from "@radix-ui/react-popover";
import { useDispatch, useSelector } from "react-redux";
import { selectDrawColor, selectIsErasing, setBrushSize, setDrawColor, setIsErasing } from "@/redux/gameSlice";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";

const ColorPicker = () => {
  const dispatch = useDispatch();
  const { socket } = useSocketConnection();

  return Object.values(Color).map((color, index) => {
    return (
      <TooltipProvider key={index}>
        <Tooltip delayDuration={150}>
          <TooltipTrigger>
            <HoverMotionDiv
              key={index}
              style={{ backgroundColor: color }}
              className={"h-9 w-9"}
              onClick={() => {
                dispatch(setDrawColor(color));
                dispatch(setIsErasing(false));
                socket.emit("canvasChangeColor", color);
              }}
            />
          </TooltipTrigger>
          <TooltipContent align="center" className="rounded-[0.5rem] border text-center bg-accent p-2 mb-1" side="bottom">
            <p>{color}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  });
};

const BrushSizePicker = () => {
  const drawColor = useSelector(selectDrawColor);
  const dispatch = useDispatch();
  const { socket } = useSocketConnection();
  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger>
          <Popover>
            <PopoverTrigger asChild>
              <motion.div whileHover={{ scale: 1.1, zIndex: 9999 }}>
                <Button variant="outline" size={"icon"}>
                  <div
                    className={`rounded-full border-foreground border-2 w-5 h-5`}
                    style={{ backgroundColor: drawColor || "hsl(var(--foreground))" }}
                  ></div>
                </Button>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="bg-accent w-full p-0">
              <div className="grid shadow-2xl rounded">
                {Object.entries(BrushSize).map(([key, entry], index) => {
                  return (
                    <Close
                      onClick={() => {
                        const brushSize = key as BrushSize;
                        dispatch(setBrushSize(brushSize));
                        socket.emit("canvasChangeBrushSize", brushSize);
                      }}
                      key={index}
                    >
                      <HoverMotionDiv key={index} className={"cursor-pointer h-10 w-10 relative flex items-center justify-center bg-background"}>
                        <div
                          className={`rounded-full border-foreground border-2`}
                          style={{ backgroundColor: drawColor || "hsl(var(--foreground))", width: entry.cssValue, height: entry.cssValue }}
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
  );
};

type ToolbarProps = {
  onClearCanvas: () => void;
  undo: () => void;
  redo: () => void;
};
export const CanvasToolbar = ({ onClearCanvas, undo, redo }: ToolbarProps) => {
  const isErasing = useSelector(selectIsErasing);
  const dispatch = useDispatch();
  const { socket } = useSocketConnection();

  return (
    <div className="relative overflow-auto rounded-lg bg-background">
      <div className="flex h-full overflow-hidden flex-wrap justify-between items-center">
        <div className="flex items-center justify-center">
          <ColorPicker />
        </div>
        <div className="flex items-center justify-center p-1 gap-1">
          <BrushSizePicker />
          <TooltipProvider>
            <Tooltip delayDuration={150}>
              <TooltipTrigger>
                <motion.div whileHover={{ scale: 1.1, zIndex: 9999 }}>
                  <Toggle
                    variant="outline"
                    aria-label="Toggle italic"
                    className={cn("px-2", !isErasing && "border-2 border-solid border-foreground")}
                    pressed={!isErasing}
                    onClick={() => {
                      dispatch(setIsErasing(false));
                      socket.emit("canvasChangeDrawMode", false);
                    }}
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
          <TooltipProvider>
            <Tooltip delayDuration={150}>
              <TooltipTrigger>
                <motion.div whileHover={{ scale: 1.1, zIndex: 9999 }}>
                  <Toggle
                    variant="outline"
                    aria-label="Toggle italic"
                    className={cn("px-2", isErasing && "border-2 border-solid border-foreground")}
                    pressed={isErasing}
                    onClick={() => {
                      dispatch(setIsErasing(true));
                      socket.emit("canvasChangeDrawMode", true);
                    }}
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
        </div>
        <div className="flex items-center justify-center p-1 gap-1">
          <TooltipProvider>
            <Tooltip delayDuration={150}>
              <TooltipTrigger>
                <motion.div
                  whileHover={{ scale: 1.1, zIndex: 9999 }}
                  onClick={() => {
                    onClearCanvas();
                    socket.emit("canvasClear");
                  }}
                >
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
                <motion.div whileHover={{ scale: 1.1, zIndex: 9999 }} onClick={undo}>
                  <Button variant="secondary" size={"icon"}>
                    <Undo2 />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent align="center" className="rounded-[0.5rem] border text-center bg-accent p-2 mb-1" side="bottom">
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip delayDuration={150}>
              <TooltipTrigger>
                <motion.div whileHover={{ scale: 1.1, zIndex: 9999 }} onClick={redo}>
                  <Button variant="secondary" size={"icon"}>
                    <Redo2 />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent align="center" className="rounded-[0.5rem] border text-center bg-accent p-2 mb-1" side="bottom">
                <p>Redo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
