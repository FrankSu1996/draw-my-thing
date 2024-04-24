import { GameOptions } from "@/components/ui/create-game-page/game-options";
import { Chatbox } from "@/components/ui/game-page/chatbox";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { GameLayout } from "@/components/ui/layout/game-layout";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { addMessage, selectPlayerName } from "@/redux/gameSlice";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function CreateGame() {
  const dispatch = useDispatch();
  const playerName = useSelector(selectPlayerName);
  //const redis = useRedis();

  const { socket, connect } = useSocketConnection();

  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <GameLayout>
      <Chatbox />
      <GameOptions />
      <PlayerList />
    </GameLayout>
  );
}
