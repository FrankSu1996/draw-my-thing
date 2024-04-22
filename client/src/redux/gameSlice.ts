import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { TCharacter } from "../../../lib";
import { Color, type BrushSize } from "@/lib/config";

type Player = {
  name: string;
  character: TCharacter;
};

// Define a type for the slice state
interface GameState {
  playerName: string;
  players: Player[];
  chatMessages: string[];
  Canvas: {
    drawColor: Color;
    brushSize: BrushSize;
    isErasing: boolean;
  };
}

// Define the initial state using that type
const initialState: GameState = {
  playerName: "player1",
  players: [
    { name: "player1", character: "fat-cat" },
    { name: "player2", character: "fat-cat" },
    { name: "player3", character: "fat-cat" },
    { name: "player4", character: "fat-cat" },
  ],
  chatMessages: [],
  Canvas: {
    drawColor: Color.BLACK,
    brushSize: "medium",
    isErasing: false,
  },
};

export const gameSlice = createSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },
    setDrawColor: (state, action: PayloadAction<Color>) => {
      state.Canvas.drawColor = action.payload;
    },
  },
});

export const { setPlayerName, setDrawColor } = gameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlayerName = (state: RootState) => state.game.playerName;
export const selectDrawColor = (state: RootState) => state.game.Canvas.drawColor;

export default gameSlice.reducer;
