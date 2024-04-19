import { Chatbox } from "@/components/ui/game-page/chatbox";
import { DrawContainer } from "@/components/ui/game-page/draw-container";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { useEffect } from "react";

export function Game() {
  const { connect, disconnect } = useSocketConnection();

  useEffect(() => {
    connect();

    return () => disconnect();
  }, [connect, disconnect]);

  return (
    <div className="h-screen w-full p-4">
      <div className="flex flex-col h-full">
        <header className="sticky top-0 z-10 flex items-center gap-1 bg-background px-4 justify-between py-4 pt-0">
          <div className="flex items-center justify-center">
            <h1 style={{ fontFamily: "doodly1", fontSize: "6rem" }}>Draw My Thing</h1>
            <img src="light/logo.png" className="pl-20" width={300} />
          </div>

          <ThemeToggle />
        </header>
        <Separator />
        <main className="flex overflow-auto flex-1">
          <Chatbox />
          <DrawContainer />
          <PlayerList />
        </main>
      </div>
    </div>
  );
}
