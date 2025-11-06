"use client";

import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { KOL_VIDEOS } from "@/lib/constants";
import { useTestimonialStore } from "@/store/useTestimonialStore";
import { Professionals } from "./Professionals";
import { WorldMap } from "./WorldMap";

interface TestimonialSectionProps {
  className?: string;
}

const AUTO_PLAY_INTERVAL = 8000; // 8秒自动切换

export function TestimonialSection({ className }: TestimonialSectionProps) {
  // ✅ 使用 selector 只订阅需要渲染的状态
  const currentPage = useTestimonialStore((state) => state.currentPage);
  const paused = useTestimonialStore((state) => state.paused);
  const itemsPerPage = useTestimonialStore((state) => state.itemsPerPage);
  const sortedVideos = useTestimonialStore((state) => state.sortedVideos);
  const isLoadingOrder = useTestimonialStore((state) => state.isLoadingOrder);
  const prefersReducedMotion = useTestimonialStore(
    (state) => state.prefersReducedMotion,
  );
  const touchStart = useTestimonialStore((state) => state.touchStart);

  const totalPages = Math.ceil(sortedVideos.length / itemsPerPage);

  // 初始化
  useEffect(() => {
    const { initialize, cleanup } = useTestimonialStore.getState();
    initialize(KOL_VIDEOS);
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 响应式处理 - 只在客户端挂载后执行
  useEffect(() => {
    // 确保在客户端执行
    if (typeof window === "undefined") return;

    const handleResize = () => {
      useTestimonialStore
        .getState()
        .setItemsPerPage(window.innerWidth < 768 ? 1 : 2);
    };
    // 延迟执行以确保 hydration 完成
    const timer = setTimeout(() => {
      handleResize();
    }, 0);
    
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 键盘导航
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      const { prevPage, nextPage } = useTestimonialStore.getState();
      if (e.key === "ArrowLeft") {
        prevPage(totalPages);
      } else if (e.key === "ArrowRight") {
        nextPage(totalPages);
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [totalPages]);

  // Intersection Observer 追踪视频曝光
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const videoId = entry.target.getAttribute("data-video-id");
          if (
            videoId &&
            entry.isIntersecting &&
            entry.intersectionRatio >= 0.5
          ) {
            useTestimonialStore.getState().markVideoExposed(videoId);
          }
        }
      },
      {
        threshold: [0.5],
        rootMargin: "0px",
      },
    );

    // 观察所有视频元素
    const videoElements = document.querySelectorAll("[data-video-id]");
    videoElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // 自动播放
  useEffect(() => {
    if (paused || totalPages <= 1 || prefersReducedMotion) return;

    const timer = setInterval(() => {
      useTestimonialStore.getState().nextPage(totalPages);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [paused, totalPages, prefersReducedMotion]);

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    useTestimonialStore.getState().setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const deltaX = e.changedTouches[0].clientX - touchStart.x;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStart.y);

    // 只有水平滑动距离大于垂直滑动时才触发
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
      const { prevPage, nextPage } = useTestimonialStore.getState();
      if (deltaX > 0) {
        prevPage(totalPages);
      } else {
        nextPage(totalPages);
      }
    }

    useTestimonialStore.getState().setTouchStart(null);
  };

  // 判断是否应该加载 iframe
  const shouldLoadIframe = (index: number): boolean => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visibleStart = Math.max(0, startIndex - itemsPerPage);
    const visibleEnd = Math.min(sortedVideos.length, endIndex + itemsPerPage);
    return index >= visibleStart && index < visibleEnd;
  };

  return (
    <section
      id="testimonial"
      className={`relative overflow-hidden bg-linear-to-b from-cyber-gray-900 via-cyber-gray-800 to-cyber-gray-900 py-12 sm:py-16 md:py-20 lg:py-28${className ? ` ${className}` : ""}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-linear-to-r from-cyber-blue via-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
            What Professionals Say
          </h2>
        </div>

        {/* KOL 视频轮播 */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 text-white">
              Creator Testimonials
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-300">
              Trusted by Photographers and 3D Creators Worldwide
            </p>
          </div>

          {isLoadingOrder ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-cyan"></div>
            </div>
          ) : (
            <div className="relative">
              {/* 轮播容器 - 有 overflow-hidden，添加 padding-top 防止 hover 时上边框被裁剪 */}
              <div
                className="overflow-hidden relative z-0 pt-4 pb-2"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() =>
                  useTestimonialStore.getState().setPaused(true)
                }
                onMouseLeave={() =>
                  useTestimonialStore.getState().setPaused(false)
                }
              >
                <div
                  className="flex gap-8 transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${currentPage * 100}%)`,
                  }}
                >
                  {sortedVideos.map((video, index) => (
                    <div
                      key={video.id}
                      className="shrink-0 w-full md:w-[calc(50%-1rem)] flex flex-col relative"
                      data-video-id={video.id}
                    >
                      {/* iframe 播放器 */}
                      <div
                        className="relative overflow-hidden youtube-iframe-card rounded-xl"
                        style={{ aspectRatio: "16/9" }}
                      >
                        {shouldLoadIframe(index) ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${video.youtubeId}?modestbranding=1&rel=0`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <div className="text-gray-400">Loading...</div>
                          </div>
                        )}
                      </div>

                      {/* 视频信息 */}
                      <div className="mt-4 px-2">
                        <h4 className="text-xl font-bold text-white mb-1">
                          {video.title}
                        </h4>
                        <p className="text-gray-400">{video.creator}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 导航按钮 - 在 overflow-hidden 容器外部，不会被裁剪 */}
              {totalPages > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      useTestimonialStore.getState().prevPage(totalPages);
                    }}
                    className="absolute left-0 top-[39%] -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-[9999] bg-cyber-gray-800/90 hover:bg-cyber-gray-700 p-2 sm:p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center touch-none"
                    style={{ pointerEvents: "auto" }}
                    disabled={currentPage === 0}
                    aria-label="Previous videos"
                  >
                    <Icon
                      icon="mdi:chevron-left"
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white pointer-events-none"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      useTestimonialStore.getState().nextPage(totalPages);
                    }}
                    className="absolute right-0 top-[39%] -translate-y-1/2 translate-x-2 sm:translate-x-4 z-[9999] bg-cyber-gray-800/90 hover:bg-cyber-gray-700 p-2 sm:p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center touch-none"
                    style={{ pointerEvents: "auto" }}
                    disabled={currentPage === totalPages - 1}
                    aria-label="Next videos"
                  >
                    <Icon
                      icon="mdi:chevron-right"
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white pointer-events-none"
                    />
                  </button>
                </>
              )}

              {/* 页码指示器 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 sm:mt-8">
                  {/* 移动端：页码显示 */}
                  <div className="md:hidden rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 shadow-xl shadow-black/40 backdrop-blur-md">
                    <span className="text-xs text-white font-semibold tabular-nums tracking-wider">
                      {currentPage + 1} <span className="text-white/50 mx-0.5">/</span> {totalPages}
                    </span>
                  </div>
                  
                  {/* 平板和桌面：指示点 */}
                  <div className="hidden md:flex gap-2 lg:gap-3">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          useTestimonialStore
                            .getState()
                            .goToPage(index, totalPages)
                        }
                        className={`h-2 lg:h-2.5 rounded-full transition-all touch-none ${
                          index === currentPage
                            ? "w-10 lg:w-14 bg-cyber-brand-400"
                            : "w-2 lg:w-2.5 bg-cyber-brand-400/40 hover:bg-cyber-brand-400/60"
                        }`}
                        aria-label={`Go to page ${index + 1}`}
                      >
                        <span className="sr-only">Page {index + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 专业摄影师 */}
      <Professionals />

      {/* 全球覆盖地图 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <WorldMap />
      </div>
    </section>
  );
}
