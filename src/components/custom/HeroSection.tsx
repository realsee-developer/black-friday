import { CountdownTimer } from "./CountdownTimer";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-900 to-cyber-gray-800 ${className || ""}`}
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 -z-10">
        {/* Grid pattern */}
        <div className="cyber-grid absolute inset-0 opacity-10" />

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyber-brand-500/20 blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyber-neon-cyan/15 blur-[130px] animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full bg-cyber-neon-magenta/10 blur-[120px] animate-pulse animation-delay-2000" />

        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(51,102,255,0.03)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Event badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyber-brand-500/20 to-cyber-neon-cyan/20 border border-cyber-brand-500/30">
              <div className="w-2 h-2 rounded-full bg-cyber-brand-500 animate-pulse" />
              <span className="text-sm font-bold text-cyber-brand-500 uppercase tracking-wider">
                Limited Time Offer
              </span>
            </div>

            {/* Main title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-gray-100 via-cyber-brand-500 to-cyber-neon-cyan">
                  Black Friday Event
                </span>
              </h1>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyber-gray-100">
                Galois 3D LiDAR Camera
              </h2>

              <p className="text-xl sm:text-2xl text-cyber-brand-500 font-semibold">
                Nov 17th - Dec 7th, 2025
              </p>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl text-cyber-gray-300 max-w-2xl mx-auto lg:mx-0">
              Experience professional 3D scanning with up to{" "}
              <span className="text-cyber-brand-500 font-bold">$1,425 OFF</span>{" "}
              during our exclusive Black Friday sale.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#offers"
                className="cyber-btn-primary px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              >
                View Offers
              </a>
              <a
                href="#showcases"
                className="cyber-btn-secondary px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              >
                Explore 3D Tours
              </a>
            </div>
          </div>

          {/* Right: Hero image + Countdown */}
          <div className="space-y-8">
            {/* Countdown Timer */}
            <div className="cyber-card-neon p-6 sm:p-8">
              <CountdownTimer />
            </div>

            {/* Hero product image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden cyber-card-neon">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-brand-500/10 to-cyber-neon-cyan/10" />
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Placeholder - will be replaced with actual product image */}
                <div className="text-center space-y-4 p-8">
                  <div className="w-32 h-32 mx-auto rounded-full bg-cyber-brand-500/20 flex items-center justify-center">
                    <span className="text-6xl">📷</span>
                  </div>
                  <p className="text-cyber-gray-400 text-sm">
                    Hero Product Image
                    <br />
                    Galois 3D LiDAR Camera
                  </p>
                </div>
              </div>
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
