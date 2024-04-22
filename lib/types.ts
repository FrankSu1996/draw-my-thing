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

export interface ServerToClientEvents {
  canvasMouseMove: (point: Point) => void;
  canvasMouseDown: (point: Point) => void;
  canvasChangeColor: (color: Color) => void;
  canvasChangeDrawMode: (isErasing: boolean) => void;
}

export interface ClientToServerEvents {
  canvasMouseMove: (e: Point) => void;
  canvasMouseDown: (e: Point) => void;
  canvasChangeColor: (color: Color) => void;
  canvasChangeDrawMode: (isErasing: boolean) => void;
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
