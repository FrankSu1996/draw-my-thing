import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setChatMessage, setCurrentPlayer } from "@/redux/gameSlice";
import { uniqueNamesGenerator } from "unique-names-generator";
import { uniqueNamesConfig } from "@/lib/config";
import { randomString } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useSocketConnection } from "@/lib/hooks/useSocketConnection";

export function Root() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(uniqueNamesGenerator(uniqueNamesConfig));
  const dispatch = useDispatch();

  const { socket, connect } = useSocketConnection();

  return (
    <div className="w-full place-items-center flex justify-center items-center h-screen">
      <div className="flex items-center justify-center flex-col">
        <div className="flex items-center justify-center gap-10">
          <img src="light/logo-text.png" alt="" className="max-w-[500px]" />
          <img src="light/logo.png" alt="" width={150} height={100} className="pb-10" />
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
                <Button type="submit" className="w-full h-14 text-xl">
                  Play Online
                </Button>
                <Form method="post">
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full h-12 text-lg"
                    onClick={() => {
                      connect();
                      const roomId = randomString(7);
                      socket.emit("createRoom", roomId, playerName, (response) => {
                        if (response.status === "error") {
                          console.log(response.errorMessage);
                        } else {
                          dispatch(setChatMessage([{ message: `${playerName} is now the lobby leader!`, playerName }]));
                        }
                      });
                      dispatch(setCurrentPlayer({ character: "fat-cat", id: uuid(), name: playerName }));
                      navigate("/game");
                    }}
                  >
                    Create Private Room
                  </Button>
                </Form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
