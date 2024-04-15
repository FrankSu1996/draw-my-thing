import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";
import { Button } from "@/components/ui/button";

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  const sendMessage = () => {
    socket.emit("send_message", { message: "hello" });
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("receive_message", (data) => {
      alert(data.message);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <>
      <Button onClick={sendMessage}>Test</Button>
    </>
  );
}

export default App;
