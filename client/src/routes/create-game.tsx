import { Chatbox } from "@/components/ui/game-page/chatbox";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { GameLayout } from "@/components/ui/layout/game-layout";

export function CreateGame() {
  return (
    <GameLayout>
      <Chatbox />
      <div className="relative flex flex-col rounded-xl w-3/5 gap-2">Create-game</div>
      <PlayerList />
    </GameLayout>
  );
}
