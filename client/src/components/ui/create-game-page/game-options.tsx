import { useForm, SubmitHandler, type UseControllerProps, useController, type Control } from "react-hook-form";
import { Button } from "../button";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { randomString } from "@/lib/utils/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";
import { useEffect, useRef, useState, type ComponentType, type FC, type ReactElement } from "react";
import { AlarmClock, UserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSize } from "@/lib/hooks/useSize";
import { MAX_PLAYERS } from "@/lib/config";
import { ScrollArea } from "../scroll-area";

type Options = {
  numPlayers: number;
  drawTime: number;
  rounds: number;
  wordMode: "normal" | "hidden" | "combination";
  wordCount: number;
  hints: number;
};

type DropdownProps = UseControllerProps<Options> & {
  selected: string;
  items: string[];
};

// this dropdown has it's dropdown elements dynamically resize to the selected item's container
function GameOptionDropdown(props: DropdownProps) {
  const triggerElRef = useRef<HTMLButtonElement>(null);
  const size = useSize(triggerElRef);
  const { field } = useController(props);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border rounded-lg flex-1 flex" ref={triggerElRef}>
        <b className="p-1 pl-3">{props.selected}</b>
      </DropdownMenuTrigger>
      <DropdownMenuContent style={{ width: `${parseInt(size?.width)}px` }}>
        <ScrollArea className="h-72 rounded-md">
          {props.items.map((item, idx) => {
            return (
              <>
                <DropdownMenuItem key={idx} onClick={() => field.onChange(item)}>
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            );
          })}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type GameOptionRowProps = {
  label: string;
  dropdown: ReactElement;
  avatar: ReactElement;
};
const GameOptionRow: FC<GameOptionRowProps> = ({ avatar, dropdown, label }) => {
  return (
    <div className="flex align-center justify-between">
      <div className="flex gap-4 flex-1">
        {avatar}
        <b>{label}</b>
      </div>
      {dropdown}
    </div>
  );
};
const PlayersOptionRow = ({ control }) => {
  const avatar = <UserRound size={30} />;
  const items = Array.from({ length: MAX_PLAYERS })
    .map((_, idx) => (idx + 1).toString())
    .slice(1);
  const dropdown = <GameOptionDropdown selected="3" items={items} name="numPlayers" control={control} />;
  return <GameOptionRow avatar={avatar} dropdown={dropdown} label="Players" />;
};
const DrawTimeOptionRow = ({ control }) => {
  const avatar = <AlarmClock size={30} />;
  const dropdown = <GameOptionDropdown selected="3" items={["1", "2", "3"]} name="drawTime" control={control} />;
  return <GameOptionRow avatar={avatar} dropdown={dropdown} label="Drawtime" />;
};

export const GameOptions = () => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Options>({
    defaultValues: {
      numPlayers: 6,
      drawTime: 80,
      rounds: 4,
      wordMode: "normal",
      wordCount: 3,
      hints: 2,
    },
  });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  console.log(watch());
  const gameUrl = `${window.location.host}?roomId=${randomString(7)}`;

  const onSubmit: SubmitHandler<Options> = (data) => {
    console.log(data);
  };

  return (
    <form className="relative flex flex-col rounded-xl w-3/5 gap-2 justify-between border" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 p-16">
        <PlayersOptionRow control={control} />
        <div>Rounds</div>
        <div>Word Mode</div>
        <div>Word count</div>
        <div>Hints</div>
      </div>
      <div className="flex gap-4 p-4 flex-wrap">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }} className="flex-1">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-300 text-white font-bold py-7 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out flex-1 text-2xl">
            Start Game!
          </Button>
        </motion.div>

        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger className="flex-1">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }}>
                <Button
                  type="button"
                  className="w-full bg-green-500 hover:bg-green-600 focus:ring focus:ring-green-300 text-white font-bold py-7 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out flex-1 text-2xl"
                  variant="secondary"
                  ref={buttonRef}
                >
                  Invite your Friends
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent align="center" className="rounded-[0.5rem] border text-center bg-accent p-2 mb-1 w-full" side="top">
              <p>Url</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </form>
  );
};
