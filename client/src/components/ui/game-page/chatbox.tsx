import { Textarea } from "../textarea";
import { Button, buttonVariants } from "../button";
import { cn } from "@/lib/utils/utils";
import { SendHorizonal } from "lucide-react";
import { ScrollArea } from "../scroll-area";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, type FC, type KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addChatMessage, selectChatMessages, selectPlayerName, type Message } from "@/redux/gameSlice";
import { Separator } from "../separator";

type ChatMessageProps = {
  message: Message;
  index: number;
};

const ChatMessage: FC<ChatMessageProps> = ({ message, index }) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 1, y: 5, x: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
        transition={{
          opacity: { duration: 0.1 },
          layout: {
            type: "spring",
            bounce: 0.01,
            duration: 1,
          },
        }}
        className={cn("p-[3px] last:border-none text-sm break-words", index % 2 !== 0 || "bg-muted")}
      >
        {message.playerName && <b>{`${message.playerName}: `}</b>}
        {message.message}
      </motion.div>
      <Separator />
    </div>
  );
};

export const Chatbox = () => {
  const [message, setMessage] = useState<string>("");
  const messages = useSelector(selectChatMessages);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const playerName = useSelector(selectPlayerName);

  const handleSendMessage = () => {
    if (message === "") return;
    if (playerName) dispatch(addChatMessage({ message, playerName }));
    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col rounded-md justify-between gap-5 p-2 max-w-[20%] border-2">
      <ScrollArea className="relative">
        {messages.map((currentMessage, index) => {
          return <ChatMessage index={index} message={currentMessage} key={index} />;
        })}
        {/* div to keep track of end of messages */}
        <div ref={messagesEndRef}></div>
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
        <Button variant={"ghost"} disabled={message === ""} onClick={handleSendMessage} className="p-3">
          <SendHorizonal size={20} className="text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};
