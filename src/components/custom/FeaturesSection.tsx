"use client";

import { Icon } from "@iconify/react";
import type { APITypes } from "plyr-react";
import { FEATURES } from "@/lib/constants";
import { useFeaturesStore } from "@/store/useFeaturesStore";
import { CyberVideoPlayer } from "./CyberVideoPlayer";

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
}

export function FeaturesSection({
  title = "LiDAR 3D Solution with Pay-As-You-Go 3D Hosting",
  subtitle = "Professional-grade features designed for creators",
}: FeaturesSectionProps) {
  // ✅ 使用 selector 只订阅需要的状态
  const activeFeature = useFeaturesStore((state) => state.activeFeature);
  const setActiveFeature = useFeaturesStore((state) => state.setActiveFeature);

  // ✅ 直接使用 getState()，不需要 useCallback
  const handlePlyrReady = (player: APITypes) => {
    useFeaturesStore.getState().setPlyrRef(player);
  };

  // Safety check - if FEATURES is empty or activeFeature is invalid, return null
  if (
    FEATURES.length === 0 ||
    activeFeature >= FEATURES.length ||
    activeFeature < 0
  ) {
    return null;
  }

  const currentFeature = FEATURES[activeFeature];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-linear-to-b from-cyber-gray-900 via-cyber-gray-800 to-cyber-gray-900 py-12 sm:py-16 md:py-20"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-cyber-brand-500/10 blur-[150px]" />
        <div className="absolute left-1/4 bottom-1/3 h-80 w-80 rounded-full bg-cyber-neon-cyan/10 blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyber-gray-100 mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Desktop: Video + Accordion side by side */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Video/Visual - 7 columns (increased from 6) */}
          <div className="lg:col-span-7 sticky top-24">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-cyber-gray-900 border border-cyber-gray-700 shadow-[0_0_20px_rgba(51,102,255,0.1)]">
              {/* Plyr 视频播放器 */}
              <CyberVideoPlayer
                key={currentFeature.id}
                src={currentFeature.video}
                onReady={handlePlyrReady}
              />

              {/* 特性切换按钮 - 悬浮在视频上方 */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={() => useFeaturesStore.getState().prevFeature()}
                  disabled={activeFeature === 0}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-black/60 hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all backdrop-blur-sm border border-white/10 min-h-[44px] min-w-[44px] touch-none"
                  type="button"
                  aria-label="上一个特性"
                >
                  <Icon
                    icon="lucide:chevron-left"
                    className="w-5 h-5 text-white"
                  />
                </button>

                <div className="px-3 py-1.5 text-sm text-white font-medium bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
                  {activeFeature + 1} / {FEATURES.length}
                </div>

                <button
                  onClick={() =>
                    useFeaturesStore.getState().nextFeature(FEATURES.length)
                  }
                  disabled={activeFeature === FEATURES.length - 1}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-black/60 hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all backdrop-blur-sm border border-white/10 min-h-[44px] min-w-[44px] touch-none"
                  type="button"
                  aria-label="下一个特性"
                >
                  <Icon
                    icon="lucide:chevron-right"
                    className="w-5 h-5 text-white"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Accordion - 5 columns (decreased from 6) */}
          <div className="lg:col-span-5 sticky top-24">
            {/* 内容容器 - 固定高度与视频一致 */}
            <div className="h-full rounded-2xl bg-linear-to-b from-cyber-gray-900/20 to-cyber-gray-900/40 p-1.5 lg:p-2 xl:p-2.5">
              {/* 内容区域 - 响应式调整间距 */}
              <div className="h-full flex flex-col gap-1 lg:gap-1.5 xl:gap-2">
                {FEATURES.map((feature, index) => {
                  const isActive = activeFeature === index;

                  return (
                    <div
                      key={feature.id}
                      className={`rounded-xl border transition-all duration-300 cursor-pointer flex flex-col ${
                        isActive
                          ? "flex-1 bg-cyber-gray-800/90 backdrop-blur-sm border-cyber-brand-500 shadow-[0_0_20px_rgba(51,102,255,0.2)]"
                          : "flex-none h-11 lg:h-12 xl:h-14 bg-cyber-gray-800/50 backdrop-blur-sm border-cyber-gray-700/50 hover:border-cyber-gray-600 hover:bg-cyber-gray-800/70"
                      }`}
                    >
                      {/* 标题按钮 - 响应式固定高度 */}
                      <button
                        onClick={() => setActiveFeature(index)}
                        className="w-full flex items-center justify-between px-3 lg:px-3.5 xl:px-4 py-2 lg:py-2.5 xl:py-3 text-left shrink-0 h-11 lg:h-12 xl:h-14 min-h-[44px] touch-none"
                        type="button"
                      >
                        <div className="flex items-center gap-2 lg:gap-2.5 xl:gap-3 flex-1 min-w-0">
                          <div
                            className={`flex items-center justify-center w-7 h-7 xl:w-8 xl:h-8 rounded-full transition-all duration-300 shrink-0 ${
                              isActive
                                ? "bg-cyber-brand-500 text-white scale-110"
                                : "bg-cyber-gray-700 text-cyber-gray-400 scale-100"
                            }`}
                          >
                            <span className="font-bold text-xs">
                              {index + 1}
                            </span>
                          </div>
                          <h3
                            className={`text-xs lg:text-sm font-semibold transition-colors duration-300 leading-tight ${
                              isActive
                                ? "text-cyber-brand-500 line-clamp-2 lg:line-clamp-3"
                                : "text-cyber-gray-100 line-clamp-1 lg:line-clamp-2"
                            }`}
                          >
                            {feature.title}
                          </h3>
                        </div>
                        <Icon
                          icon="lucide:chevron-down"
                          className={`w-4 h-4 text-cyber-gray-400 shrink-0 ml-1.5 lg:ml-2 transition-all duration-300 ${
                            isActive ? "rotate-0" : "-rotate-90"
                          }`}
                        />
                      </button>

                      {/* 展开内容 - 占据剩余空间并支持滚动 */}
                      {isActive && (
                        <div className="flex-1 px-3 lg:px-3.5 xl:px-4 pb-3 lg:pb-3.5 xl:pb-4 overflow-y-auto min-h-0">
                          <p className="text-cyber-gray-300 leading-relaxed text-xs lg:text-sm">
                            {feature.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Stacked layout */}
        <div className="lg:hidden space-y-4 sm:space-y-6">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.id}
              className={`cyber-card-neon transition-all duration-300 overflow-hidden ${
                activeFeature === index
                  ? "ring-2 ring-cyber-brand-500 shadow-[0_0_30px_rgba(51,102,255,0.3)]"
                  : ""
              }`}
            >
              {/* Header */}
              <button
                type="button"
                onClick={() =>
                  setActiveFeature(activeFeature === index ? -1 : index)
                }
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left min-h-[44px] touch-none"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <div
                    className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
                      activeFeature === index
                        ? "bg-cyber-brand-500 text-white scale-110"
                        : "bg-cyber-gray-700 text-cyber-gray-400 scale-100"
                    }`}
                  >
                    <span className="font-bold text-sm sm:text-base">
                      {index + 1}
                    </span>
                  </div>
                  <h3
                    className={`text-sm sm:text-base md:text-lg font-semibold transition-colors duration-300 ${
                      activeFeature === index
                        ? "text-cyber-brand-500"
                        : "text-cyber-gray-100"
                    }`}
                  >
                    {feature.title}
                  </h3>
                </div>
                <Icon
                  icon="lucide:chevron-down"
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-cyber-gray-400 transition-all duration-300 shrink-0 ${
                    activeFeature === index ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>

              {/* Expanded content with animation */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  activeFeature === index
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                  {/* Feature video */}
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-cyber-brand-500/30 bg-cyber-gray-900">
                    <CyberVideoPlayer key={feature.video} src={feature.video} />
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-cyber-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
