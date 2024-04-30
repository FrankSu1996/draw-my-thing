import { GameOptions } from "@/components/ui/create-game-page/game-options";
import { Chatbox } from "@/components/ui/game-page/chatbox";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { GameLayout } from "@/components/ui/layout/game-layout";

export function Game() {
  return (
    <GameLayout>
      <Chatbox />
      <GameOptions />
      <PlayerList />
    </GameLayout>
  );
}
