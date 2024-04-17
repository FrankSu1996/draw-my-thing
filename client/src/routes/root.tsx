import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Root() {
  return (
    <div className="w-full  lg:min-h-[600px] xl:min-h-[800px] place-items-center">
      <div className="flex items-center justify-center py-12">
        <Card className="py-4 px-10">
          <CardContent>
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Pick your character</h1>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">name</Label>
                  <Input id="name" type="text" placeholder="" required />
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
                <Button type="submit" className="w-full">
                  Play Online
                </Button>
                <Button variant="outline" className="w-full">
                  Create Private Room
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* <div className="hidden lg:block pr-10">
        <img
          src="/light/logo.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
        />
      </div> */}
    </div>
  );
}
