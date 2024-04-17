import { Label } from "../label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Rabbit, Bird, Turtle, CornerDownLeft } from "lucide-react";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Button } from "../button";
import { Card, CardContent } from "../card";
import { ScrollArea } from "../scroll-area";

export const Chatbox = () => {
  return (
    <div className="flex-1 flex flex-col gap-10 p-4">
      <ScrollArea className="h-[200px] rounded-md border p-2 flex-1">
        Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under the king's pillow, in his soup,
        even in the royal toilet. The king was furious, but he couldn't seem to stop Jokester. And then, one day, the people of the kingdom discovered
        that the jokes left by Jokester were so funny that they couldn't help but laugh. And once they started laughing, they couldn't stop.
      </ScrollArea>
      <div
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        x-chunk="dashboard-03-chunk-1"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button type="submit" size="sm" className="ml-auto gap-1.5">
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
