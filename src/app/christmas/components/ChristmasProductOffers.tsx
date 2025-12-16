"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { CHRISTMAS_PRODUCTS } from "@/lib/christmas-constants";
import { useProductStore } from "@/store/useProductStore";
import {
  trackProductContactClick,
  trackProductBuyClick,
  trackProductDetailsView,
  trackFacebookInitiateCheckout,
} from "@/lib/analytics/gtm";
import { CURRENCY_USD } from "@/lib/analytics-constants";

export function ChristmasProductOffers() {
  const expandedProduct = useProductStore((state) => state.expandedProduct);
  const showMobileDetails = useProductStore((state) => state.showMobileDetails);

  return (
    <section
      id="offers"
      aria-label="Christmas Product Offers"
      className="relative overflow-hidden bg-linear-to-b from-[#061818] via-[#082a2a] to-[#061818] py-12 sm:py-16 md:py-20 lg:py-28"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="christmas-grid absolute inset-0 opacity-5" />
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-christmas-teal/20 blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-christmas-gold/15 blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-christmas-teal/30 border border-christmas-gold/30">
            <span className="text-2xl">🎅</span>
            <span className="text-christmas-gold font-semibold">
              Limited Time Offer
            </span>
            <span className="text-2xl">🎄</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-3 sm:mb-4">
            Christmas Exclusive Offers
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Choose your perfect package and start creating stunning 3D tours
          </p>
        </div>

        {/* Products grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {CHRISTMAS_PRODUCTS.map((product) => {
            const isExpanded = expandedProduct === product.id;

            return (
              <article
                key={product.id}
                itemScope
                itemType="https://schema.org/Product"
                className={`relative bg-gradient-to-b from-[#0d3d3d] to-[#061818] rounded-2xl border border-christmas-teal-light/30 p-4 sm:p-6 md:p-8 flex flex-col transition-all duration-300 ${
                  product.featured
                    ? "ring-4 ring-christmas-gold shadow-[0_0_40px_rgba(212,168,83,0.4)]"
                    : ""
                }`}
              >
                {/* Featured product badge */}
                {product.featured && (
                  <>
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-christmas-gold/30 via-christmas-red/20 to-christmas-gold/30 rounded-2xl blur-xl -z-10 animate-pulse" />

                    {/* Featured badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="relative bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-red text-white px-5 py-1.5 text-sm font-bold rounded-full flex items-center gap-2 shadow-lg shadow-christmas-red/50">
                        <Icon
                          icon="lucide:star"
                          className="w-4 h-4 fill-current"
                        />
                        <span className="tracking-wider">BEST VALUE</span>
                        <Icon
                          icon="lucide:star"
                          className="w-4 h-4 fill-current"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Product image */}
                <div className="relative -mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8 mb-4 sm:mb-6 overflow-hidden rounded-t-lg bg-[#0a0505]">
                  <Image
                    src={product.image}
                    alt={`${product.name} - ${product.subtitle} - Christmas Special Offer`}
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
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100 mb-1 sm:mb-2"
                      itemProp="name"
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-sm sm:text-base text-gray-400"
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
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-christmas-red">
                        ${product.discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-lg sm:text-xl text-gray-500 line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-christmas-red/20 border border-christmas-red/30">
                      <Icon
                        icon="lucide:tag"
                        className="w-3 h-3 sm:w-4 sm:h-4 text-christmas-gold"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-christmas-gold">
                        Save ${product.discount.toLocaleString()} (
                        {product.discountPercentage}% OFF)
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
                                <span className="text-xs text-christmas-gold">
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

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <a
                      href={product.buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackProductBuyClick(
                          product.id,
                          product.name,
                          product.discountedPrice,
                          product.buyUrl
                        );
                        trackFacebookInitiateCheckout(
                          product.name,
                          [product.id],
                          product.discountedPrice,
                          CURRENCY_USD
                        );
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-christmas-red to-christmas-red-dark text-white shadow-lg shadow-christmas-red/30 hover:shadow-xl hover:shadow-christmas-red/50 min-h-[44px] touch-none"
                    >
                      <Icon icon="lucide:shopping-cart" className="w-5 h-5" />
                      Buy Now
                    </a>
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
                      className="flex-1 flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105 bg-white/10 text-white border border-christmas-gold/30 hover:bg-white/20 min-h-[44px] touch-none"
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
                      <span className="text-xs text-christmas-gold">
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
