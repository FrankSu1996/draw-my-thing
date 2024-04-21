import { AlarmClock, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../button";
import { ThemeToggle } from "../theme-toggle";

export const GameBar = () => {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    // Only set up the interval once when the component mounts
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) return prevTime - 1;
        else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const numberVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  const alarmVariants = {
    still: { rotate: 0 },
    jolt: {
      rotate: [0, 5, -5],
      transition: { repeat: Infinity, duration: 0.5 },
    },
  };

  return (
    <div className="rounded-md h-14 flex items-center gap-2 justify-between">
      {/* timer with round info */}
      <div className="flex place-items-center">
        <div className="flex place-items-center gap-1">
          <motion.div variants={alarmVariants} animate={timeLeft <= 10 && timeLeft > 0 ? "jolt" : "still"}>
            <AlarmClock size={50} />
          </motion.div>
          <motion.b
            className="text-3xl"
            key={timeLeft}
            variants={numberVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            {timeLeft >= 10 ? timeLeft : `0${timeLeft}`}
          </motion.b>
        </div>
        <p className="text-2xl pl-20">Round 2 of 3</p>
      </div>

      {/* Guess */}
      <div>Guess</div>

      {/* Settings */}
      <ThemeToggle />
    </div>
  );
};
