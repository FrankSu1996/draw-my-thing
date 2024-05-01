import { useForm, SubmitHandler, type UseControllerProps, useController, type Control } from "react-hook-form";
import { Button } from "../button";
import { motion } from "framer-motion";
import { cn, randomString } from "@/lib/utils/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";
import { useRef, useState, type FC, type ReactElement } from "react";
import { AlarmClock, Check, ChevronDown, Dices, Tally5, UserRound, WrapText } from "lucide-react";
import { useSize } from "@/lib/hooks/useSize";
import { DRAW_TIMES, MAX_HINTS, MAX_PLAYERS, MAX_ROUNDS, MAX_WORD_COUNT } from "@/lib/config";
import { ScrollArea } from "../scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../select";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addChatMessage, selectCreatedRoomId, selectPlayers } from "@/redux/gameSlice";

type WordMode = "normal" | "hidden" | "combination";

type Options = {
  numPlayers: number;
  drawTime: number;
  rounds: number;
  wordMode: WordMode;
  wordCount: number;
  hints: number;
};

type SelectProps = UseControllerProps<Options> & {
  items: string[];
};

// this dropdown has it's dropdown elements dynamically resize to the selected item's container
function GameOptionSelect(props: SelectProps) {
  const triggerElRef = useRef<HTMLButtonElement>(null);
  const size = useSize(triggerElRef);
  const { field } = useController(props);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Select
      onValueChange={(value) => field.onChange(props.name === "wordMode" ? value : parseInt(value))}
      defaultValue={field.value.toString()}
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <SelectTrigger
        className={cn(
          "p-1 pl-3 border rounded-lg flex-1 flex items-center justify-between",
          isOpen ? "game-option-select--open" : "game-option-select"
        )}
        ref={triggerElRef}
      >
        <b>{field.value}</b>
      </SelectTrigger>
      <SelectContent style={{ width: `${size?.width + 16}px` }}>
        <ScrollArea className="max-h-72 rounded-md">
          <SelectGroup>
            {props.items.map((item, idx) => {
              return (
                <SelectItem key={idx} value={item}>
                  {item}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}

type GameOptionRowProps = {
  label: string;
  dropdown: ReactElement;
  avatar: ReactElement;
};
const GameOptionRow: FC<GameOptionRowProps> = ({ avatar, dropdown, label }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4 flex-1 items-center">
        {avatar}
        <b>{label}</b>
      </div>
      {dropdown}
    </div>
  );
};

// define components for each game option row
const PlayersOptionRow = ({ control }) => {
  const avatar = <UserRound size={30} />;
  const items = Array.from({ length: MAX_PLAYERS })
    .map((_, idx) => (idx + 1).toString())
    .slice(1);
  const dropdown = <GameOptionSelect items={items} name="numPlayers" control={control} />;
  return <GameOptionRow avatar={avatar} dropdown={dropdown} label="Players" />;
};
const DrawTimeOptionRow = ({ control }) => {
  const avatar = <AlarmClock size={30} />;
  const items = DRAW_TIMES.map((time) => time.toString());
  const dropdown = <GameOptionSelect items={items} name="drawTime" control={control} />;
  return <GameOptionRow avatar={avatar} dropdown={dropdown} label="Drawtime" />;
};
const RoundsOptionRow = ({ control }) => {
  const avatar = <Dices size={30} />;
  const items = Array.from({ length: MAX_ROUNDS })
    .map((_, index) => (index + 1).toString())
    .slice(1);
  const dropdown = <GameOptionSelect items={items} name="rounds" control={control} />;
  return <GameOptionRow avatar={avatar} dropdown={dropdown} label="Rounds" />;
};
const WordModeOptionsRow = ({ control }) => {
  const avatar = <WrapText size={30} />;
  const items: WordMode[] = ["normal", "combination", "hidden"];
  const dropdown = <GameOptionSelect items={items} name="wordMode" control={control} />;
  return <GameOptionRow avatar={avatar} dropdown={dropdown} label="Word Mode" />;
};
const WordCountOptionsRow = ({ control }) => {
  const avatar = <Tally5 size={30} />;
  const items = Array.from({ length: MAX_WORD_COUNT }).map((_, idx) => (idx + 1).toString());
  const dropdown = <GameOptionSelect items={items} name="wordCount" control={control} />;
  return <GameOptionRow avatar={avatar} dropdown={dropdown} label="Word Count" />;
};
const HintsOptionsRow = ({ control }) => {
  const avatar = <QuestionMarkIcon width={30} height={30} />;
  const items = Array.from({ length: MAX_HINTS + 1 }).map((_, idx) => idx.toString());
  const dropdown = <GameOptionSelect items={items} name="hints" control={control} />;
  return <GameOptionRow avatar={avatar} dropdown={dropdown} label="Hints" />;
};

export const GameOptions = () => {
  const [inviteButtonHovered, setInviteButtonHovered] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const dispatch = useDispatch();
  const { handleSubmit, control, watch } = useForm<Options>({
    defaultValues: {
      numPlayers: 6,
      drawTime: 75,
      rounds: 4,
      wordMode: "normal",
      wordCount: 3,
      hints: 2,
    },
  });
  const numPlayers = useSelector(selectPlayers).length;
  const configuredNumPlayers = watch("numPlayers");
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const size = useSize(buttonRef);
  const createdRoomId = useSelector(selectCreatedRoomId);
  const isLeader = createdRoomId !== null;
  const shareGameUrl = createdRoomId ? window.location.host + `?room=${createdRoomId}` : window.location.href;

  const onSubmit: SubmitHandler<Options> = (data) => {
    console.log(data);
    console.log("submitting");
  };

  const checkVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
  };

  const handleInviteClick = () => {
    navigator.clipboard.writeText(shareGameUrl);
    dispatch(addChatMessage({ message: "Copied room link to clipboard!" }));
    setShowCheck(true);
    setTimeout(() => {
      setShowCheck(false);
    }, 2000);
  };

  return (
    <form
      className="relative flex flex-col rounded-xl w-3/5 gap-2 justify-between overflow-auto shadow-xl border-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 p-16">
        <PlayersOptionRow control={control} />
        <DrawTimeOptionRow control={control} />
        <RoundsOptionRow control={control} />
        <WordModeOptionsRow control={control} />
        <WordCountOptionsRow control={control} />
        <HintsOptionsRow control={control} />
      </div>
      <div className="flex gap-4 p-4 flex-wrap">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }} className="flex-1">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-300 text-white font-bold py-7 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out flex-1 text-2xl"
            disabled={numPlayers < configuredNumPlayers || !isLeader}
          >
            Start Game!
          </Button>
        </motion.div>

        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger className="flex-1">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }}>
                <Button
                  type="button"
                  className="w-full bg-green-500 hover:bg-green-600 focus:ring relative focus:ring-green-300 text-white font-bold py-7 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out flex-1 text-2xl"
                  variant="secondary"
                  ref={buttonRef}
                  onClick={handleInviteClick}
                  onMouseEnter={() => setInviteButtonHovered(true)}
                  onMouseLeave={() => {
                    setInviteButtonHovered(false);
                    setShowCheck(false);
                  }}
                >
                  {inviteButtonHovered ? "Copy link to clipboard" : "Invite your Friends"}
                  {inviteButtonHovered && showCheck && (
                    <motion.span variants={checkVariants} initial="hidden" animate="visible" className="absolute right-10">
                      <Check />
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent
              align="center"
              className="rounded-[0.5rem] border text-center bg-accent p-2 mb-1"
              side="top"
              style={{ width: `${size?.width + 65}px` }}
            >
              <p>{shareGameUrl}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </form>
  );
};
