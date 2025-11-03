"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect } from "react";
import { TOUR_CASES } from "@/lib/constants";
import { CategoryBadge } from "@/components/custom/badges";
import { useToursStore } from "@/store/useToursStore";

export function ToursShowcase() {
  // ✅ 使用 selector 只订阅需要渲染的状态
  const current = useToursStore((state) => state.current);
  const paused = useToursStore((state) => state.paused);
  const touchStart = useToursStore((state) => state.touchStart);
  const prefersReducedMotion = useToursStore((state) => state.prefersReducedMotion);
  const previous = useToursStore((state) => state.previous);

  const DURATION_MS = 5000;

  const slides = TOUR_CASES.map((tour) => ({
    title: tour.title,
    img: tour.image,
    url: tour.url,
    category: tour.category,
    device: "Galois",
  }));

  useEffect(() => {
    const { initialize, startAutoPlay, cleanup } = useToursStore.getState();
    initialize();
    startAutoPlay(slides.length, DURATION_MS);
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!slides.length) return null;

  return (
    <section
      id="showcases"
      aria-label="3D Virtual Tour Showcases"
      className="hero min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-4.5rem)] w-screen bg-cyber-gray-900 p-0 relative overflow-hidden"
    >
      {/* 赛博朋克背景渐变 */}
      <div className="absolute inset-0 bg-linear-to-br from-cyber-brand-500/10 via-transparent to-cyber-neon-cyan/5 pointer-events-none z-0" />
      {/* 网格背景 */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none z-0" />

      <div className="hero-content p-0 w-full max-w-none relative z-10">
        <div
          className="relative w-full overflow-hidden rounded-none shadow-none focus:outline-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          tabIndex={0}
          role="region"
          aria-label="Featured 3D Tours Carousel"
          onKeyDown={(e) => {
            const { prev, next, goTo } = useToursStore.getState();
            if (e.key === "ArrowLeft") prev(slides.length);
            if (e.key === "ArrowRight") next(slides.length);
            if (e.key === "Home") goTo(0, slides.length);
            if (e.key === "End") goTo(slides.length - 1, slides.length);
          }}
          onMouseEnter={() => useToursStore.getState().pauseAutoPlay()}
          onMouseLeave={() => useToursStore.getState().resumeAutoPlay(slides.length, DURATION_MS)}
          onTouchStart={(e) => {
            const t = e.touches[0];
            useToursStore.getState().setTouchStart({ x: t.clientX, y: t.clientY });
            useToursStore.getState().pauseAutoPlay();
          }}
          onTouchEnd={(e) => {
            const s = touchStart;
            useToursStore.getState().setTouchStart(null);
            if (!s) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - s.x;
            const dy = t.clientY - s.y;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
              const { prev, next } = useToursStore.getState();
              if (dx > 0) prev(slides.length);
              else next(slides.length);
            }
            useToursStore.getState().resumeAutoPlay(slides.length, DURATION_MS);
          }}
        >
          {/* Visual container full-bleed with subtle Ken Burns */}
          <div className="relative w-full h-[100svh]">
            {slides.map((s, i) => {
              const isVisible = i === current || i === previous;
              return (
                <div
                  key={`${s.title}-${i}`}
                  className={`absolute inset-0 ${
                    isVisible ? "block" : "hidden"
                  } transition-opacity duration-700 ease-out ${
                    i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                  aria-hidden={i !== current}
                  aria-label={s.title}
                  role="group"
                >
                  <Image
                    src={s.img}
                    alt={`${s.title} - 3D Virtual Tour created with Galois LiDAR Camera - ${s.category}`}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1920px) 100vw, 3840px"
                    quality={90}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%230a0f1a'/%3E%3C/svg%3E"
                    className={`absolute inset-0 object-cover pointer-events-none ${
                      !prefersReducedMotion ? "kenburns-soft" : ""
                    }`}
                  />
                  {/* Immersive centered hero content with enhanced design */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="px-6 md:px-12 w-full max-w-6xl">
                      <div className="text-white text-center">
                        {/* Main Title */}
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
                          <span className="bg-linear-to-r from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
                            {s.title}
                          </span>
                        </h1>

                        <div className="mt-6 mb-8 flex items-center justify-center gap-3 flex-wrap">
                          <CategoryBadge category={s.category} size="lg" />
                        </div>

                        {/* 赛博朋克 CTA 按钮 */}
                        <div className="mt-8 pointer-events-auto">
                          <Link
                            className="cyber-btn-primary btn-lg px-10 py-4 rounded-full text-lg font-semibold shadow-2xl shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm gap-3 cyber-gentle-pulse font-display"
                            href={s.url}
                            target="_blank"
                            rel="noopener "
                            aria-label={`Explore ${s.title} 3D Virtual Tour`}
                          >
                            <Icon
                              icon="solar:rocket-2-bold-duotone"
                              width={24}
                            />
                            <span>Launch Tour</span>
                          </Link>
                        </div>

                        {/* Additional description */}
                        <p className="mt-6 text-white/80 text-base md:text-lg max-w-2xl mx-auto">
                          Immersive 3D virtual experience - Explore every detail
                          of real spaces
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Indicators with modern design */}
          {slides.length > 1 ? (
            <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-20">
              <div className="relative flex items-center gap-2 md:gap-3 overflow-hidden rounded-full border border-cyber-brand-400/40 bg-cyber-gray-900/92 px-4 py-3 shadow-lg shadow-cyber-brand-500/15 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-cyber-brand-500/15" />
                {slides.map((_, i) => {
                  const isActive = i === current;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => useToursStore.getState().goTo(i, slides.length)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`relative overflow-hidden rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-neon-cyan/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                        isActive
                          ? "h-2 md:h-2.5 w-10 md:w-20 bg-white/90"
                          : "h-2 md:h-2.5 w-2.5 md:w-3 bg-cyber-gray-400/40 hover:bg-cyber-brand-200/60"
                      }`}
                      style={{
                        ["--carousel-duration" as any]: `${DURATION_MS}ms`,
                      }}
                      aria-current={isActive}
                    >
                      {isActive ? (
                        <span
                          key={`progress-${current}`}
                          className={`absolute left-0 top-0 bottom-0 rounded-full bg-cyber-brand-400 carousel-progress ${
                            paused || prefersReducedMotion
                              ? "paused"
                              : ""
                          }`}
                          style={{
                            width: 0 as unknown as number,
                            animationPlayState: paused ? "paused" : "running",
                          }}
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
