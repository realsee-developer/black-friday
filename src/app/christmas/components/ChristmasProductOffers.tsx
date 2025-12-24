"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { CHRISTMAS_PRODUCTS } from "@/lib/christmas-constants";
import { useProductStore } from "@/store/useProductStore";
import {
  trackProductContactClick,
  trackProductDetailsView,
} from "@/lib/analytics/gtm";

export function ChristmasProductOffers() {
  const expandedProduct = useProductStore((state) => state.expandedProduct);
  const showMobileDetails = useProductStore((state) => state.showMobileDetails);

  return (
    <section
      id="offers"
      aria-label="Christmas Product Offers"
      className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900 py-8 sm:py-10 md:py-12 lg:py-16"
    >
      {/* Soft gradient divider at top */}
      <div className="absolute top-0 inset-x-0 h-32 section-divider-top" />
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="christmas-grid absolute inset-0 opacity-5" />
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-christmas-red/10 blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-christmas-gold/10 blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-christmas-red/20 border border-christmas-red/40">
            <span className="text-2xl">🎅</span>
            <span className="text-white/90 font-semibold">
              Limited Time Offer
            </span>
            <span className="text-2xl">🎄</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-gradient-christmas drop-shadow-lg">
            Christmas Exclusive Offers
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Choose your perfect package and start creating stunning 3D tours
          </p>
        </div>

        {/* Products grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto animate-fade-up pt-10">
          {CHRISTMAS_PRODUCTS.map((product) => {
            const isExpanded = expandedProduct === product.id;

            return (
              <article
                key={product.id}
                itemScope
                itemType="https://schema.org/Product"
                className={`relative rounded-2xl flex flex-col group ${
                  product.featured
                    ? "glass-card-featured border-2 border-christmas-gold/40 shadow-[0_0_40px_rgba(196,30,58,0.3),0_0_80px_rgba(212,168,83,0.2)] hover:shadow-[0_0_60px_rgba(196,30,58,0.4),0_0_100px_rgba(212,168,83,0.3)] hover:border-christmas-gold/60 featured-sparkle cursor-[url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><text x=\"50%\" y=\"50%\" text-anchor=\"middle\" dominant-baseline=\"central\" font-size=\"24\" fill=\"%23ffd700\">✨</text></svg>'),auto]"
                    : "glass-card border border-white/10 hover:border-white/20 premium-shadow hover-starlight"
                }`}
              >
                {/* Featured product badge */}
                {product.featured && (
                  <>
                    {/* Floating Glow effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-christmas-red/20 via-christmas-gold/10 to-christmas-red/20 rounded-3xl blur-2xl -z-10 animate-pulse" />

                    {/* Featured badge with pulse - positioned above card */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div className="relative bg-gradient-to-r from-christmas-red via-[#ea384d] to-christmas-red text-white px-6 py-2 text-sm font-bold rounded-full flex items-center gap-2 shadow-lg shadow-christmas-red/50 pulse-badge">
                        <Icon icon="lucide:sparkles" className="w-4 h-4" />
                        <span className="tracking-widest uppercase">
                          Best Value
                        </span>
                        <Icon icon="lucide:sparkles" className="w-4 h-4" />
                      </div>
                    </div>
                    
                    {/* Sparkle decorations on hover */}
                    <div className="absolute top-4 left-4 z-10 sparkle-icon opacity-0 group-hover:opacity-100 transition-opacity duration-300">✨</div>
                    <div className="absolute top-4 right-4 z-10 sparkle-icon opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">✨</div>
                    <div className="absolute bottom-4 left-4 z-10 sparkle-icon opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">✨</div>
                    <div className="absolute bottom-4 right-4 z-10 sparkle-icon opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">✨</div>
                  </>
                )}

                {/* Product image - fills top of card */}
                <div className="relative bg-black overflow-hidden group rounded-t-2xl">
                  <Image
                    src={product.image}
                    alt={`${product.name} - ${product.subtitle} - Christmas Special Offer`}
                    width={1200}
                    height={900}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="w-full h-auto object-cover"
                    priority={product.featured}
                    itemProp="image"
                  />
                  {/* Offer Badge - 促销角标（活动结束后模糊处理） */}
                  <div
                    className="absolute top-4 right-4 z-10 select-none"
                    style={{
                      filter: "blur(12px)",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                    }}
                  >
                    <div className="relative bg-gradient-to-br from-christmas-red via-christmas-red-light to-christmas-red text-white px-4 py-3 rounded-2xl font-bold shadow-2xl shadow-christmas-red/50 transform rotate-6">
                      <div className="text-center">
                        <div className="text-xs font-semibold uppercase tracking-wider">
                          SAVE
                        </div>
                        <div className="text-2xl font-black leading-none">
                          $????
                        </div>
                      </div>
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-30" />
                    </div>
                  </div>
                </div>

                {/* Card content with padding */}
                <div className="p-6">
                  {/* Product Title & Subtitle */}
                  <div className="mb-4">
                    <h3
                      className="text-2xl sm:text-3xl font-bold text-white mb-2"
                      itemProp="name"
                    >
                      {product.name}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-300">
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Price - 活动结束后模糊处理 */}
                  <div
                    className="mb-6"
                    itemProp="offers"
                    itemScope
                    itemType="https://schema.org/Offer"
                  >
                    <meta itemProp="priceCurrency" content="USD" />
                    <meta
                      itemProp="price"
                      content={product.discountedPrice.toString()}
                    />
                    <meta
                      itemProp="availability"
                      content="https://schema.org/InStock"
                    />
                    <div className="flex items-baseline gap-3">
                      <span
                        className="text-4xl sm:text-5xl font-bold text-gradient-christmas select-none"
                        style={{
                          filter: "blur(12px)",
                          userSelect: "none",
                          WebkitUserSelect: "none",
                        }}
                      >
                        $?,???
                      </span>
                      <span
                        className="text-xl sm:text-2xl text-gray-500 line-through select-none"
                        style={{
                          filter: "blur(12px)",
                          userSelect: "none",
                          WebkitUserSelect: "none",
                        }}
                      >
                        $?,???
                      </span>
                    </div>
                  </div>

                  {/* What's included button - Desktop */}
                  <div className="hidden md:block">
                    <button
                      type="button"
                      onClick={() => {
                        useProductStore.getState().toggleExpand(product.id);
                        trackProductDetailsView(
                          product.id,
                          product.name,
                          isExpanded ? "collapse" : "expand"
                        );
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-gray-100 min-h-[44px] touch-none"
                    >
                      <span className="font-medium">What's Included</span>
                      <Icon
                        icon={
                          isExpanded
                            ? "lucide:chevron-up"
                            : "lucide:chevron-down"
                        }
                        className="w-5 h-5 transition-transform"
                      />
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="mt-4 space-y-4 px-4 py-4 rounded-lg bg-white/5 border border-christmas-red/20">
                        {product.whatsIncluded.map((section) => (
                          <div key={section.title}>
                            <div className="mb-2 flex items-center justify-between">
                              <h4 className="font-semibold text-gray-100">
                                {section.title}
                              </h4>
                              {section.value && (
                                <span className="text-xs text-christmas-ice">
                                  {section.value}
                                </span>
                              )}
                            </div>
                            <ul className="space-y-1">
                              {section.items.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2 text-sm text-gray-300"
                                >
                                  <Icon
                                    icon="lucide:check"
                                    className="w-4 h-4 text-christmas-green mt-0.5 shrink-0"
                                  />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* What's included button - Mobile */}
                  <div className="md:hidden">
                    <button
                      type="button"
                      onClick={() => {
                        useProductStore.getState().showDetails(product.id);
                        trackProductDetailsView(
                          product.id,
                          product.name,
                          "expand"
                        );
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-gray-100 min-h-[44px] touch-none"
                    >
                      <span className="font-medium">What's Included</span>
                      <Icon icon="lucide:info" className="w-5 h-5" />
                    </button>
                  </div>

                  {/* CTA buttons - 活动结束后只保留 Contact Us */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
                    <a
                      href="#contact"
                      title={`Contact us about ${product.name}`}
                      onClick={() =>
                        trackProductContactClick(
                          product.id,
                          product.name,
                          product.discountedPrice
                        )
                      }
                      className="flex-1 btn-christmas-primary flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 min-h-[44px]"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Mobile modal for What's Included */}
      {showMobileDetails && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-[#0a0505]/95 backdrop-blur-lg flex items-end"
          onClick={() => useProductStore.getState().hideDetails()}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              useProductStore.getState().hideDetails();
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-h-[80vh] bg-[#1a0a0a] rounded-t-2xl p-4 sm:p-6 overflow-y-auto border-t border-christmas-red/20"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="document"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-100">
                What's Included
              </h3>
              <button
                type="button"
                onClick={() => useProductStore.getState().hideDetails()}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-none"
              >
                <Icon icon="lucide:x" className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3 sm:space-y-4">
              {CHRISTMAS_PRODUCTS.find(
                (p) => p.id === showMobileDetails
              )?.whatsIncluded.map((section) => (
                <div
                  key={section.title}
                  className="p-3 sm:p-4 rounded-lg bg-white/5 border border-christmas-red/20"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-100">
                      {section.title}
                    </h4>
                    {section.value && (
                      <span className="text-xs text-christmas-ice">
                        {section.value}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs sm:text-sm text-gray-300"
                      >
                        <Icon
                          icon="lucide:check"
                          className="w-3 h-3 sm:w-4 sm:h-4 text-christmas-green mt-0.5 shrink-0"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
