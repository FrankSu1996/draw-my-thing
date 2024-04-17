import { Chatbox } from "@/components/ui/game-page/chatbox";
import { DrawContainer } from "@/components/ui/game-page/draw-container";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { useEffect } from "react";

export function Game() {
  const { connect, disconnect } = useSocketConnection();

  useEffect(() => {
    connect();

    return () => disconnect();
  }, [connect, disconnect]);

  return (
    <div className="h-screen w-full">
      <div className="flex flex-col h-full">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 py-12">
          <div className="flex items-center justify-center">
            <img src="light/logo-text.png" className="px-3" width={450} />
            <img src="light/logo.png" className="pl-10" width={140} />
          </div>
        </header>
        <main className="flex overflow-auto flex-1">
          <Chatbox />
          <DrawContainer />
          <PlayerList />
        </main>
      </div>
    </div>
  );
}
