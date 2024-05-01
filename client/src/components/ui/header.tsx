import { useTheme } from "../theme-provider";

export const Header = () => {
  const { theme } = useTheme();
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-background shadow-md p-2 pt-0 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-center">
        <h1 style={{ fontFamily: "doodly1", fontSize: "5.5rem" }} className="w-full md-w-1/2">
          Draw Your Thing
        </h1>
        <img src={`${theme === "light" ? "light" : "dark"}/logo.png`} className="pl-20" width={250} />
      </div>
    </header>
  );
};
