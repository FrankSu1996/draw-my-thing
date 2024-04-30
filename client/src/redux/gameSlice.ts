import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { uniqueNamesConfig, type BrushSize } from "@/lib/config";
import { Color } from "@/lib/config";
import { Player } from "../../../lib";

type Message = {
  playerName: string;
  message: string;
};

// Define a type for the slice state
interface GameState {
  currentPlayer: Player | null;
  players: Player[];
  chatMessages: Message[];
  Canvas: {
    drawColor: Color;
    brushSize: BrushSize;
    isErasing: boolean;
  };
  createdRoomId: string | null;
}

// Define the initial state using that type
const initialState: GameState = {
  currentPlayer: null,
  players: [],
  chatMessages: [],
  Canvas: {
    drawColor: Color.BLACK,
    brushSize: "medium",
    isErasing: false,
  },
  createdRoomId: null,
};

export const gameSlice = createSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setDrawColor: (state, action: PayloadAction<Color>) => {
      state.Canvas.drawColor = action.payload;
    },
    setBrushSize: (state, action: PayloadAction<BrushSize>) => {
      state.Canvas.brushSize = action.payload;
    },
    setIsErasing: (state, action: PayloadAction<boolean>) => {
      state.Canvas.isErasing = action.payload;
    },
    addChatMessage: (state, action: PayloadAction<Message>) => {
      state.chatMessages.push(action.payload);
    },
    setChatMessage(state, action: PayloadAction<Message[]>) {
      state.chatMessages = action.payload;
    },
    setCurrentPlayer(state, action: PayloadAction<Player | null>) {
      state.currentPlayer = action.payload;
    },
    setCreatedRoomId(state, action: PayloadAction<string>) {
      state.createdRoomId = action.payload;
    },
  },
});

export const { setDrawColor, setBrushSize, setIsErasing, addChatMessage, setChatMessage, setCurrentPlayer, setCreatedRoomId } = gameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlayerName = (state: RootState) => state.game.currentPlayer?.name;
export const selectDrawColor = (state: RootState) => state.game.Canvas.drawColor;
export const selectBrushSize = (state: RootState) => state.game.Canvas.brushSize;
export const selectIsErasing = (state: RootState) => state.game.Canvas.isErasing;
export const selectChatMessages = (state: RootState) => state.game.chatMessages;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectCurrentPlayer = (state: RootState) => state.game.currentPlayer;
export const selectCreatedRoomId = (state: RootState) => state.game.createdRoomId;

export default gameSlice.reducer;
