import { GameBar } from "@/components/ui/game-page/game-bar";
import { Header } from "@/components/ui/header";
import { type FC, type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const GameLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-full px-32 pt-10 pb-20">
      <div className="flex flex-col h-full gap-2">
        <Header />
        <GameBar />
        <main className="flex flex-1 gap-2 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};
