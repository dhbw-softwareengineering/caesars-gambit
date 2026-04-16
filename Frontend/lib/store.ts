import { create } from "zustand";
import { PlayerDTO, ChatMessageDTO, GameStateDTO } from "@/types/api";

interface GameStore {
  playerNames: string[];
  chatMessages: ChatMessageDTO[];
  gameStarted: boolean;
  gameState: GameStateDTO | null;
  pendingDistCount: number | null;
  roomId: string | null;

  // Actions
  setRoomId: (id: string | null) => void;
  setPlayerNames: (names: string[]) => void;
  addChatMessage: (msg: ChatMessageDTO) => void;
  setChatMessages: (msgs: ChatMessageDTO[]) => void;
  setGameStarted: (started: boolean) => void;
  setGameState: (state: GameStateDTO | null) => void;
  setPendingDistCount: (count: number | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  playerNames: [],
  chatMessages: [],
  gameStarted: false,
  gameState: null,
  pendingDistCount: null,
  roomId: null,

  setRoomId: (id) => set({ roomId: id }),
  setPlayerNames: (names) => set({ playerNames: names }),
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  setChatMessages: (msgs) => set({ chatMessages: msgs }),
  setGameStarted: (started) => set({ gameStarted: started }),
  setGameState: (state) => set({ gameState: state }),
  setPendingDistCount: (count) => set({ pendingDistCount: count }),
  reset: () => set({
    playerNames: [],
    chatMessages: [],
    gameStarted: false,
    gameState: null,
    pendingDistCount: null,
    roomId: null,
  }),
}));
