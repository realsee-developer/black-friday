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
        {/* Winter Wonderland Overlay - elegant midnight aurora gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-christmas-winter-dark/50 via-christmas-winter/30 to-christmas-winter-dark/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-aurora opacity-60 mix-blend-overlay" />
      </div>

      {/* Animated background effects */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="christmas-grid absolute inset-0 opacity-[0.02]" />

        {/* Animated gradient orbs - Winter Wonderland ice blue & silver themed */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-christmas-ice/20 blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-christmas-silver/15 blur-[130px] animate-pulse animation-delay-1000" />

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
                      ? "#b8d4e8" // Ice blue
                      : i % 3 === 1
                      ? "#C41E3A" // Christmas red
                      : "#8ba8c4", // Silver
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
            {/* Promo badge with pulse effect */}
            <div
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-christmas-red/20 via-[#ffd700]/10 to-christmas-red/20 border-2 border-[#ffd700]/40 backdrop-blur-md pulse-badge shadow-lg shadow-christmas-red/20"
              style={getParallaxStyle(0.5)}
            >
              <span className="text-[#ffd700] text-2xl animate-bounce">🎄</span>
              <span className="text-white text-sm font-bold tracking-wide uppercase">
                {CHRISTMAS_HERO_CONFIG.subtitle}
              </span>
              <span
                className="text-[#ffd700] text-2xl animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                🎁
              </span>
            </div>

            {/* Main title */}
            <div
              className="space-y-4 sm:space-y-3 md:space-y-4"
              style={getParallaxStyle(1)}
            >
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
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-3 md:pt-4"
              style={getParallaxStyle(0.3)}
            >
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
        <div className="w-6 h-10 rounded-full border-2 border-christmas-ice/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-christmas-ice animate-pulse" />
        </div>
      </div>
    </section>
  );
}
