import { create } from "zustand";

interface ToursState {
  current: number;
  paused: boolean;
  timer: NodeJS.Timeout | null;
  touchStart: { x: number; y: number } | null;
  prefersReducedMotion: boolean;
  previous: number;

  setCurrent: (current: number) => void;
  setPaused: (paused: boolean) => void;
  setTouchStart: (touchStart: { x: number; y: number } | null) => void;
  setPrevious: (previous: number) => void;

  goTo: (index: number, slidesLength: number) => void;
  prev: (slidesLength: number) => void;
  next: (slidesLength: number) => void;

  startAutoPlay: (slidesLength: number, durationMs: number) => void;
  pauseAutoPlay: () => void;
  resumeAutoPlay: (slidesLength: number, durationMs: number) => void;

  initialize: () => void;
  cleanup: () => void;
}

export const useToursStore = create<ToursState>((set, get) => ({
  current: 0,
  paused: false,
  timer: null,
  touchStart: null,
  prefersReducedMotion: false,
  previous: 0,

  setCurrent: (current: number) => set({ current }),
  setPaused: (paused: boolean) => set({ paused }),
  setTouchStart: (touchStart: { x: number; y: number } | null) =>
    set({ touchStart }),
  setPrevious: (previous: number) => set({ previous }),

  goTo: (index: number, slidesLength: number) => {
    if (!slidesLength) return;
    const { current } = get();
    const len = slidesLength;
    const newIndex = ((index % len) + len) % len;
    set({ previous: current, current: newIndex });
  },

  prev: (slidesLength: number) => {
    const { current, goTo } = get();
    goTo(current - 1, slidesLength);
  },

  next: (slidesLength: number) => {
    const { current, goTo } = get();
    goTo(current + 1, slidesLength);
  },

  startAutoPlay: (slidesLength: number, durationMs: number) => {
    const { timer, prefersReducedMotion, cleanup } = get();

    if (timer) cleanup();

    if (!prefersReducedMotion && slidesLength > 1) {
      const newTimer = setInterval(() => {
        const { current } = get();
        set({
          previous: current,
          current: (current + 1) % slidesLength,
        });
      }, durationMs);

      set({ timer: newTimer, paused: false });
    }
  },

  pauseAutoPlay: () => {
    const { timer } = get();
    if (timer) {
      clearInterval(timer);
      set({ timer: null, paused: true });
    }
  },

  resumeAutoPlay: (slidesLength: number, durationMs: number) => {
    const { prefersReducedMotion, startAutoPlay } = get();
    if (!prefersReducedMotion && slidesLength > 1) {
      startAutoPlay(slidesLength, durationMs);
    }
  },

  initialize: () => {
    // 检查用户的动画偏好
    if (typeof window !== "undefined") {
      try {
        const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
        set({ prefersReducedMotion: mql.matches });
      } catch {
        // ignore
      }
    }
  },

  cleanup: () => {
    const { timer } = get();
    if (timer) {
      clearInterval(timer);
      set({ timer: null });
    }
  },
}));
