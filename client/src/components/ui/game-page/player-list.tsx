import { Crown } from "lucide-react";
import { useSelector } from "react-redux";
import { selectLobbyLeader, selectPlayers } from "@/redux/gameSlice";
import type { Player } from "../../../../../lib";
import type { FC } from "react";
import { motion } from "framer-motion";

type PlayerCardProps = {
  player: Player;
  isLeader: boolean;
};

const PlayerCard: FC<PlayerCardProps> = ({ player, isLeader }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="border-2 rounded-xl p-[6px] flex justify-between"
    >
      <div className="flex flex-col gap-1">
        <div>{`#${player.rank}`}</div>
        {isLeader && <Crown />}
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <b>{player.name}</b>
        <div>{`${player.points} points`}</div>
      </div>
      <div>avatar</div>
    </motion.div>
  );
};

export const PlayerList = () => {
  const players = useSelector(selectPlayers);
  const leader = useSelector(selectLobbyLeader);
  return (
    <div className="flex flex-col flex-1 gap-2">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} isLeader={leader?.id === player.id} />
      ))}
    </div>
  );
};
