import { create } from "zustand";
import { getEventPhase, getTimeRemaining } from "@/lib/time";
import type { CountdownPhase, TimeRemaining } from "@/types";

interface CountdownState {
  phase: CountdownPhase;
  timeRemaining: TimeRemaining;
  timer: NodeJS.Timeout | null;
  
  setPhase: (phase: CountdownPhase) => void;
  setTimeRemaining: (timeRemaining: TimeRemaining) => void;
  
  updateCountdown: (isDebugMode: boolean, mockTime: Date | null) => void;
  startCountdown: (isDebugMode: boolean, mockTime: Date | null) => void;
  cleanup: () => void;
}

export const useCountdownStore = create<CountdownState>((set, get) => ({
  phase: "before",
  timeRemaining: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  },
  timer: null,
  
  setPhase: (phase: CountdownPhase) => set({ phase }),
  setTimeRemaining: (timeRemaining: TimeRemaining) => set({ timeRemaining }),
  
  updateCountdown: (isDebugMode: boolean, mockTime: Date | null) => {
    const now = isDebugMode && mockTime ? mockTime : new Date();
    const currentPhase = getEventPhase(now);
    const remaining = getTimeRemaining(now);
    
    set({
      phase: currentPhase,
      timeRemaining: remaining,
    });
  },
  
  startCountdown: (isDebugMode: boolean, mockTime: Date | null) => {
    const { cleanup, updateCountdown } = get();
    
    // 清理旧的定时器
    cleanup();
    
    // 立即更新一次
    updateCountdown(isDebugMode, mockTime);
    
    // 启动定时器
    const timer = setInterval(() => {
      updateCountdown(isDebugMode, mockTime);
    }, 1000);
    
    set({ timer });
  },
  
  cleanup: () => {
    const { timer } = get();
    if (timer) {
      clearInterval(timer);
      set({ timer: null });
    }
  },
}));

