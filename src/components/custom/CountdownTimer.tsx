"use client";

import { useEffect } from "react";
import { useCountdownStore } from "@/store/useCountdownStore";
import { useDebugStore } from "@/store/useDebugStore";

export function CountdownTimer() {
  // ✅ 使用 selector 只订阅需要渲染的状态
  const isDebugMode = useDebugStore((state) => state.isDebugMode);
  const mockTime = useDebugStore((state) => state.mockTime);
  const phase = useCountdownStore((state) => state.phase);
  const timeRemaining = useCountdownStore((state) => state.timeRemaining);

  useEffect(() => {
    const { startCountdown, cleanup } = useCountdownStore.getState();
    startCountdown(isDebugMode, mockTime);
    return () => cleanup();
  }, [isDebugMode, mockTime]);

  const getPhaseText = () => {
    switch (phase) {
      case "before":
        return "Event Start In";
      case "active":
        return "Last Chance Deals End In";
      case "ending":
        return "Event End In";
      case "ended":
        return "Event Has Ended";
      default:
        return "";
    }
  };

  if (phase === "ended") {
    return (
      <div className="text-center py-8">
        <div className="text-2xl font-bold text-cyber-gray-400">
          {getPhaseText()}
        </div>
        <div className="text-cyber-gray-500 mt-2">
          Thank you for your interest. See you next year!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Phase indicator - 简洁版 */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-brand-500/15 border border-cyber-brand-500/30">
          <div className="w-2 h-2 rounded-full bg-cyber-brand-400 animate-pulse" />
          <span className="text-sm sm:text-base font-semibold text-cyber-brand-400 uppercase tracking-wide">
            {getPhaseText()}
          </span>
        </div>
      </div>

      {/* Countdown display */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Days */}
        {timeRemaining.days > 0 && (
          <>
            <TimeUnit value={timeRemaining.days} label="Days" />
            <Separator />
          </>
        )}

        {/* Hours */}
        <TimeUnit value={timeRemaining.hours} label="Hours" />
        <Separator />

        {/* Minutes */}
        <TimeUnit value={timeRemaining.minutes} label="Minutes" />
        <Separator />

        {/* Seconds */}
        <TimeUnit value={timeRemaining.seconds} label="Seconds" />
      </div>

      {/* Debug info */}
      {isDebugMode && (
        <div className="text-xs text-center text-cyber-gray-500 font-mono">
          Phase: {phase} | Total: {Math.floor(timeRemaining.total / 1000)}s
        </div>
      )}
    </div>
  );
}

interface TimeUnitProps {
  value: number;
  label: string;
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center group">
      {/* 简化的数字卡片 */}
      <div className="relative bg-cyber-gray-800/60 border border-cyber-gray-700/50 rounded-lg backdrop-blur-sm min-w-[60px] sm:min-w-[70px] md:min-w-[85px] lg:min-w-[100px] px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 transition-all duration-300 hover:border-cyber-brand-500/50 hover:bg-cyber-gray-800/80">
        {/* 柔和的背景光晕 */}
        <div className="absolute inset-0 rounded-lg bg-cyber-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 数字 */}
        <div className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cyber-gray-100 tabular-nums leading-none transition-transform duration-300 group-hover:scale-105">
          {String(value).padStart(2, "0")}
        </div>
      </div>

      {/* 标签 */}
      <div className="text-xs sm:text-sm text-cyber-gray-400 mt-2 sm:mt-2.5 font-medium uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="self-start pt-3 sm:pt-4 md:pt-5 text-2xl sm:text-3xl md:text-4xl font-bold text-cyber-brand-500/50">
      :
    </div>
  );
}
