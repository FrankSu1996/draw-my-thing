import { GameOptions } from "@/components/ui/create-game-page/game-options";
import { Chatbox } from "@/components/ui/game-page/chatbox";
import { PlayerList } from "@/components/ui/game-page/player-list";
import { GameLayout } from "@/components/ui/layout/game-layout";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import {
  addChatMessage,
  addPlayer,
  removePlayer,
  selectCurrentPlayer,
  selectLobbyLeader,
  selectRoomId,
  setLobbyLeader,
  setPlayers,
} from "@/redux/gameSlice";
import { useLazyGetPlayersInRoomQuery, useLazyGetRoomDetailsQuery } from "@/redux/restApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Player } from "../../../lib";

export function Game() {
  const { socket } = useSocketConnection();
  const dispatch = useDispatch();
  const roomId = useSelector(selectRoomId);
  const [fetchPlayers] = useLazyGetPlayersInRoomQuery();
  const [fetchRoomDetails] = useLazyGetRoomDetailsQuery();

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

  // when game first loads, we need to fetch the intial room data (i.e. players, room details)
  // after joining the room, subsequent updates are done via websockets
  useEffect(() => {
    const fetchInitialRoomData = async () => {
      if (roomId) {
        let players: Player[] = [];
        let roomDetails: Record<string, string> = {};

        const results = await Promise.allSettled([fetchPlayers(roomId), fetchRoomDetails(roomId)]);
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            const value = result.value;
            if (!value.data) return;
            if (value.endpointName === "getRoomDetails") {
              roomDetails = value.data as Record<string, string>;
            } else if (value.endpointName === "getPlayersInRoom") {
              players = value.data as Player[];
              console.log(players);
              dispatch(setPlayers(players));
            }
          }
        });
        const leader = players.find((player) => player.id === roomDetails.leader);
        if (leader) dispatch(setLobbyLeader(leader));
      }
    };
    fetchInitialRoomData();
  }, [roomId, fetchPlayers, dispatch, fetchRoomDetails]);

  return (
    <GameLayout>
      <Chatbox />
      <GameOptions />
      <PlayerList />
    </GameLayout>
  );
}
