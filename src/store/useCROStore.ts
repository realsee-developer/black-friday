import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CROState } from "@/types";

export const useCROStore = create<CROState>()(
  persist(
    (set) => ({
      variant: Math.random() > 0.5 ? "A" : "B",
      events: [],

      addEvent: (event) =>
        set((state) => ({
          events: [
            ...state.events,
            {
              ...event,
              timestamp: Date.now(),
            },
          ],
        })),
    }),
    {
      name: "cro-store",
    },
  ),
);
