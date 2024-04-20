import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { TCharacter } from "../../../lib";

type Player = {
  name: string;
  character: TCharacter;
};

// Define a type for the slice state
interface CounterState {
  playerName: string;
  players: Player[];
}

// Define the initial state using that type
const initialState: CounterState = {
  playerName: "player1",
  players: [
    { name: "player1", character: "fat-cat" },
    { name: "player2", character: "fat-cat" },
    { name: "player3", character: "fat-cat" },
    { name: "player4", character: "fat-cat" },
  ],
};

export const gameSlice = createSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },
  },
});

export const { setPlayerName } = gameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlayerName = (state: RootState) => state.game.playerName;

export default gameSlice.reducer;
