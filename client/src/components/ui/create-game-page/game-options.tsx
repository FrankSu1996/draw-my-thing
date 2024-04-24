import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "../button";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { randomString } from "@/lib/utils/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";
import { useEffect, useRef } from "react";

type Options = {
  numPlayers: number;
  drawTime: number;
  rounds: number;
  wordMode: "normal" | "hidden" | "combination";
  wordCount: number;
  hints: number;
};

export const GameOptions = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Options>();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const gameUrl = `${window.location.host}?roomId=${randomString(7)}`;

  const onSubmit: SubmitHandler<Options> = (data) => {
    console.log(data);
  };

  useEffect(() => {
    const handleResizes = () => {
      console.log(buttonRef.current?.clientWidth);
      console.log(buttonRef.current?.clientHeight);
    };

    window.addEventListener("resize", handleResizes);

    return () => window.removeEventListener("resize", handleResizes);
  }, []);

  return (
    <form className="relative flex flex-col rounded-xl w-3/5 gap-2 justify-between" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div>Players</div>
        <div>Drawtime</div>
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
