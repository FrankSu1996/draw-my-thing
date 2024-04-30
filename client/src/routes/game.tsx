import { GameOptions } from "@/components/ui/create-game-page/game-options";
import { Chatbox } from "@/components/ui/game-page/chatbox";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { GameLayout } from "@/components/ui/layout/game-layout";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { addChatMessage, selectPlayerName, setChatMessage } from "@/redux/gameSlice";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

export function Game() {
  const dispatch = useDispatch();
  const playerName = useSelector(selectPlayerName);
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room")!;
  const { socket, connect, disconnect } = useSocketConnection();

  useEffect(() => {
    socket.emit("createRoom", roomId, playerName, (response) => {
      if (response.status === "error") {
        console.log(response.errorMessage);
      } else {
        dispatch(setChatMessage([{ message: `${playerName} is now the lobby leader!`, playerName }]));
      }
    });
  }, [socket, playerName, roomId, dispatch]);

  useEffect(() => {
    connect();

    return () => disconnect();
  }, [connect, disconnect]);

  return (
    <GameLayout>
      <Chatbox />
      <GameOptions />
      <PlayerList />
    </GameLayout>
  );
}
