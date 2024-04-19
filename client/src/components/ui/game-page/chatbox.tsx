import { Textarea } from "../textarea";
import { Button, buttonVariants } from "../button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils/utils";
import { SendHorizonal } from "lucide-react";
import { ScrollArea } from "../scroll-area";

export const Chatbox = () => {
  return (
    <div className="flex-1 flex flex-col rounded-md justify-between gap-5 p-1 pt-0">
      <ScrollArea className="relative"></ScrollArea>
      <div className="flex gap-1 items-center">
        <Textarea
          autoComplete="off"
          name="message"
          placeholder="Aa"
          className="rounded h-10 max-h-10 overflow-hidden"
          style={{ resize: "none" }}
        ></Textarea>
        <Link
          to="#"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9",
            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0 mx-1"
          )}
          onClick={() => console.log("clicked")}
        >
          <SendHorizonal size={20} className="text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
};
