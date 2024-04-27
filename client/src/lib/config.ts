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

export type BrushSizeOption = {
  canvasValue: number;
  cssValue: string;
};

export type BrushSize = "small" | "medium" | "large" | "x-large";

export const BrushSize: Record<BrushSize, BrushSizeOption> = {
  small: {
    canvasValue: 2,
    cssValue: "5px",
  },
  medium: {
    canvasValue: 4,
    cssValue: "12px",
  },
  large: {
    canvasValue: 8,
    cssValue: "18px",
  },
  "x-large": {
    canvasValue: 16,
    cssValue: "25px",
  },
};

export const MAX_PLAYERS = 20;
