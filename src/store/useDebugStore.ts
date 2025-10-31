import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DebugState } from "@/types";

export const useDebugStore = create<DebugState>()(
  persist(
    (set) => ({
      isDebugMode: false,
      mockTime: null,

      setDebugMode: (enabled) => set({ isDebugMode: enabled }),
      setMockTime: (time) => set({ mockTime: time }),
    }),
    {
      name: "debug-store",
    },
  ),
);
