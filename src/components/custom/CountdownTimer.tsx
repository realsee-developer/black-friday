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
    <div className="space-y-6 sm:space-y-7 md:space-y-8 relative">
      {/* Decorative corner accents - subtle */}
      <div className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-cyber-brand-500/40 rounded-tl-lg" />
      <div className="absolute -top-3 -right-3 w-16 h-16 border-r-2 border-t-2 border-cyber-brand-500/40 rounded-tr-lg" />
      <div className="absolute -bottom-3 -left-3 w-16 h-16 border-l-2 border-b-2 border-cyber-brand-500/40 rounded-bl-lg" />
      <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-cyber-brand-500/40 rounded-br-lg" />

      {/* Animated scanlines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-brand-500/30 to-transparent animate-scan-down" />
      </div>

      {/* Phase indicator */}
      <div className="text-center relative z-10">
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyber-brand-500/25 via-cyber-neon-cyan/15 to-cyber-brand-500/25 border border-cyber-brand-500/40 shadow-md shadow-cyber-brand-500/20">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-cyber-brand-400 animate-pulse" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-cyber-brand-400 animate-ping opacity-60" />
          </div>
          <span className="text-sm sm:text-base md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-brand-400 to-cyber-neon-cyan uppercase tracking-wider">
            {getPhaseText()}
          </span>
        </div>
      </div>

      {/* Countdown display */}
      <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-6 lg:gap-8 relative z-10">
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
        <TimeUnit value={timeRemaining.seconds} label="Seconds" isSeconds />
      </div>

      {/* Bottom decorative line - subtle */}
      <div className="relative z-10 opacity-60">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyber-brand-500/40 to-transparent" />
      </div>

      {/* Debug info */}
      {isDebugMode && (
        <div className="text-xs text-center text-cyber-gray-500 font-mono relative z-10">
          Phase: {phase} | Total: {Math.floor(timeRemaining.total / 1000)}s
        </div>
      )}
    </div>
  );
}

interface TimeUnitProps {
  value: number;
  label: string;
  isSeconds?: boolean;
}

function TimeUnit({ value, label, isSeconds = false }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center group">
      <div className="relative">
        {/* Multi-layer glow effect - more subtle */}
        <div className="absolute inset-0 rounded-lg bg-cyber-brand-500/30 blur-xl animate-pulse" />
        <div className="absolute inset-0 rounded-lg bg-cyber-neon-cyan/15 blur-lg" />
        
        {/* Scanning light effect for seconds */}
        {isSeconds && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-cyber-brand-500/0 via-cyber-brand-500/20 to-cyber-brand-500/0 animate-scan-vertical opacity-70" />
        )}

        {/* Value container with enhanced effects */}
        <div className="relative cyber-card-neon min-w-[60px] sm:min-w-[75px] md:min-w-[90px] lg:min-w-[110px] px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 overflow-hidden">
          {/* Inner glow - subtle */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-brand-500/5 via-transparent to-cyber-neon-cyan/5" />
          
          {/* Corner highlights - subtle */}
          <div className="absolute top-0 left-0 w-6 h-6 bg-gradient-to-br from-cyber-brand-500/20 to-transparent rounded-tl-lg" />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-tl from-cyber-neon-cyan/20 to-transparent rounded-br-lg" />
          
          {/* Number with text shadow for depth */}
          <div className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-cyber-gray-100 tabular-nums leading-none drop-shadow-[0_0_8px_rgba(51,102,255,0.4)] transition-all duration-300 group-hover:scale-105">
            {String(value).padStart(2, "0")}
          </div>
        </div>

        {/* Edge highlights */}
        <div className="absolute inset-0 rounded-lg border border-cyber-brand-500/15 pointer-events-none" />
      </div>

      {/* Label with gradient */}
      <div className="text-xs sm:text-sm md:text-base text-transparent bg-clip-text bg-gradient-to-r from-cyber-gray-400 via-cyber-brand-400/80 to-cyber-gray-400 mt-2 sm:mt-2.5 md:mt-3 font-semibold uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="relative self-start pt-3 sm:pt-4 md:pt-5">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyber-brand-400 to-cyber-neon-cyan animate-pulse">
        :
      </div>
      {/* Glow effect on separator - subtle */}
      <div className="absolute inset-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyber-brand-500/25 blur-sm animate-pulse">
        :
      </div>
    </div>
  );
}
