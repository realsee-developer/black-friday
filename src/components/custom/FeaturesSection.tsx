"use client";

import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import { FEATURES } from "@/lib/constants";
import { CyberVideoPlayer } from "./CyberVideoPlayer";
import type { APITypes } from "plyr-react";

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const plyrRef = useRef<APITypes | null>(null);

  // Plyr 播放器就绪回调
  const handlePlyrReady = (player: APITypes) => {
    plyrRef.current = player;
  };

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-linear-to-b from-cyber-gray-900 via-cyber-gray-800 to-cyber-gray-900 py-20 sm:py-28"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-cyber-brand-500/10 blur-[150px]" />
        <div className="absolute left-1/4 bottom-1/3 h-80 w-80 rounded-full bg-cyber-neon-cyan/10 blur-[140px]" />
      </div>

      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-gray-100 mb-4">
            LiDAR 3D Solution with Pay-As-You-Go 3D Hosting
          </h2>
          <p className="text-lg sm:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
            Professional-grade features designed for creators
          </p>
        </div>

        {/* Desktop: Video + Accordion side by side */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Video/Visual - 6 columns */}
          <div className="lg:col-span-6 sticky top-24">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-cyber-gray-900 border border-cyber-gray-700 shadow-[0_0_20px_rgba(51,102,255,0.1)]">
              {/* Plyr 视频播放器 */}
              <CyberVideoPlayer
                key={FEATURES[activeFeature].id}
                src={FEATURES[activeFeature].video}
                onReady={handlePlyrReady}
              />
              
              {/* 特性切换按钮 - 悬浮在视频上方 */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={() => setActiveFeature(Math.max(0, activeFeature - 1))}
                  disabled={activeFeature === 0}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-black/60 hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all backdrop-blur-sm border border-white/10"
                  type="button"
                  aria-label="上一个特性"
                >
                  <Icon icon="lucide:chevron-left" className="w-5 h-5 text-white" />
                </button>
                
                <div className="px-3 py-1.5 text-sm text-white font-medium bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
                  {activeFeature + 1} / {FEATURES.length}
                </div>
                
                <button
                  onClick={() => setActiveFeature(Math.min(FEATURES.length - 1, activeFeature + 1))}
                  disabled={activeFeature === FEATURES.length - 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-black/60 hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all backdrop-blur-sm border border-white/10"
                  type="button"
                  aria-label="下一个特性"
                >
                  <Icon icon="lucide:chevron-right" className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Accordion - 6 columns */}
          <div className="lg:col-span-6 sticky top-24">
            {/* 内容容器 - 固定高度与视频一致 */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-linear-to-b from-cyber-gray-900/20 to-cyber-gray-900/40">
              {/* 内容区域 */}
              <div className="absolute inset-0 flex flex-col gap-2 p-3">
                {FEATURES.map((feature, index) => (
                  <div
                    key={feature.id}
                    className={`rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${
                      activeFeature === index
                        ? "flex-1 bg-cyber-gray-800/90 backdrop-blur-sm border-cyber-brand-500 shadow-[0_0_20px_rgba(51,102,255,0.2)]"
                        : "flex-none bg-cyber-gray-800/50 backdrop-blur-sm border-cyber-gray-700/50 hover:border-cyber-gray-600 hover:bg-cyber-gray-800/70"
                    }`}
                  >
                    <button
                      onClick={() => setActiveFeature(index)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left shrink-0"
                      type="button"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div
                          className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 shrink-0 ${
                            activeFeature === index
                              ? "bg-cyber-brand-500 text-white scale-110"
                              : "bg-cyber-gray-700 text-cyber-gray-400 scale-100"
                          }`}
                        >
                          <span className="font-bold text-sm">{index + 1}</span>
                        </div>
                        <h3
                          className={`text-base font-semibold transition-colors duration-300 leading-snug ${
                            activeFeature === index
                              ? "text-cyber-brand-500 line-clamp-3"
                              : "text-cyber-gray-100 line-clamp-2"
                          }`}
                        >
                          {feature.title}
                        </h3>
                      </div>
                      <Icon
                        icon="lucide:chevron-down"
                        className={`w-5 h-5 text-cyber-gray-400 shrink-0 ml-3 transition-all duration-300 ${
                          activeFeature === index ? "rotate-0" : "-rotate-90"
                        }`}
                      />
                    </button>

                    {/* Expanded content with animation */}
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        activeFeature === index
                          ? "flex-1 opacity-100 overflow-y-auto"
                          : "max-h-0 opacity-0 overflow-hidden"
                      }`}
                    >
                      <div className="px-5 pb-6 pt-2 h-full flex items-center">
                        <p className="text-cyber-gray-300 leading-relaxed text-base">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Stacked layout */}
        <div className="lg:hidden space-y-6">
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
                onClick={() =>
                  setActiveFeature(activeFeature === index ? -1 : index)
                }
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                      activeFeature === index
                        ? "bg-cyber-brand-500 text-white scale-110"
                        : "bg-cyber-gray-700 text-cyber-gray-400 scale-100"
                    }`}
                  >
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-semibold transition-colors duration-300 ${
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
                  className={`w-5 h-5 text-cyber-gray-400 transition-all duration-300 shrink-0 ${
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
                <div className="px-6 pb-6 space-y-4">
                  {/* Feature video */}
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-cyber-brand-500/30 bg-cyber-gray-900">
                    <CyberVideoPlayer
                      key={feature.video}
                      src={feature.video}
                    />
                  </div>

                  {/* Description */}
                  <p className="text-cyber-gray-300 leading-relaxed text-sm">
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
