"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CHRISTMAS_HERO_CONFIG } from "@/lib/christmas-constants";

// Christmas Hero section with particle effects and parallax
interface ChristmasHeroSectionProps {
  className?: string;
}

export function ChristmasHeroSection({ className }: ChristmasHeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDesktop) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    setMousePosition({
      x: clientX / width,
      y: clientY / height,
    });
  };

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
      aria-label="Christmas Sale Hero Section"
      className={`relative min-h-[600px] h-screen max-h-[650px] md:max-h-[900px] lg:max-h-[1000px] overflow-hidden ${
        className || ""
      }`}
      onMouseMove={handleMouseMove}
    >
      {/* Background Image - Responsive Christmas banners */}
      <div className="absolute inset-0 w-full h-full">
        {/* Mobile */}
        <Image
          src="/assets/christmas/hero/banner-mobile.jpg"
          alt="Galois 3D LiDAR Camera - Christmas Promotion"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-center block md:hidden"
        />
        {/* Tablet */}
        <Image
          src="/assets/christmas/hero/banner-pad.jpg"
          alt="Galois 3D LiDAR Camera - Christmas Promotion"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-center hidden md:block lg:hidden"
        />
        {/* Desktop */}
        <Image
          src="/assets/christmas/hero/banner-pc.jpg"
          alt="Galois 3D LiDAR Camera - Christmas Promotion"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-center hidden lg:block"
        />
        {/* Christmas Teal Overlay - matches banner */}
        <div className="absolute inset-0 bg-gradient-to-b from-christmas-teal/10 via-transparent to-[#061818]/80" />
      </div>

      {/* Animated background effects */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="christmas-grid absolute inset-0 opacity-[0.02]" />

        {/* Animated gradient orbs - Teal & Gold themed */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-christmas-teal/15 blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-christmas-gold/10 blur-[130px] animate-pulse animation-delay-1000" />

        {/* Snow particle effects */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Snowflakes */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-snow-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 5}s`,
                  opacity: 0.3 + Math.random() * 0.4,
                }}
              />
            ))}
            {/* Christmas lights glow */}
            {[...Array(10)].map((_, i) => (
              <div
                key={`light-${i}`}
                className="absolute w-2 h-2 rounded-full blur-sm animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                  opacity: 0.4 + Math.random() * 0.4,
                  backgroundColor:
                    i % 3 === 0
                      ? "#0D3D3D"
                      : i % 3 === 1
                      ? "#C41E3A"
                      : "#D4A853",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-24 pb-8 sm:pt-0 sm:pb-0 sm:h-full sm:flex sm:items-center md:pt-16">
          <div className="flex flex-col items-center sm:items-start justify-start text-center sm:text-left space-y-5 sm:space-y-4 md:space-y-5 max-w-6xl mx-auto sm:mx-0 sm:max-w-md md:max-w-lg lg:max-w-2xl w-full">
            {/* Promo badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-brand-500/20 border border-cyber-brand-500/30 backdrop-blur-sm"
              style={getParallaxStyle(0.5)}
            >
              <span className="text-cyber-brand-500 text-sm font-semibold">
                🎄 {CHRISTMAS_HERO_CONFIG.subtitle}
              </span>
            </div>

            {/* Main title */}
            <div
              className="space-y-3 sm:space-y-2.5 md:space-y-3"
              style={getParallaxStyle(1)}
            >
              <h1 className="text-3xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-cyber-neon-magenta via-cyber-brand-500 to-cyber-neon-magenta bg-clip-text text-transparent">
                {CHRISTMAS_HERO_CONFIG.title}
              </h1>

              <p className="text-base sm:text-sm md:text-base lg:text-xl text-christmas-gold/90 font-medium">
                {CHRISTMAS_HERO_CONFIG.description}
              </p>
            </div>

            {/* CTA buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-3 md:pt-4"
              style={getParallaxStyle(0.3)}
            >
              {CHRISTMAS_HERO_CONFIG.ctaButtons.map((btn) => (
                <a
                  key={btn.label}
                  href={btn.href}
                  aria-label={btn.label}
                  className={`group relative px-10 sm:px-8 md:px-10 lg:px-16 py-4 sm:py-3.5 md:py-4 lg:py-6 text-lg sm:text-base md:text-lg lg:text-2xl font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-100 min-h-[52px] sm:min-h-[48px] md:min-h-[52px] flex items-center justify-center touch-none ${
                    btn.primary
                      ? "bg-gradient-to-r from-cyber-neon-magenta to-cyber-brand-500 text-white shadow-lg shadow-cyber-neon-magenta/30 hover:shadow-2xl hover:shadow-cyber-neon-magenta/50"
                      : "bg-white/10 text-white border border-cyber-brand-500/30 hover:bg-white/20"
                  }`}
                >
                  {btn.primary && (
                    <div className="absolute inset-0 rounded-xl bg-linear-to-r from-cyber-neon-magenta to-cyber-brand-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300 -z-10" />
                  )}
                  <span className="relative z-10">{btn.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-christmas-gold/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-christmas-gold animate-pulse" />
        </div>
      </div>
    </section>
  );
}
