import { GameOptions } from "@/components/ui/create-game-page/game-options";
import { Chatbox } from "@/components/ui/game-page/chatbox";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { GameLayout } from "@/components/ui/layout/game-layout";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { useEffect } from "react";

export function Game() {
  const { connect, disconnect } = useSocketConnection();
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  return (
    <GameLayout>
      <Chatbox />
      <GameOptions />
      <PlayerList />
    </GameLayout>
  );
}
