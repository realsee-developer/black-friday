"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { RETAIL_PARTNERS } from "@/lib/constants";

interface RetailPartnersProps {
  className?: string;
  countryCode?: string | null;
}

export function RetailPartners({ className, countryCode }: RetailPartnersProps) {
  // Only show for US and Canada
  // If countryCode is null/undefined, don't show (default to hiding for unknown locations)
  const isNorthAmerica = countryCode === "US" || countryCode === "CA";
  
  if (!isNorthAmerica) {
    return null;
  }
  return (
    <section
      id="partners"
      aria-label="Authorized Retail Partners"
      className={`relative overflow-hidden bg-linear-to-b from-cyber-gray-800 via-cyber-gray-900 to-cyber-gray-900 py-12 sm:py-16 md:py-20 lg:py-28 ${className || ""}`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-cyber-neon-cyan/10 blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-cyber-brand-500/15 blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyber-gray-100 mb-3 sm:mb-4">
            Available at Trusted Retailers
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-cyber-gray-300 max-w-3xl mx-auto mb-3 sm:mb-4">
            Purchase Galois from our authorized retail partners worldwide
          </p>
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-brand-500/10 border border-cyber-brand-500/30">
            <Icon
              icon="lucide:shield-check"
              className="w-4 h-4 text-cyber-neon-cyan"
            />
            <span className="text-sm text-cyber-gray-300">
              All partners offer genuine Galois products with full warranty
            </span>
          </div>
        </div>

        {/* Partners grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {RETAIL_PARTNERS.map((partner) => (
            <div key={partner.id} className="group">
              {/* Hero Image with brand color glow */}
              <div className="relative">
                {/* Brand color background glow */}
                <div
                  className="absolute -inset-3 rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, rgba(${partner.themeColor.shadow}, 0.4) 0%, transparent 70%)`,
                  }}
                />
                
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener "
                  className="block relative aspect-[16/9] overflow-hidden rounded-2xl transition-all duration-300"
                  style={{
                    boxShadow: `0 4px 20px rgba(${partner.themeColor.shadow}, 0.2)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 8px 40px rgba(${partner.themeColor.shadow}, 0.5)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 4px 20px rgba(${partner.themeColor.shadow}, 0.2)`;
                  }}
                >
                  <Image
                    src={partner.heroImage}
                    alt={`${partner.name} - Realsee Galois M2 3D LiDAR Camera - Black Friday Sale`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority
                  />
                  {/* Subtle border with brand color */}
                  <div
                    className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      borderColor: `rgba(${partner.themeColor.shadow}, 0.3)`,
                    }}
                  />
                </a>
              </div>

              {/* CTA Button */}
              <a
                href={partner.url}
                target="_blank"
                rel="noopener "
                className="mt-4 sm:mt-6 flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base text-white font-semibold shadow-lg transition-all duration-300 min-h-[44px] touch-none"
                style={{
                  background: `linear-gradient(to right, ${partner.themeColor.from}, ${partner.themeColor.to})`,
                  boxShadow: `0 10px 25px -5px rgba(${partner.themeColor.shadow}, 0.3)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = partner.themeColor.hover;
                  e.currentTarget.style.boxShadow = `0 10px 30px -5px rgba(${partner.themeColor.shadow}, 0.5)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(to right, ${partner.themeColor.from}, ${partner.themeColor.to})`;
                  e.currentTarget.style.boxShadow = `0 10px 25px -5px rgba(${partner.themeColor.shadow}, 0.3)`;
                }}
              >
                <span>Shop Now</span>
                <Icon
                  icon="lucide:arrow-right"
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
