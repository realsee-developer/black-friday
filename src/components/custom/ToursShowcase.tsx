"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { CategoryBadge } from "@/components/custom/badges";
import { TOUR_CASES } from "@/lib/constants";
import { useToursStore } from "@/store/useToursStore";
import { trackTourLaunchClick } from "@/lib/analytics/gtm";

export function ToursShowcase() {
  // ✅ 使用 selector 只订阅需要渲染的状态
  const current = useToursStore((state) => state.current);
  const paused = useToursStore((state) => state.paused);
  const touchStart = useToursStore((state) => state.touchStart);
  const prefersReducedMotion = useToursStore(
    (state) => state.prefersReducedMotion,
  );
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
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <section
      id="showcases"
      aria-label="3D Virtual Tour Showcases"
      className="relative overflow-hidden bg-cyber-gray-900 py-12 sm:py-16 md:py-20"
    >
      {/* 赛博朋克背景渐变 */}
      <div className="absolute inset-0 bg-linear-to-br from-cyber-brand-500/5 via-transparent to-cyber-neon-cyan/5 pointer-events-none z-0" />
      {/* 网格背景 */}
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none z-0" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div
          className="relative w-full overflow-hidden rounded-2xl shadow-lg focus:outline-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
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
          onMouseLeave={() =>
            useToursStore.getState().resumeAutoPlay(slides.length, DURATION_MS)
          }
          onTouchStart={(e) => {
            const t = e.touches[0];
            useToursStore
              .getState()
              .setTouchStart({ x: t.clientX, y: t.clientY });
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
          {/* Visual container with responsive aspect ratios: mobile 4:3, tablet 16:9, desktop 21:9 */}
          <div className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[21/9]">
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 2048px"
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%230a0f1a'/%3E%3C/svg%3E"
                    className={`absolute inset-0 object-cover pointer-events-none ${
                      !prefersReducedMotion ? "kenburns-soft" : ""
                    }`}
                  />
                  {/* Immersive centered hero content with enhanced design */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="px-4 sm:px-6 md:px-12 w-full max-w-6xl">
                      <div className="text-white text-center">
                        {/* Main Title */}
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight mb-4 sm:mb-6">
                          <span className="bg-linear-to-r from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
                            {s.title}
                          </span>
                        </h1>

                        <div className="mt-4 sm:mt-6 mb-6 sm:mb-8 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                          <CategoryBadge category={s.category} size="lg" />
                        </div>

                        {/* 赛博朋克 CTA 按钮 */}
                        <div className="mt-6 sm:mt-8 pointer-events-auto">
                          <Link
                            className="cyber-btn-primary px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold shadow-2xl shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm gap-1.5 sm:gap-2 cyber-gentle-pulse font-display min-h-[40px] sm:min-h-[44px] md:min-h-[48px] flex items-center justify-center touch-none inline-flex"
                            href={s.url}
                            target="_blank"
                            rel="noopener "
                            aria-label={`Explore ${s.title} 3D Virtual Tour`}
                            onClick={() =>
                              trackTourLaunchClick(s.title, s.url, s.category)
                            }
                          >
                            <Icon
                              icon="solar:rocket-2-bold-duotone"
                              width={16}
                              className="sm:w-5 md:w-5"
                            />
                            <span>Launch Tour</span>
                          </Link>
                        </div>

                        {/* Additional description */}
                        <p className="mt-4 sm:mt-6 text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
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
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 px-4">
              {/* 移动端：页码显示 */}
              <div className="md:hidden rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 shadow-xl shadow-black/40 backdrop-blur-md">
                <span className="text-xs text-white font-semibold tabular-nums tracking-wider">
                  {current + 1} <span className="text-white/50 mx-0.5">/</span> {slides.length}
                </span>
              </div>
              
              {/* 平板和桌面：指示点 */}
              <div className="hidden md:flex relative items-center gap-2 lg:gap-3 overflow-hidden rounded-full border border-cyber-brand-400/40 bg-cyber-gray-900/92 px-3 lg:px-4 py-2 lg:py-3 shadow-lg shadow-cyber-brand-500/15 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-cyber-brand-500/15" />
                {slides.map((_, i) => {
                  const isActive = i === current;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        useToursStore.getState().goTo(i, slides.length)
                      }
                      aria-label={`Go to slide ${i + 1}`}
                      className={`relative overflow-hidden rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-neon-cyan/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent touch-none ${
                        isActive
                          ? "h-2 lg:h-2.5 w-10 lg:w-14 bg-white/90"
                          : "h-2 lg:h-2.5 w-2 lg:w-2.5 bg-cyber-gray-400/40 hover:bg-cyber-brand-200/60"
                      }`}
                      style={
                        {
                          "--carousel-duration": `${DURATION_MS}ms`,
                        } as React.CSSProperties
                      }
                      aria-current={isActive}
                    >
                      {isActive ? (
                        <span
                          key={`progress-${current}`}
                          className={`absolute left-0 top-0 bottom-0 rounded-full bg-cyber-brand-400 carousel-progress ${
                            paused || prefersReducedMotion ? "paused" : ""
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
