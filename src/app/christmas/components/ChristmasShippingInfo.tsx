"use client";

import Image from "next/image";
import { CHRISTMAS_SHIPPING_POINTS } from "@/lib/christmas-constants";

interface ChristmasShippingInfoProps {
  className?: string;
}

export function ChristmasShippingInfo({
  className,
}: ChristmasShippingInfoProps) {
  return (
    <section
      id="shipping"
      aria-label="Shipping and Service Information"
      className={`relative overflow-hidden bg-christmas-winter-dark py-12 sm:py-16 md:py-20 lg:py-28 ${
        className || ""
      }`}
    >
      {/* Divider */}
      <div className="absolute top-0 inset-x-0 h-32 section-divider-top z-10" />
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[20%] top-12 h-80 w-80 rounded-full bg-christmas-ice/20 blur-[140px]" />
        <div className="absolute right-[20%] bottom-12 h-72 w-72 rounded-full bg-christmas-silver/15 blur-[150px]" />
        <div className="absolute inset-0 bg-aurora opacity-30 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-gradient-glacial">
            Shop Now, Worry-Free
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Your satisfaction, our commitment. Discover the advantages that set
            us apart.
          </p>
        </div>

        {/* Points grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-fade-up">
          {CHRISTMAS_SHIPPING_POINTS.map((point) => (
            <div
              key={point.title}
              className="group p-8 text-center rounded-2xl bg-white/5 backdrop-blur-sm border border-christmas-winter-light/20 hover-starlight"
            >
              {/* Icon */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-christmas-ice/15 to-christmas-silver/10 blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-christmas-winter-light/30 group-hover:border-christmas-ice/60 transition-colors">
                  <Image
                    src={point.icon}
                    alt={`Realsee ${point.title} - ${point.description}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-100 mb-3 group-hover:text-christmas-ice transition-colors">
                {point.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-300 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
