"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { Professionals } from "./Professionals";
import { WorldMap } from "./WorldMap";
import { GLOBAL_STATS, KOL_VIDEOS } from "@/lib/constants";

interface TestimonialSectionProps {
  className?: string;
}

export function TestimonialSection({ className }: TestimonialSectionProps) {
  // 轮播状态管理
  const [currentPage, setCurrentPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const AUTO_PLAY_INTERVAL = 5000;
  const prefersReducedMotion = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // 响应式检测
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 检查用户是否偏好减少动画
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;
  }, []);

  // 计算总页数和懒加载范围
  const totalPages = Math.ceil(KOL_VIDEOS.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // 懒加载逻辑：只加载当前页及相邻页的 iframe
  const shouldLoadIframe = (index: number) => {
    const visibleStart = Math.max(0, startIndex - itemsPerPage);
    const visibleEnd = Math.min(
      KOL_VIDEOS.length,
      endIndex + itemsPerPage
    );
    return index >= visibleStart && index < visibleEnd;
  };

  // 导航函数
  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // 自动播放
  useEffect(() => {
    if (paused || totalPages <= 1 || prefersReducedMotion.current) return;

    const timer = setInterval(() => {
      nextPage();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [currentPage, paused, totalPages, itemsPerPage]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevPage();
      } else if (e.key === "ArrowRight") {
        nextPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages]);

  return (
    <section
      id="testimonial"
      className={`relative overflow-hidden bg-linear-to-b from-cyber-gray-900 via-cyber-gray-800 to-cyber-gray-900 py-20 sm:py-28 ${className || ""}`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyber-brand-500/10 blur-[150px]" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-cyber-neon-cyan/10 blur-[140px]" />
      </div>

      <div className="container mx-auto px-6">
        {/* 1. KOL Videos Carousel */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-gray-100 mb-4">
              Watch Galois in Action
            </h2>
            <p className="text-lg sm:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
              Get inspired by real-world applications. Explore our curated
              collection of YouTube reviews from trusted experts.
            </p>
          </div>

          {/* Carousel Container */}
          <div
            className="relative max-w-7xl mx-auto youtube-carousel-container"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => {
              const t = e.touches[0];
              touchStart.current = { x: t.clientX, y: t.clientY };
            }}
            onTouchEnd={(e) => {
              const s = touchStart.current;
              if (!s) return;
              const t = e.changedTouches[0];
              const dx = t.clientX - s.x;
              const dy = t.clientY - s.y;
              if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                if (dx > 0) prevPage();
                else nextPage();
              }
              touchStart.current = null;
            }}
          >
            {/* Video Cards */}
            <div className="overflow-hidden">
              <div
                className="flex gap-8 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentPage * 100}%)`,
                }}
              >
                {KOL_VIDEOS.map((video, index) => (
                  <div
                    key={video.id}
                    className="shrink-0 w-full md:w-[calc(50%-1rem)] flex flex-col"
                  >
                    {/* iframe 播放器 */}
                    <div
                      className="overflow-hidden youtube-iframe-card rounded-xl"
                      style={{ aspectRatio: "16/9" }}
                    >
                      {shouldLoadIframe(index) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtubeId}?modestbranding=1&rel=0`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                          className="w-full h-full border-0 rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-cyber-gray-800 flex items-center justify-center rounded-xl">
                          <Icon
                            icon="lucide:play-circle"
                            className="w-16 h-16 text-cyber-gray-600"
                          />
                        </div>
                      )}
                    </div>
                    {/* 视频信息 */}
                    <div className="mt-4">
                      <h3 className="text-cyber-gray-100 font-semibold text-lg mb-1">
                        {video.title}
                      </h3>
                      <p className="text-sm text-cyber-gray-400">
                        by {video.creator}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {totalPages > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="absolute left-0 md:left-4 top-1/3 -translate-y-1/2 carousel-nav-btn flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed z-10"
                  aria-label="Previous videos"
                >
                  <Icon icon="lucide:chevron-left" className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className="absolute right-0 md:right-4 top-1/3 -translate-y-1/2 carousel-nav-btn flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed z-10"
                  aria-label="Next videos"
                >
                  <Icon icon="lucide:chevron-right" className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Page Indicators */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToPage(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentPage
                      ? "w-8 bg-cyber-brand-500"
                      : "w-2 bg-cyber-gray-600 hover:bg-cyber-gray-500"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                  aria-current={i === currentPage}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Professionals */}
      <Professionals />

      <div className="container mx-auto px-6">
        {/* 3. Global Stats */}
        <div className="py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-gray-100 mb-4">
              Trusted 3D Tour Solution for Global Business
            </h2>
            <p className="text-lg sm:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
              Powering innovation across continents
            </p>
          </div>

          {/* World Map with Stats */}
          <WorldMap />
        </div>
      </div>
    </section>
  );
}
