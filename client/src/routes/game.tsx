import { GameOptions } from "@/components/ui/create-game-page/game-options";
import { Chatbox } from "@/components/ui/game-page/chatbox";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { GameLayout } from "@/components/ui/layout/game-layout";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { addChatMessage } from "@/redux/gameSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { Player } from "../../../lib";

export function Game() {
  const { connect, disconnect } = useSocketConnection();
  const { socket } = useSocketConnection();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("playerJoined", (playerString) => {
      console.log("player joined on client");
      const player: Player = JSON.parse(playerString);
      dispatch(addChatMessage({ playerName: player.name, message: `Player ${player.name} has joined the lobby!` }));
    });

    return () => {
      socket.off("playerJoined");
    };
  }, [socket, dispatch]);

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
