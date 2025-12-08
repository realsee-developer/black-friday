"use client";
// v2.0.0 - Fixed hydration issue

import { useEffect, useState } from "react";
import { ResponsiveBackgroundImage } from "@/components/custom/ResponsiveBackgroundImage";
import { trackHeroCTAClick } from "@/lib/analytics/gtm";

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
      className={`relative min-h-[600px] h-screen max-h-[650px] md:max-h-[900px] lg:max-h-[1000px] overflow-hidden ${className || ""}`}
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

      {/* Mobile: 贴顶且垂直居中，Desktop/Tablet: 左侧垂直居中对齐 */}
      <div className="absolute inset-0 flex justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-24 pb-8 sm:pt-0 sm:pb-0 sm:h-full sm:flex sm:items-center md:pt-16">
          <div className="flex flex-col items-center sm:items-start justify-start text-center sm:text-left space-y-5 sm:space-y-4 md:space-y-5 max-w-6xl mx-auto sm:mx-0 sm:max-w-md md:max-w-lg lg:max-w-2xl w-full">
          {/* Main title - center aligned on mobile, left on tablet/desktop */}
          <div className="space-y-3 sm:space-y-2.5 md:space-y-3" style={getParallaxStyle(1)}>
            {/* 主标题：Our Black Friday Has Ended */}
            <h1 className="text-3xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-cyber-brand-400 via-cyber-brand-500 to-cyber-neon-cyan bg-clip-text text-transparent">
              Our Black Friday Has Ended
            </h1>

            <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-cyber-brand-400 via-cyber-brand-500 to-cyber-neon-cyan bg-clip-text text-transparent">
              See You Next Year
            </h2>

            <p className="text-base sm:text-sm md:text-base lg:text-xl text-cyber-brand-400 font-medium">
              If you want more information, please click the button below
            </p>
          </div>

          {/* CTA button */}
          <div className="flex justify-center sm:justify-start pt-4 sm:pt-3 md:pt-4" style={getParallaxStyle(0.3)}>
            <a
              href="#contact"
              aria-label="Contact us for more information"
              onClick={() => trackHeroCTAClick("Contact Us", "#contact")}
              className="group relative cyber-btn-primary px-10 sm:px-8 md:px-10 lg:px-16 py-4 sm:py-3.5 md:py-4 lg:py-6 text-lg sm:text-base md:text-lg lg:text-2xl font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyber-brand-500/50 active:scale-100 shadow-lg shadow-cyber-brand-500/30 min-h-[52px] sm:min-h-[48px] md:min-h-[52px] flex items-center justify-center touch-none"
            >
              {/* Extra glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-cyber-brand-500 to-cyber-neon-cyan opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300 -z-10" />
              <span className="relative z-10">Contact Us</span>
            </a>
          </div>
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
