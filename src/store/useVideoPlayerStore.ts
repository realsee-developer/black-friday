import type { APITypes } from "plyr-react";
import { create } from "zustand";

interface VideoPlayerState {
  isClient: boolean;
  playerRefs: Map<string, APITypes>;

  setIsClient: (isClient: boolean) => void;
  setPlayerRef: (id: string, player: APITypes) => void;
  getPlayerRef: (id: string) => APITypes | undefined;
  removePlayerRef: (id: string) => void;

  initialize: () => void;
}

export const useVideoPlayerStore = create<VideoPlayerState>((set, get) => ({
  isClient: false,
  playerRefs: new Map(),

  setIsClient: (isClient: boolean) => set({ isClient }),

  setPlayerRef: (id: string, player: APITypes) => {
    const { playerRefs } = get();
    playerRefs.set(id, player);
    set({ playerRefs: new Map(playerRefs) });
  },

  getPlayerRef: (id: string) => {
    const { playerRefs } = get();
    return playerRefs.get(id);
  },

  removePlayerRef: (id: string) => {
    const { playerRefs } = get();
    playerRefs.delete(id);
    set({ playerRefs: new Map(playerRefs) });
  },

  initialize: () => {
    set({ isClient: true });
  },
}));
