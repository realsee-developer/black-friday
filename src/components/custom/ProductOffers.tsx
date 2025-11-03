"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PRODUCTS } from "@/lib/constants";
import { getButtonText } from "@/lib/time";
import { formatPrice } from "@/lib/utils";

export function ProductOffers() {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [showMobileDetails, setShowMobileDetails] = useState<string | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);

  // 避免水合错误：只在客户端挂载后计算时间相关的内容
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleExpand = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const showDetails = (productId: string) => {
    setShowMobileDetails(productId);
  };

  const hideDetails = () => {
    setShowMobileDetails(null);
  };

  return (
    <section
      id="offers"
      aria-label="Black Friday Product Offers"
      className="relative overflow-hidden bg-gradient-to-b from-cyber-gray-800 via-cyber-gray-900 to-cyber-gray-900 py-20 sm:py-28"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-cyber-brand-500/15 blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-cyber-neon-cyan/10 blur-[140px]" />
      </div>

      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-gray-100 mb-4">
            Black Friday Exclusive Offers
          </h2>
          <p className="text-lg sm:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
            Choose your perfect package and start creating stunning 3D tours
          </p>
        </div>

        {/* Products grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {PRODUCTS.map((product) => {
            const isExpanded = expandedProduct === product.id;
            // 服务器端渲染时使用默认值，避免水合错误
            const buttonText = mounted ? getButtonText(product.availableFrom) : "Contact Us";

            return (
              <article
                key={product.id}
                itemScope
                itemType="https://schema.org/Product"
                className={`relative cyber-card-neon p-6 sm:p-8 flex flex-col transition-all duration-300 ${
                  product.featured
                    ? "ring-2 ring-cyber-brand-500 shadow-[0_0_30px_rgba(51,102,255,0.3)]"
                    : ""
                }`}
              >
                {/* Featured badge */}
                {product.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyber-brand-500 to-cyber-neon-cyan blur-md opacity-60 rounded-full" />
                      {/* Badge */}
                      <div className="relative bg-gradient-to-r from-cyber-brand-500 via-cyber-brand-400 to-cyber-neon-cyan text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 animate-pulse-slow">
                        <Icon icon="lucide:star" className="w-4 h-4 fill-current" />
                        <span>RECOMMENDED</span>
                        <Icon icon="lucide:star" className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Product image */}
                <div className="relative -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 overflow-hidden rounded-t-lg bg-cyber-gray-800/50">
                  <Image
                    src={product.image}
                    alt={`${product.name} - ${product.subtitle} - Black Friday Special Offer`}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-auto object-cover"
                    priority={product.featured}
                    itemProp="image"
                  />
                </div>

                {/* Product info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-cyber-gray-100 mb-2" itemProp="name">
                      {product.name}
                    </h3>
                    <p className="text-cyber-gray-400" itemProp="description">{product.subtitle}</p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <meta itemProp="priceCurrency" content="USD" />
                    <meta itemProp="price" content={product.discountedPrice.toString()} />
                    <meta itemProp="availability" content="https://schema.org/InStock" />
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-bold text-cyber-brand-500">
                        {formatPrice(product.discountedPrice)}
                      </span>
                      <span className="text-xl text-cyber-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyber-brand-500/20 to-cyber-neon-cyan/20 border border-cyber-brand-500/30">
                      <Icon
                        icon="lucide:tag"
                        className="w-4 h-4 text-cyber-brand-500"
                      />
                      <span className="text-sm font-semibold text-cyber-brand-500">
                        Save {formatPrice(product.discount)} (
                        {product.discountPercentage}% OFF)
                      </span>
                    </div>
                  </div>

                  {/* What's included button - Desktop */}
                  <div className="hidden md:block">
                    <button
                      onClick={() => toggleExpand(product.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-cyber-gray-300 hover:text-cyber-gray-100"
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
                        {product.whatsIncluded.map((section, idx) => (
                          <div key={idx}>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-cyber-gray-100">
                                {section.title}
                              </h4>
                              {section.value && (
                                <span className="text-sm text-cyber-brand-500">
                                  {section.value}
                                </span>
                              )}
                            </div>
                            <ul className="space-y-1">
                              {section.items.map((item, itemIdx) => (
                                <li
                                  key={itemIdx}
                                  className="flex items-start gap-2 text-sm text-cyber-gray-300"
                                >
                                  <Icon
                                    icon="lucide:check"
                                    className="w-4 h-4 text-cyber-brand-500 mt-0.5 flex-shrink-0"
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
                      onClick={() => showDetails(product.id)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-cyber-gray-300 hover:text-cyber-gray-100"
                    >
                      <span className="font-medium">What's Included</span>
                      <Icon icon="lucide:info" className="w-5 h-5" />
                    </button>
                  </div>

                  {/* CTA button */}
                  <a
                    href={
                      buttonText === "Buy Now" ? product.buyUrl : "#contact"
                    }
                    target={buttonText === "Buy Now" ? "_blank" : undefined}
                    rel={
                      buttonText === "Buy Now"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`flex items-center justify-center w-full text-center px-10 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 hover:scale-105 ${
                      product.featured
                        ? "cyber-btn-primary"
                        : "cyber-btn-secondary"
                    }`}
                  >
                    {buttonText}
                  </a>
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
          onClick={hideDetails}
        >
          <div
            className="w-full max-h-[80vh] bg-cyber-gray-800 rounded-t-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-cyber-gray-100">
                What's Included
              </h3>
              <button
                onClick={hideDetails}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Icon icon="lucide:x" className="w-6 h-6 text-cyber-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {PRODUCTS.find(
                (p) => p.id === showMobileDetails,
              )?.whatsIncluded.map((section, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white/5 border border-cyber-brand-500/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-cyber-gray-100">
                      {section.title}
                    </h4>
                    {section.value && (
                      <span className="text-sm text-cyber-brand-500">
                        {section.value}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1">
                    {section.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2 text-sm text-cyber-gray-300"
                      >
                        <Icon
                          icon="lucide:check"
                          className="w-4 h-4 text-cyber-brand-500 mt-0.5 flex-shrink-0"
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
