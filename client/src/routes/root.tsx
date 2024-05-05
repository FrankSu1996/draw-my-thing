import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setChatMessage, setRoomId, setCurrentPlayer, setLobbyLeader } from "@/redux/gameSlice";
import { uniqueNamesGenerator } from "unique-names-generator";
import { uniqueNamesConfig } from "@/lib/config";
import { randomString } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";
import type { Player } from "../../../lib";
import { Game } from "./game";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { GameWithCanvas } from "./game-with-canvas";

export function Root() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const roomId = searchParams.get("room");
  const [playerName, setPlayerName] = useState(uniqueNamesGenerator(uniqueNamesConfig));
  const dispatch = useDispatch();
  const { socket } = useSocketConnection();
  const [gameStarted, setGameStarted] = useState(false);

  const { connect, disconnect } = useSocketConnection();

  useEffect(() => {
    connect();

    return () => {
      setRoomId(null);
      disconnect();
    };
  }, [connect, disconnect]);

  const handleCreatePrivateRoom = () => {
    if (playerName !== "") {
      const roomId = randomString(7);
      const currentPlayer: Player = { character: "fat-cat", id: uuid(), name: playerName, points: 0, rank: 1 };
      socket.emit("createRoom", roomId, currentPlayer, (response) => {
        if (response.status === "error") {
          console.log(response.errorMessage);
        } else if (response.status === "success") {
          dispatch(setLobbyLeader(currentPlayer));
          dispatch(setRoomId(roomId));
          dispatch(setCurrentPlayer(currentPlayer));
          dispatch(setChatMessage([{ message: `${playerName} is now the lobby leader!` }]));
          setGameStarted(true);
          setSearchParams({});
        }
      });
    }
  };

  const handlePlayOnline = () => {};

  const handleJoinPrivateRoom = () => {
    if (roomId && playerName !== "") {
      const currentPlayer: Player = { character: "fat-cat", id: uuid(), name: playerName, points: 0, rank: 1 };
      socket.emit("joinRoom", roomId, currentPlayer, (response) => {
        if (response.status === "success") {
          dispatch(setRoomId(roomId));
          setGameStarted(true);
          dispatch(setCurrentPlayer(currentPlayer));
          dispatch(setChatMessage([{ message: `${playerName} has joined the lobby!` }]));
        } else {
          toast({ variant: "destructive", title: "Uh Oh! Something went wrong.", description: response.errorMessage });
        }
      });
    }
  };

  if (gameStarted) {
    const game = <Game />;
    //const game = <GameWithCanvas />;
    return game;
  } else
    return (
      <div className="w-full place-items-center flex justify-center items-center h-screen relative">
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center justify-center gap-10">
            <h1 style={{ fontFamily: "doodly1", fontSize: "5.5rem" }} className="w-full md-w-1/2">
              Draw Your Thing
            </h1>
          </div>
          <Card className="py-4 px-10">
            <CardContent className="">
              <div className="grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold">Pick your character</h1>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">name</Label>
                    <Input id="name" type="text" required value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
                  </div>
                  <div>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <Card>
                                <CardContent className="flex aspect-square items-center justify-center">
                                  <img
                                    src="/light/fat-cat.png"
                                    alt="Image"
                                    className="h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
                                  />
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }} className="flex-1">
                    <Button className="w-full h-14 text-xl" onClick={handlePlayOnline}>
                      Play Online
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }} className="flex-1">
                    <Button variant={"destructive"} className="w-full h-14 text-xl" onClick={handleJoinPrivateRoom} disabled={roomId === null}>
                      Join Private Room
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }} className="flex-1">
                    <Button variant="secondary" className="w-full h-14 text-lg" onClick={handleCreatePrivateRoom}>
                      Create Private Room
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Toaster />
      </div>
    );
}
