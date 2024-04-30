import { GameOptions } from "@/components/ui/create-game-page/game-options";
import { Chatbox } from "@/components/ui/game-page/chatbox";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { GameLayout } from "@/components/ui/layout/game-layout";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { addChatMessage, addPlayer, removePlayer, selectCurrentPlayer } from "@/redux/gameSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

export function Game() {
  const { socket } = useSocketConnection();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("playerJoined", (player) => {
      dispatch(addPlayer(player));
      dispatch(addChatMessage({ message: `Player ${player.name} has joined the lobby!` }));
    });
    socket.on("playerLeft", (player) => {
      dispatch(removePlayer(player));
      dispatch(addChatMessage({ message: `Player ${player.name} has left the lobby!` }));
    });

    return () => {
      socket.off("playerJoined");
      socket.off("playerLeft");
    };
  }, [socket, dispatch]);

  return (
    <GameLayout>
      <Chatbox />
      <GameOptions />
      <PlayerList />
    </GameLayout>
  );
}
