export const Header = () => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-background shadow-md p-2 pt-0 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-center">
        <h1 style={{ fontFamily: "doodly1", fontSize: "5.5rem" }} className="w-full md-w-1/2">
          Draw Your Thing
        </h1>
        <img src="light/logo.png" className="pl-20" width={250} />
      </div>
    </header>
  );
};
