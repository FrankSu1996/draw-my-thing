import { GameOptions } from "@/components/ui/create-game-page/game-options";
import { Chatbox } from "@/components/ui/game-page/chatbox";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { GameLayout } from "@/components/ui/layout/game-layout";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { selectCurrentPlayer } from "@/redux/gameSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function Game() {
  const { connect, disconnect } = useSocketConnection();
  const [searchParams] = useSearchParams();
  const { socket } = useSocketConnection();

  useEffect(() => {
    socket.on("playerJoined", (player) => {
      console.log("player " + player + "joined");
    });
  }, [socket]);

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
