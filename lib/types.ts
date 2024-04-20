export interface ServerToClientEvents {
  canvasMouseMove: (point: Point) => void;
  canvasMouseDown: (point: Point) => void;
}

export interface ClientToServerEvents {
  canvasMouseMove: (e: Point) => void;
  canvasMouseDown: (e: Point) => void;
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
