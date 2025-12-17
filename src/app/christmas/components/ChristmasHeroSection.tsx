"use client";

import { useEffect, useState, useMemo } from "react";
import { CHRISTMAS_HERO_CONFIG } from "@/lib/christmas-constants";
import { ResponsiveBackgroundImage } from "@/components/custom/ResponsiveBackgroundImage";

// Christmas Hero section with realistic snow effects
interface ChristmasHeroSectionProps {
  className?: string;
}

// 生成雪花粒子数据
interface SnowflakeData {
  id: number;
  size: "small" | "medium" | "large";
  left: number;
  delay: number;
  duration: number;
  opacity: number;
  swayDirection: "left" | "right";
  swayAmount: number;
}

function generateSnowflakes(count: number): SnowflakeData[] {
  return Array.from({ length: count }, (_, i) => {
    const sizeRand = Math.random();
    const size: "small" | "medium" | "large" =
      sizeRand < 0.5 ? "small" : sizeRand < 0.85 ? "medium" : "large";

    return {
      id: i,
      size,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration:
        size === "large"
          ? 18 + Math.random() * 10
          : size === "medium"
          ? 14 + Math.random() * 7
          : 10 + Math.random() * 5,
      opacity:
        size === "large"
          ? 0.8 + Math.random() * 0.2
          : size === "medium"
          ? 0.5 + Math.random() * 0.3
          : 0.3 + Math.random() * 0.3,
      swayDirection: Math.random() > 0.5 ? "left" : "right",
      swayAmount: 20 + Math.random() * 40,
    };
  });
}

export function ChristmasHeroSection({ className }: ChristmasHeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  // 使用 useMemo 保持雪花数据稳定
  const snowflakes = useMemo(() => generateSnowflakes(50), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="hero"
      aria-label="Christmas Sale Hero Section"
      className={`relative overflow-hidden w-full max-w-full min-h-screen
        aspect-[2202/1800] md:aspect-[2136/1200] 2xl:aspect-[5120/1400] ${
        className || ""
      }`}
    >
      {/* Background Image - Responsive Christmas banners */}
      {/* Container adapts to background image aspect ratios */}
      <div className="absolute inset-0 w-full h-full">
        <ResponsiveBackgroundImage
          basePath="/assets/christmas/hero/banner"
          alt="Galois 3D LiDAR Camera - Christmas Promotion"
          priority
        />
      </div>

      {/* Animated background effects */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="christmas-grid absolute inset-0 opacity-[0.02]" />

        {/* Animated gradient orbs - Christmas red & gold themed */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-christmas-red/10 blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-christmas-gold/15 blur-[130px] animate-pulse animation-delay-1000" />

        {/* Realistic Snow particle effects */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Realistic Snowflakes */}
            {snowflakes.map((flake) => (
              <span
                key={flake.id}
                className={`absolute snowflake-realistic select-none ${
                  flake.swayDirection === "left"
                    ? "snowflake-sway-left"
                    : "snowflake-sway-right"
                }`}
                style={{
                  left: `${flake.left}%`,
                  top: "-20px",
                  fontSize:
                    flake.size === "large"
                      ? "24px"
                      : flake.size === "medium"
                      ? "16px"
                      : "10px",
                  animationDelay: `${flake.delay}s`,
                  animationDuration: `${flake.duration}s`,
                  opacity: flake.opacity,
                  color: "white",
                  textShadow:
                    flake.size === "large"
                      ? "0 0 8px rgba(255,255,255,0.9), 0 0 15px rgba(200,220,255,0.6)"
                      : flake.size === "medium"
                      ? "0 0 5px rgba(255,255,255,0.7)"
                      : "0 0 3px rgba(255,255,255,0.5)",
                  ["--sway-amount" as string]: `${flake.swayAmount}px`,
                }}
              >
                {flake.size === "large"
                  ? "❄"
                  : flake.size === "medium"
                  ? "❅"
                  : "❆"}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-8 sm:py-12 md:py-16">
          <div className="flex flex-col items-center sm:items-start justify-start text-center sm:text-left space-y-5 sm:space-y-4 md:space-y-5 max-w-6xl mx-auto sm:mx-0 sm:max-w-md md:max-w-lg lg:max-w-2xl w-full">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-christmas-red/20 via-[#ffd700]/10 to-christmas-red/20 border-2 border-[#ffd700]/40 backdrop-blur-md pulse-badge shadow-lg shadow-christmas-red/20">
              <span className="text-white text-sm font-bold tracking-wide uppercase">
                {CHRISTMAS_HERO_CONFIG.subtitle}
              </span>
            </div>

            {/* Main title */}
            <div className="space-y-4 sm:space-y-3 md:space-y-4">
              <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight">
                <span className="text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.3)]">
                  {CHRISTMAS_HERO_CONFIG.title.split(" ").slice(0, 2).join(" ")}
                </span>{" "}
                <span className="text-gradient-christmas drop-shadow-[0_2px_20px_rgba(212,168,83,0.5)]">
                  {CHRISTMAS_HERO_CONFIG.title.split(" ").slice(2).join(" ")}
                </span>
              </h1>

              <p className="text-lg sm:text-base md:text-lg lg:text-2xl text-white/90 font-medium drop-shadow-md">
                {CHRISTMAS_HERO_CONFIG.description}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-3 md:pt-4">
              {CHRISTMAS_HERO_CONFIG.ctaButtons.map((btn) => (
                <a
                  key={btn.label}
                  href={btn.href}
                  aria-label={btn.label}
                  className={`group px-10 sm:px-8 md:px-10 lg:px-16 py-4 sm:py-3.5 md:py-4 lg:py-6 text-lg sm:text-base md:text-lg lg:text-2xl flex items-center justify-center ${
                    btn.primary
                      ? "btn-christmas-primary"
                      : "btn-christmas-secondary"
                  }`}
                >
                  <span className="relative z-10">{btn.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-white/90 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
