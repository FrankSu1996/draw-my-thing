import { Chatbox } from "@/components/ui/game-page/chatbox";
import { DrawContainer } from "@/components/ui/game-page/draw-container";
import { GameBar } from "@/components/ui/game-page/game-bar";
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
    <div className="h-screen w-full px-32 py-10">
      <div className="flex flex-col h-full gap-2">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-background shadow-md p-2 pt-0 rounded-lg">
          <div className="flex items-center justify-center">
            <h1 style={{ fontFamily: "doodly1", fontSize: "5.5rem" }}>Draw My Thing</h1>
            <img src="light/logo.png" className="pl-20" width={250} />
          </div>
        </header>
        <GameBar />
        <main className="flex overflow-auto flex-1 gap-3">
          <Chatbox />
          <DrawContainer />
          <PlayerList />
        </main>
      </div>
    </div>
  );
}
