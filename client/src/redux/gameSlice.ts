import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { type BrushSize } from "@/lib/config";
import { Color } from "@/lib/config";
import { Player, Message } from "../../../lib";

// Define a type for the slice state
interface GameState {
  currentPlayer: Player | null;
  lobbyLeader: Player | null;
  players: Player[];
  chatMessages: Message[];
  Canvas: {
    drawColor: Color;
    brushSize: BrushSize;
    isErasing: boolean;
  };
  roomId: string | null;
  gameState: "waiting-lobby" | "choose-word" | "guessing";
}

// Define the initial state using that type
const initialState: GameState = {
  currentPlayer: null,
  lobbyLeader: null,
  players: [],
  chatMessages: [],
  Canvas: {
    drawColor: Color.BLACK,
    brushSize: "medium",
    isErasing: false,
  },
  roomId: null,
  gameState: "waiting-lobby",
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
    setRoomId(state, action: PayloadAction<string | null>) {
      state.roomId = action.payload;
    },
    addPlayer(state, action: PayloadAction<Player>) {
      const playerIds = state.players.map((p) => p.id);
      if (playerIds.includes(action.payload.id)) return;
      state.players.push(action.payload);
    },
    removePlayer(state, action: PayloadAction<Player>) {
      state.players = state.players.filter((player) => player.id !== action.payload.id);
    },
    setPlayers(state, action: PayloadAction<Player[]>) {
      state.players = action.payload;
    },
    setLobbyLeader(state, action: PayloadAction<Player>) {
      state.lobbyLeader = action.payload;
    },
  },
});

export const {
  setLobbyLeader,
  setDrawColor,
  setBrushSize,
  setIsErasing,
  addChatMessage,
  setChatMessage,
  setCurrentPlayer,
  setRoomId,
  addPlayer,
  removePlayer,
  setPlayers,
} = gameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlayerName = (state: RootState) => state.game.currentPlayer?.name;
export const selectDrawColor = (state: RootState) => state.game.Canvas.drawColor;
export const selectBrushSize = (state: RootState) => state.game.Canvas.brushSize;
export const selectIsErasing = (state: RootState) => state.game.Canvas.isErasing;
export const selectChatMessages = (state: RootState) => state.game.chatMessages;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectCurrentPlayer = (state: RootState) => state.game.currentPlayer;
export const selectRoomId = (state: RootState) => state.game.roomId;
export const selectLobbyLeader = (state: RootState) => state.game.lobbyLeader;
export default gameSlice.reducer;
