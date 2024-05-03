import { httpServer } from "./app";
import "./api";
import "./socket-io";

const port = process.env.PORT || 3000;
httpServer.listen(port, () => console.log(`Server running on port ${port}`));
