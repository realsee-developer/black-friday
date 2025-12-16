"use client";

import { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { CHRISTMAS_GLOBAL_STATS } from "@/lib/christmas-constants";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function AnimatedCounter({ end, duration = 2000, suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(0)}M`;
    }
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  return (
    <div
      ref={ref}
      className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-brand-500"
    >
      {formatNumber(count)}
      {suffix}
    </div>
  );
}

export function TrustStats() {
  return (
    <section
      id="trust-stats"
      aria-label="Global Trust Statistics"
      className="relative overflow-hidden bg-cyber-gray-900 py-16 sm:py-20 md:py-24"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyber-brand-500/10 blur-[200px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-3 sm:mb-4">
            Trusted 3D Tour Solution for Global Business
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of professionals using Realsee to create stunning 3D
            experiences
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 max-w-5xl mx-auto">
          {CHRISTMAS_GLOBAL_STATS.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 sm:p-8 rounded-2xl bg-cyber-gray-700/50 backdrop-blur-sm border border-cyber-gray-600 hover:border-cyber-brand-500 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>

              {/* Animated counter */}
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                duration={2500}
              />

              {/* Label */}
              <p className="mt-2 text-sm sm:text-base text-cyber-gray-300 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
