import { GameOptions } from "@/components/ui/create-game-page/game-options";
import { Chatbox } from "@/components/ui/game-page/chatbox";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { GameLayout } from "@/components/ui/layout/game-layout";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import { addChatMessage, addPlayer, removePlayer, selectCurrentPlayer, selectRoomId, setPlayers } from "@/redux/gameSlice";
import { useLazyGetPlayersInRoomQuery } from "@/redux/restApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Player } from "../../../lib";

export function Game() {
  const { socket } = useSocketConnection();
  const dispatch = useDispatch();
  const roomId = useSelector(selectRoomId);
  const [fetchPlayers] = useLazyGetPlayersInRoomQuery();

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

  // when game first loads, fetch current players in room. Subsequent player join/leaves
  // will be handled by websockets
  useEffect(() => {
    const fetchInitialPlayersInRoom = async () => {
      if (roomId) {
        const { data } = await fetchPlayers(roomId);
        if (data) {
          const players = data as Player[];
          dispatch(setPlayers(players));
        }
      }
    };
    fetchInitialPlayersInRoom();
  }, [roomId, fetchPlayers, dispatch]);

  return (
    <GameLayout>
      <Chatbox />
      <GameOptions />
      <PlayerList />
    </GameLayout>
  );
}
