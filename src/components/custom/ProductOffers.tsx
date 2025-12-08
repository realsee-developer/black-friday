"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { PRODUCTS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { useProductStore } from "@/store/useProductStore";
import {
  trackProductContactClick,
  trackProductBuyClick,
  trackProductDetailsView,
  trackFacebookInitiateCheckout,
} from "@/lib/analytics/gtm";
import { CURRENCY_USD } from "@/lib/analytics-constants";

export function ProductOffers() {
  // ✅ 使用 selector 只订阅需要渲染的状态
  const expandedProduct = useProductStore((state) => state.expandedProduct);
  const showMobileDetails = useProductStore((state) => state.showMobileDetails);

  return (
    <section
      id="offers"
      aria-label="Black Friday Product Offers"
      className="relative overflow-hidden bg-linear-to-b from-cyber-gray-800 via-cyber-gray-900 to-cyber-gray-900 py-12 sm:py-16 md:py-20 lg:py-28"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-cyber-brand-500/15 blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-cyber-neon-cyan/10 blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyber-gray-100 mb-3 sm:mb-4">
            Black Friday Exclusive Offers
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
            Choose your perfect package and start creating stunning 3D tours
          </p>
        </div>

        {/* Products grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {PRODUCTS.map((product) => {
            const isExpanded = expandedProduct === product.id;

            return (
              <article
                key={product.id}
                itemScope
                itemType="https://schema.org/Product"
                className={`relative cyber-card-neon p-4 sm:p-6 md:p-8 flex flex-col transition-all duration-300 ${
                  product.featured
                    ? "ring-4 ring-cyber-brand-500 shadow-[0_0_40px_rgba(51,102,255,0.4)]"
                    : ""
                }`}
              >
                {/* Featured product enhanced effects */}
                {product.featured && (
                  <>
                    {/* Cyberpunk neon scanning light effect - 左上到右下对角线扫光 */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
                      <div
                        className="absolute -inset-[100%]"
                        style={{
                          background:
                            "linear-gradient(135deg, transparent 30%, rgba(51,102,255,0.3) 45%, rgba(0,255,255,0.6) 50%, rgba(51,102,255,0.3) 55%, transparent 70%)",
                          transform: "translate(-100%, -100%)",
                          animation:
                            "cyberpunk-diagonal-scan 3s ease-in-out infinite",
                          mixBlendMode: "screen",
                        }}
                      />
                    </div>
                    {/* Enhanced background glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyber-brand-500/30 via-cyber-neon-cyan/20 to-cyber-brand-500/30 rounded-xl blur-xl -z-10 animate-pulse" />

                    {/* Featured badge with cyberpunk neon effects */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="relative cyber-recommended-badge">
                        {/* Multi-layer glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyber-brand-500 via-cyber-neon-cyan to-cyber-brand-500 blur-2xl opacity-80 rounded-full animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyber-brand-500 via-cyber-neon-cyan to-cyber-brand-500 blur-lg opacity-60 rounded-full" />

                        {/* Badge container with scanning light */}
                        <div className="relative overflow-hidden rounded-full">
                          {/* Badge background with gradient animation */}
                          <div
                            className="relative bg-gradient-to-r from-cyber-brand-500 via-cyber-neon-cyan to-cyber-brand-500 text-white px-5 py-1.5 text-sm font-bold flex items-center gap-2"
                            style={{
                              backgroundSize: "200% 100%",
                              animation:
                                "neon-gradient-shift 3s ease-in-out infinite",
                              boxShadow:
                                "0 0 20px rgba(51,102,255,0.8), 0 0 40px rgba(0,255,255,0.6), 0 0 60px rgba(51,102,255,0.4), inset 0 0 10px rgba(255,255,255,0.3)",
                            }}
                          >
                            <Icon
                              icon="lucide:star"
                              className="w-4 h-4 fill-current animate-pulse"
                              style={{
                                filter:
                                  "drop-shadow(0 0 4px rgba(255,255,255,0.8))",
                              }}
                            />
                            <span
                              className="tracking-wider cyber-neon-text-strong"
                              style={{
                                textShadow:
                                  "0 0 10px rgba(255,255,255,1), 0 0 20px rgba(0,255,255,0.8), 0 0 30px rgba(51,102,255,0.6), 0 0 40px rgba(0,255,255,0.4)",
                              }}
                            >
                              RECOMMENDED
                            </span>
                            <Icon
                              icon="lucide:star"
                              className="w-4 h-4 fill-current animate-pulse"
                              style={{
                                filter:
                                  "drop-shadow(0 0 4px rgba(255,255,255,0.8))",
                              }}
                            />
                          </div>

                          {/* Scanning light overlay */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
                              animation: "neon-scan 2s linear infinite",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Product image */}
                <div className="relative -mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8 mb-4 sm:mb-6 overflow-hidden rounded-t-lg bg-cyber-gray-800/50">
                  <Image
                    src={product.image}
                    alt={`${product.name} - ${product.subtitle} - Black Friday Special Offer - Realsee Galois 3D LiDAR Camera`}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-auto object-cover"
                    priority={product.featured}
                    itemProp="image"
                  />
                </div>

                {/* Product info */}
                <div className="flex-1 space-y-3 sm:space-y-4">
                  <div>
                    <h3
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-cyber-gray-100 mb-1 sm:mb-2"
                      itemProp="name"
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-sm sm:text-base text-cyber-gray-400"
                      itemProp="description"
                    >
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div
                    className="space-y-2"
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
                    <div className="flex items-baseline gap-2 sm:gap-3">
                      <span
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyber-brand-500 select-none"
                        style={{
                          filter: "blur(8px)",
                          userSelect: "none",
                          WebkitUserSelect: "none"
                        }}
                      >
                        {product.id === 'premium-bundle' ? '$4,999' : '$4,599'}
                      </span>
                      <span
                        className="text-lg sm:text-xl text-cyber-gray-500 line-through select-none"
                        style={{
                          filter: "blur(8px)",
                          userSelect: "none",
                          WebkitUserSelect: "none"
                        }}
                      >
                        {product.id === 'premium-bundle' ? '$6,424' : '$5,499'}
                      </span>
                    </div>
                    <div
                      className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-linear-to-r from-cyber-brand-500/20 to-cyber-neon-cyan/20 border border-cyber-brand-500/30 select-none"
                      style={{
                        filter: "blur(8px)",
                        userSelect: "none",
                        WebkitUserSelect: "none"
                      }}
                    >
                      <Icon
                        icon="lucide:tag"
                        className="w-3 h-3 sm:w-4 sm:h-4 text-cyber-brand-500"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-cyber-brand-500">
                        {product.id === 'premium-bundle' ? 'Save $1,425 (22% OFF)' : 'Save $900 (16% OFF)'}
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
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-cyber-gray-300 hover:text-cyber-gray-100 min-h-[44px] touch-none"
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
                      <div className="mt-4 space-y-4 px-4 py-4 rounded-lg bg-white/5 border border-cyber-brand-500/20">
                        {product.whatsIncluded.map((section) => (
                          <div key={section.title}>
                            <div className="mb-2">
                              <h4 className="font-semibold text-cyber-gray-100">
                                {section.title}
                              </h4>
                            </div>
                            <ul className="space-y-1">
                              {section.items.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2 text-sm text-cyber-gray-300"
                                >
                                  <Icon
                                    icon="lucide:check"
                                    className="w-4 h-4 text-cyber-brand-500 mt-0.5 shrink-0"
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
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-cyber-gray-300 hover:text-cyber-gray-100 min-h-[44px] touch-none"
                    >
                      <span className="font-medium">What's Included</span>
                      <Icon icon="lucide:info" className="w-5 h-5" />
                    </button>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                      className="flex-1 flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105 cyber-btn-secondary min-h-[44px] touch-none"
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
          className="md:hidden fixed inset-0 z-50 bg-cyber-gray-900/95 backdrop-blur-lg flex items-end"
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
            className="w-full max-h-[80vh] bg-cyber-gray-800 rounded-t-2xl p-4 sm:p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="document"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-cyber-gray-100">
                What's Included
              </h3>
              <button
                type="button"
                onClick={() => useProductStore.getState().hideDetails()}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-none"
              >
                <Icon icon="lucide:x" className="w-6 h-6 text-cyber-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3 sm:space-y-4">
              {PRODUCTS.find(
                (p) => p.id === showMobileDetails
              )?.whatsIncluded.map((section) => (
                <div
                  key={section.title}
                  className="p-3 sm:p-4 rounded-lg bg-white/5 border border-cyber-brand-500/20"
                >
                  <div className="mb-2">
                    <h4 className="text-sm sm:text-base font-semibold text-cyber-gray-100">
                      {section.title}
                    </h4>
                  </div>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs sm:text-sm text-cyber-gray-300"
                      >
                        <Icon
                          icon="lucide:check"
                          className="w-3 h-3 sm:w-4 sm:h-4 text-cyber-brand-500 mt-0.5 shrink-0"
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
