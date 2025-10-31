"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { FEATURES } from "@/lib/constants";

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-800 to-cyber-gray-900 py-20 sm:py-28"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-cyber-brand-500/10 blur-[150px]" />
        <div className="absolute left-1/4 bottom-1/3 h-80 w-80 rounded-full bg-cyber-neon-cyan/10 blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
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
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Video/Visual */}
          <div className="sticky top-24">
            <div className="relative aspect-video rounded-2xl overflow-hidden cyber-card-neon">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-brand-500/10 to-cyber-neon-cyan/10 z-10" />
              <div className="relative w-full h-full bg-cyber-gray-800 flex items-center justify-center">
                {/* Video placeholder */}
                <div className="text-center space-y-4 p-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-cyber-brand-500/20 flex items-center justify-center">
                    <Icon
                      icon="lucide:video"
                      className="w-12 h-12 text-cyber-brand-500"
                    />
                  </div>
                  <p className="text-cyber-gray-400 text-sm">
                    Feature Video {activeFeature + 1}
                    <br />
                    {FEATURES[activeFeature].title.substring(0, 30)}...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-4">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.id}
                className={`cyber-card-neon transition-all duration-300 ${
                  activeFeature === index
                    ? "ring-2 ring-cyber-brand-500 shadow-[0_0_30px_rgba(51,102,255,0.3)]"
                    : ""
                }`}
              >
                <button
                  onClick={() => setActiveFeature(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                        activeFeature === index
                          ? "bg-cyber-brand-500 text-white"
                          : "bg-cyber-gray-700 text-cyber-gray-400"
                      }`}
                    >
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <h3
                      className={`text-lg font-semibold transition-colors ${
                        activeFeature === index
                          ? "text-cyber-brand-500"
                          : "text-cyber-gray-100"
                      }`}
                    >
                      {feature.title}
                    </h3>
                  </div>
                  <Icon
                    icon={
                      activeFeature === index
                        ? "lucide:chevron-down"
                        : "lucide:chevron-right"
                    }
                    className="w-5 h-5 text-cyber-gray-400 transition-transform flex-shrink-0"
                  />
                </button>

                {/* Expanded content */}
                {activeFeature === index && (
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-cyber-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Stacked layout */}
        <div className="lg:hidden space-y-6">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.id}
              className={`cyber-card-neon transition-all duration-300 ${
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
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                      activeFeature === index
                        ? "bg-cyber-brand-500 text-white"
                        : "bg-cyber-gray-700 text-cyber-gray-400"
                    }`}
                  >
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-semibold transition-colors ${
                      activeFeature === index
                        ? "text-cyber-brand-500"
                        : "text-cyber-gray-100"
                    }`}
                  >
                    {feature.title}
                  </h3>
                </div>
                <Icon
                  icon={
                    activeFeature === index
                      ? "lucide:chevron-down"
                      : "lucide:chevron-right"
                  }
                  className="w-5 h-5 text-cyber-gray-400 transition-transform flex-shrink-0"
                />
              </button>

              {/* Expanded content */}
              {activeFeature === index && (
                <div className="px-6 pb-6 space-y-4">
                  {/* Video placeholder */}
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-cyber-brand-500/30">
                    <div className="w-full h-full bg-cyber-gray-800 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 mx-auto rounded-full bg-cyber-brand-500/20 flex items-center justify-center">
                          <Icon
                            icon="lucide:video"
                            className="w-8 h-8 text-cyber-brand-500"
                          />
                        </div>
                        <p className="text-cyber-gray-400 text-xs">
                          Feature Video {index + 1}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-cyber-gray-300 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
