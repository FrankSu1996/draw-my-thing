import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
  return (
    <>
      <div>{isConnected.toString()}</div>
    </>
  );
}

export default App;
