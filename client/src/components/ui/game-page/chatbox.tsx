import { Textarea } from "../textarea";
import { Button, buttonVariants } from "../button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils/utils";
import { SendHorizonal } from "lucide-react";
import { ScrollArea } from "../scroll-area";
import { motion } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";
import { useSelector } from "react-redux";
import { selectPlayerName } from "@/redux/gameSlice";

const messageVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const ChatMessage = ({ message, index }) => {
  const playerName = useSelector(selectPlayerName);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      transition={{
        opacity: { duration: 0.1 },
        layout: {
          type: "spring",
          bounce: 0.3,
          duration: index * 0.05 + 0.2,
        },
      }}
      className={cn("p-2 border-b last:border-none text-sm break-words", index % 2 !== 0 || "bg-muted")}
    >
      <b>{`${playerName}: `}</b>
      {message}
    </motion.div>
  );
};

export const Chatbox = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSendMessage = () => {
    if (message === "") return;
    setMessages((prev) => {
      return [...prev, message];
    });
    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col rounded-md justify-between gap-5 p-3 max-w-[20%] border-l border-b">
      <ScrollArea className="relative overflow-auto">
        {messages.map((currentMessage, index) => {
          return <ChatMessage index={index} message={currentMessage} key={index} />;
        })}
      </ScrollArea>
      <div className="flex gap-2 items-center">
        <Textarea
          onKeyDown={handleKeyDown}
          ref={inputRef}
          autoComplete="off"
          name="message"
          placeholder="Aa"
          className="rounded h-10 max-h-10 overflow-hidden"
          style={{ resize: "none" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></Textarea>
        <Button variant={"ghost"} disabled={message === ""} onClick={handleSendMessage}>
          <SendHorizonal size={20} className="text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};
