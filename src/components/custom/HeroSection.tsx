"use client";
// v2.0.0 - Fixed hydration issue

import { useEffect, useState } from "react";
import { ResponsiveBackgroundImage } from "@/components/custom/ResponsiveBackgroundImage";

// Hero section with particle effects and parallax
interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isDesktop, setIsDesktop] = useState(false); // PC 端才有视差效果
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 检测是否为 PC 设备
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDesktop) return; // 只有 PC 端才响应鼠标移动
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    setMousePosition({
      x: clientX / width,
      y: clientY / height,
    });
  };

  // 计算视差偏移 - 只在 PC 端应用
  const getParallaxStyle = (depth: number) => {
    if (!mounted || !isDesktop) return {};
    const maxOffset = 20 * depth;
    const offsetX = (mousePosition.x - 0.5) * maxOffset;
    const offsetY = (mousePosition.y - 0.5) * maxOffset;
    return {
      transform: `translate(${offsetX}px, ${offsetY}px)`,
      transition: "transform 0.3s ease-out",
    };
  };

  return (
    <section
      id="hero"
      aria-label="Black Friday Event Hero Section"
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className || ""}`}
      onMouseMove={handleMouseMove}
    >
      {/* Background Image - Responsive */}
      <div className="absolute inset-0 w-full h-full">
        <ResponsiveBackgroundImage
          basePath="/assets/hero/galois-hero"
          alt="Galois 3D LiDAR Camera - Professional 3D scanning solution with advanced technology"
          priority
        />
      </div>

      {/* Animated background effects */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="cyber-grid absolute inset-0 opacity-[0.02]" />

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyber-brand-500/8 blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyber-neon-cyan/5 blur-[130px] animate-pulse animation-delay-1000" />

        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(51,102,255,0.01)_50%,transparent_100%)] bg-size-[100%_4px] animate-scanline" />

        {/* 粒子效果 - 所有设备都显示 */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden">
            {/* 小粒子 */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyber-brand-400 rounded-full animate-float-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                  opacity: 0.15 + Math.random() * 0.25,
                }}
              />
            ))}
            {/* 大光点 */}
            {[...Array(15)].map((_, i) => (
              <div
                key={`glow-${i}`}
                className="absolute w-2 h-2 bg-cyber-neon-cyan rounded-full blur-sm animate-float-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                  opacity: 0.1 + Math.random() * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-6 relative z-10 py-16 sm:py-20">
        <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left space-y-6 sm:space-y-8 md:space-y-10 max-w-6xl mx-auto md:mx-0 md:max-w-2xl lg:max-w-3xl">
          {/* Main title */}
          <div className="space-y-3 sm:space-y-4" style={getParallaxStyle(1)}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyber-gray-100 via-cyber-brand-400 to-cyber-neon-cyan drop-shadow-[0_0_30px_rgba(51,102,255,0.3)]">
                Realsee Black Friday 2025
              </span>
            </h1>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-cyber-gray-200 tracking-wide">
              Galois 3D LiDAR Camera Sale
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-cyber-brand-400 font-medium">
              Nov 17th - Dec 7th, 2025 | Worldwide Shipping
            </p>
          </div>

          {/* Description */}
          <p 
            className="text-base sm:text-lg md:text-xl text-cyber-gray-300 max-w-3xl leading-relaxed px-4"
            style={getParallaxStyle(0.5)}
          >
            Experience professional 3D scanning with up to{" "}
            <span className="text-cyber-brand-400 font-bold text-lg sm:text-xl md:text-2xl">
              $1,425 OFF
            </span>{" "}
            during our exclusive Black Friday sale.
          </p>

          {/* CTA button */}
          <div className="flex justify-center md:justify-start pt-2 sm:pt-4" style={getParallaxStyle(0.3)}>
            <a
              href="#offers"
              aria-label="View Black Friday special offers for Galois 3D LiDAR Camera"
              className="group relative cyber-btn-primary px-10 sm:px-14 md:px-16 py-4 sm:py-5 md:py-6 text-lg sm:text-xl md:text-2xl font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyber-brand-500/50 active:scale-100 shadow-lg shadow-cyber-brand-500/30"
            >
              {/* Extra glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-cyber-brand-500 to-cyber-neon-cyan opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300 -z-10" />
              <span className="relative z-10">View Offers Now</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-cyber-brand-500/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-cyber-brand-500 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
