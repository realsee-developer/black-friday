"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { TOUR_CASES } from "@/lib/constants";

export function ToursShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TOUR_CASES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + TOUR_CASES.length) % TOUR_CASES.length,
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TOUR_CASES.length);
    setIsAutoPlaying(false);
  };

  const currentTour = TOUR_CASES[currentIndex];

  return (
    <section
      id="showcases"
      className="relative overflow-hidden bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-800 to-cyber-gray-900 py-20 sm:py-28"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-cyber-brand-500/15 blur-[180px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-gray-100 mb-4">
            Explore in Galois 3D
          </h2>
          <p className="text-lg sm:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
            Discover stunning 3D tours created with Galois
          </p>
        </div>

        {/* Carousel container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main image */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden cyber-card-neon group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-brand-500/10 to-cyber-neon-cyan/10 z-10" />

            {/* Placeholder image with Ken Burns effect */}
            <div className="relative w-full h-full bg-cyber-gray-800 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 animate-ken-burns">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-32 h-32 mx-auto rounded-full bg-cyber-brand-500/20 flex items-center justify-center">
                      <span className="text-6xl">🏠</span>
                    </div>
                    <p className="text-cyber-gray-300 text-xl font-semibold">
                      {currentTour.title}
                    </p>
                    <p className="text-cyber-gray-400 text-sm">
                      {currentTour.category}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tour link overlay */}
            <a
              href={currentTour.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-cyber-brand-500/80 flex items-center justify-center">
                  <Icon
                    icon="lucide:external-link"
                    className="w-10 h-10 text-white"
                  />
                </div>
                <div className="text-white text-lg font-semibold">
                  View 3D Tour
                </div>
              </div>
            </a>

            {/* Navigation buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-cyber-gray-900/80 backdrop-blur-sm border border-cyber-brand-500/30 text-cyber-gray-100 hover:text-cyber-brand-500 hover:border-cyber-brand-500 transition-all duration-300 hover:scale-110"
              aria-label="Previous"
            >
              <Icon icon="lucide:chevron-left" className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-cyber-gray-900/80 backdrop-blur-sm border border-cyber-brand-500/30 text-cyber-gray-100 hover:text-cyber-brand-500 hover:border-cyber-brand-500 transition-all duration-300 hover:scale-110"
              aria-label="Next"
            >
              <Icon icon="lucide:chevron-right" className="w-6 h-6" />
            </button>
          </div>

          {/* Tour info */}
          <div className="mt-6 text-center space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-cyber-gray-100 mb-2">
                {currentTour.title}
              </h3>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-brand-500/20 border border-cyber-brand-500/30 text-cyber-brand-500 text-sm font-medium">
                <Icon icon="lucide:tag" className="w-4 h-4" />
                {currentTour.category}
              </span>
            </div>
          </div>

          {/* Dots navigation */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {TOUR_CASES.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 h-2 rounded-full bg-cyber-brand-500"
                    : "w-2 h-2 rounded-full bg-cyber-gray-600 hover:bg-cyber-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play toggle */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-cyber-gray-300 text-sm"
            >
              <Icon
                icon={isAutoPlaying ? "lucide:pause" : "lucide:play"}
                className="w-4 h-4"
              />
              <span>{isAutoPlaying ? "Pause" : "Play"} Auto-play</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ken-burns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.1) translate(-2%, -2%);
          }
          100% {
            transform: scale(1) translate(0, 0);
          }
        }

        .animate-ken-burns {
          animation: ken-burns 20s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
