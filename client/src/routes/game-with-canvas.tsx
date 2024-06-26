import { Chatbox } from "@/components/ui/game-page/chatbox";
import { DrawCanvas } from "@/components/ui/game-page/draw-canvas";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { ReceiveCanvas } from "@/components/ui/game-page/receive-canvas";
import { GameLayout } from "@/components/ui/layout/game-layout";
import { useEffect, useState } from "react";

export function GameWithCanvas() {
  const [isDrawCanvas, setIsDrawCanvas] = useState(true);

  return (
    <GameLayout>
      <Chatbox />
      <div className="relative flex flex-col rounded-xl w-3/5 gap-2">{isDrawCanvas ? <DrawCanvas /> : <ReceiveCanvas />}</div>
      <PlayerList />
    </GameLayout>
  );
}
