"use client";

import { useEffect, useState } from "react";
import { getEventPhase, getTimeRemaining } from "@/lib/time";
import { useDebugStore } from "@/store/useDebugStore";
import type { CountdownPhase, TimeRemaining } from "@/types";

export function CountdownTimer() {
  const { isDebugMode, mockTime } = useDebugStore();
  const [phase, setPhase] = useState<CountdownPhase>("before");
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = isDebugMode && mockTime ? mockTime : new Date();
      const currentPhase = getEventPhase(now);
      const remaining = getTimeRemaining(now);

      setPhase(currentPhase);
      setTimeRemaining(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isDebugMode, mockTime]);

  const getPhaseText = () => {
    switch (phase) {
      case "before":
        return "Event Starts In";
      case "active":
        return "Last Chance Deals End In";
      case "ending":
        return "Event Ends In";
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
    <div className="space-y-6">
      {/* Phase indicator */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-brand-500/20 border border-cyber-brand-500/30">
          <div className="w-2 h-2 rounded-full bg-cyber-brand-500 animate-pulse" />
          <span className="text-sm font-medium text-cyber-brand-500">
            {getPhaseText()}
          </span>
        </div>
      </div>

      {/* Countdown display */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
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
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-lg bg-cyber-brand-500/20 blur-xl" />

        {/* Value container */}
        <div className="relative cyber-card-neon min-w-[60px] sm:min-w-[80px] md:min-w-[100px] px-3 sm:px-4 py-3 sm:py-4">
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cyber-gray-100 tabular-nums">
            {String(value).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="text-xs sm:text-sm text-cyber-gray-400 mt-2 font-medium">
        {label}
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyber-brand-500 animate-pulse">
      :
    </div>
  );
}
