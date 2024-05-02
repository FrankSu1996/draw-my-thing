export enum Color {
  WHITE = "white",
  BLACK = "black",
  GRAY = "gray",
  RED = "red",
  ORANGE = "orange",
  YELLOW = "yellow",
  GREEN = "green",
  BLUE = "blue",
  PURPLE = "purple",
  PINK = "pink",
  BEIGE = "beige",
  BROWN = "brown",
}

export type BrushSize = "small" | "medium" | "large" | "x-large";

export type Player = {
  name: string;
  character: TCharacter;
  id: string;
  points: number;
  rank: number;
};

export type Message = {
  playerName?: string;
  message: string;
};

export interface ServerToClientEvents {
  // canvas related events
  canvasMouseMove: (point: Point) => void;
  canvasMouseDown: (point: Point) => void;
  canvasMouseUp: () => void;
  canvasChangeColor: (color: Color) => void;
  canvasChangeDrawMode: (isErasing: boolean) => void;
  canvasUndo: (imageData: string | null) => void;
  canvasRedo: (imageData: string) => void;
  canvasClear: () => void;
  canvasChangeBrushSize: (brushSize: BrushSize) => void;

  // room related events
  playerJoined: (player: Player) => void;
  playerLeft: (player: Player) => void;
  newChatMessage: (message: Message) => void;
}

type CallbackObject =
  | {
      status: "success";
    }
  | {
      status: "error";
      errorMessage: string;
    };
export interface ClientToServerEvents {
  // canvas related events
  canvasMouseMove: (e: Point) => void;
  canvasMouseDown: (e: Point) => void;
  canvasMouseUp: () => void;
  canvasChangeColor: (color: Color) => void;
  canvasChangeDrawMode: (isErasing: boolean) => void;
  canvasUndo: (imageData: string | null) => void;
  canvasRedo: (imageData: string) => void;
  canvasClear: () => void;
  canvasChangeBrushSize: (brushSize: BrushSize) => void;

  // room related events
  createRoom: (roomId: string, player: Player, callback: ({ status }: CallbackObject) => void) => void;
  joinRoom: (roomId: string, player: Player, callback: ({ status }: CallbackObject) => void) => void;
  newChatMessage: (roomId: string, message: Message) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export type Point = {
  x: number;
  y: number;
};
export type Line = Point[];
export type TCharacter = "fat-cat";
