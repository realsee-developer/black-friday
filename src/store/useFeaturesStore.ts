import type { APITypes } from "plyr-react";
import { create } from "zustand";

interface FeaturesState {
  activeFeature: number;
  plyrRef: APITypes | null;

  setActiveFeature: (index: number) => void;
  setPlyrRef: (player: APITypes | null) => void;
  nextFeature: (totalFeatures: number) => void;
  prevFeature: () => void;
}

export const useFeaturesStore = create<FeaturesState>((set, get) => ({
  activeFeature: 0,
  plyrRef: null,

  setActiveFeature: (index: number) => set({ activeFeature: index }),

  setPlyrRef: (player: APITypes | null) => set({ plyrRef: player }),

  nextFeature: (totalFeatures: number) => {
    const { activeFeature } = get();
    set({ activeFeature: Math.min(totalFeatures - 1, activeFeature + 1) });
  },

  prevFeature: () => {
    const { activeFeature } = get();
    set({ activeFeature: Math.max(0, activeFeature - 1) });
  },
}));
