import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectPlayerName, setPlayerName } from "@/redux/gameSlice";

export function Root() {
  const navigate = useNavigate();
  const playerName = useSelector(selectPlayerName);
  const dispatch = useDispatch();

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
                  <Input id="name" type="text" placeholder="" required value={playerName} onChange={(e) => dispatch(setPlayerName(e.target.value))} />
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
                <Button variant="outline" className="w-full h-12 text-lg" onClick={() => navigate("/create-game")}>
                  Create Private Room
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
