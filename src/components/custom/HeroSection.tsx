import Image from "next/image";
import { CountdownTimer } from "./CountdownTimer";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      id="hero"
      aria-label="Black Friday Event Hero Section"
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className || ""}`}
    >
      {/* Background Image */}
      <Image
        src="/assets/hero/galois-hero.jpg"
        alt="Galois 3D LiDAR Camera - Professional 3D scanning solution with advanced technology"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%230a0f1a'/%3E%3C/svg%3E"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-gray-900/80 via-cyber-gray-900/70 to-cyber-gray-900/90" />

      {/* Animated background effects */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="cyber-grid absolute inset-0 opacity-5" />

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyber-brand-500/15 blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyber-neon-cyan/10 blur-[130px] animate-pulse animation-delay-1000" />

        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(51,102,255,0.02)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline" />
      </div>

      <div className="container mx-auto px-6 relative z-10 py-16 sm:py-20">
        <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 md:space-y-10 max-w-6xl mx-auto">
          {/* Main title */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-gray-100 via-cyber-brand-400 to-cyber-neon-cyan drop-shadow-[0_0_30px_rgba(51,102,255,0.3)]">
                Black Friday Event
              </span>
            </h1>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-cyber-gray-200 tracking-wide">
              Galois 3D LiDAR Camera
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-cyber-brand-400 font-medium">
              Nov 17th - Dec 7th, 2025
            </p>
          </div>

          {/* Countdown Timer - Center spotlight */}
          <div className="w-full max-w-5xl my-6 sm:my-8">
            <div className="cyber-card-neon p-6 sm:p-8 md:p-10 lg:p-12 relative backdrop-blur-sm bg-cyber-gray-800/50">
              {/* Extra glow effect for emphasis */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyber-brand-500/20 via-cyber-neon-cyan/20 to-cyber-brand-500/20 blur-3xl -z-10 animate-pulse" />
              <CountdownTimer />
            </div>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-cyber-gray-300 max-w-3xl leading-relaxed px-4">
            Experience professional 3D scanning with up to{" "}
            <span className="text-cyber-brand-400 font-bold text-lg sm:text-xl md:text-2xl">$1,425 OFF</span>{" "}
            during our exclusive Black Friday sale.
          </p>

          {/* CTA button */}
          <div className="flex justify-center pt-2 sm:pt-4">
            <a
              href="#offers"
              aria-label="View Black Friday special offers for Galois 3D LiDAR Camera"
              className="group relative cyber-btn-primary px-10 sm:px-14 md:px-16 py-4 sm:py-5 md:py-6 text-lg sm:text-xl md:text-2xl font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyber-brand-500/50 active:scale-100 shadow-lg shadow-cyber-brand-500/30"
            >
              {/* Extra glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyber-brand-500 to-cyber-neon-cyan opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300 -z-10" />
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
