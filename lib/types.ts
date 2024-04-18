export interface ServerToClientEvents {
  canvasOnChange: (canvasPath) => void;
}

export interface ClientToServerEvents {
  canvasOnChange: (canvasPath) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
