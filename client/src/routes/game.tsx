import { CanvasToolbar } from "@/components/ui/game-page/canvas-toolbar";
import { Chatbox } from "@/components/ui/game-page/chatbox";
import { DrawCanvas } from "@/components/ui/game-page/draw-canvas";
import { DrawContainer } from "@/components/ui/game-page/draw-container";
import { GameBar } from "@/components/ui/game-page/game-bar";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { ReceiveCanvas } from "@/components/ui/game-page/receive-canvas";
import { Color } from "@/lib/config";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { useEffect, useState } from "react";

export function Game() {
  const { connect, disconnect } = useSocketConnection();
  const [isDrawCanvas, setIsDrawCanvas] = useState(true);

  useEffect(() => {
    connect();

    return () => disconnect();
  }, [connect, disconnect]);

  return (
    <div className="h-screen w-full px-32 pt-10 pb-20">
      <div className="flex flex-col h-full gap-2">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-background shadow-md p-2 pt-0 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-center">
            <h1 style={{ fontFamily: "doodly1", fontSize: "5.5rem" }} className="w-full md-w-1/2">
              Draw My Thing
            </h1>
            <img src="light/logo.png" className="pl-20" width={250} />
          </div>
        </header>
        <GameBar />
        <main className="flex overflow-auto flex-1 gap-3">
          <Chatbox />
          <div className="relative flex flex-col rounded-xl w-3/5 gap-2">
            {isDrawCanvas ? (
              <DrawCanvas width={50} height={50} drawColor={Color.BLACK} />
            ) : (
              <ReceiveCanvas width={50} height={50} drawColor={Color.BLACK} />
            )}
          </div>

          <PlayerList />
        </main>
      </div>
    </div>
  );
}
