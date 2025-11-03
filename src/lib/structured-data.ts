import type { Product, WithContext } from "schema-dts";

/**
 * Organization Schema for Realsee
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Realsee",
    url: "https://realsee.ai",
    logo: "https://blackfriday.realsee.ai/assets/brand/realsee-logo.jpeg",
    description:
      "Realsee provides professional 3D scanning and virtual tour solutions with cutting-edge LiDAR technology.",
    sameAs: [
      "https://twitter.com/REALSEE_Moment",
      "https://www.youtube.com/@realsee3d",
      "https://www.linkedin.com/company/realsee",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English"],
    },
  };
}

/**
 * Event Schema for Black Friday Campaign
 */
export function getEventSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Realsee Black Friday Event - Galois 3D LiDAR Camera",
    description:
      "Black Friday Special: Save up to $1,425 on Galois 3D LiDAR Camera. Premium Bundle $4,999 (reg. $6,424). Limited time offer Nov 17 - Dec 7, 2025.",
    startDate: "2025-11-17T00:00:00-08:00",
    endDate: "2025-12-07T23:59:59-08:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: "https://blackfriday.realsee.ai",
    },
    image: "https://blackfriday.realsee.ai/assets/products/galois-premium-bundle.jpg",
    organizer: {
      "@type": "Organization",
      name: "Realsee",
      url: "https://realsee.ai",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Galois Premium Bundle",
        price: "4999",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        validFrom: "2025-11-17T00:00:00-08:00",
        priceValidUntil: "2025-12-07T23:59:59-08:00",
        url: "https://blackfriday.realsee.ai#offers",
      },
      {
        "@type": "Offer",
        name: "Galois Standard Kit",
        price: "3999",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        validFrom: "2025-11-23T00:00:00-08:00",
        priceValidUntil: "2025-12-07T23:59:59-08:00",
        url: "https://blackfriday.realsee.ai#offers",
      },
    ],
  };
}

/**
 * Product Schema for Galois Premium Bundle
 */
export function getPremiumBundleProductSchema(): WithContext<Product> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Galois Premium Bundle - 3D LiDAR Camera",
    description:
      "Professional 3D LiDAR scanning camera with 134MP true color, pay-as-you-go credits plan, and complete accessories package. Perfect for real estate, architecture, and virtual tours.",
    image: "https://blackfriday.realsee.ai/assets/products/galois-premium-bundle.jpg",
    brand: {
      "@type": "Brand",
      name: "Realsee Galois",
    },
    offers: {
      "@type": "Offer",
      price: "4999",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2025-12-07T23:59:59-08:00",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Realsee",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    category: "3D Scanning Equipment",
    sku: "GALOIS-PREMIUM-BF2025",
    mpn: "GALOIS-PREMIUM",
  };
}

/**
 * Product Schema for Galois Standard Kit
 */
export function getStandardKitProductSchema(): WithContext<Product> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Galois Standard Kit - 3D LiDAR Camera",
    description:
      "Professional 3D LiDAR scanning camera with essential accessories. Ideal for getting started with professional 3D scanning and virtual tour creation.",
    image: "https://blackfriday.realsee.ai/assets/products/galois-standard-kit.jpg",
    brand: {
      "@type": "Brand",
      name: "Realsee Galois",
    },
    offers: {
      "@type": "Offer",
      price: "3999",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
      availabilityStarts: "2025-11-23T00:00:00-08:00",
      priceValidUntil: "2025-12-07T23:59:59-08:00",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Realsee",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "89",
      bestRating: "5",
      worstRating: "1",
    },
    category: "3D Scanning Equipment",
    sku: "GALOIS-STANDARD-BF2025",
    mpn: "GALOIS-STANDARD",
  };
}

/**
 * BreadcrumbList Schema
 */
export function getBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://realsee.ai",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Black Friday Event",
        item: "https://blackfriday.realsee.ai",
      },
    ],
  };
}

/**
 * WebSite Schema with SearchAction
 */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Realsee Black Friday Event",
    url: "https://blackfriday.realsee.ai",
    description:
      "Black Friday Special: Save up to $1,425 on Galois 3D LiDAR Camera. Professional 3D scanning technology for real estate, architecture, and virtual tours.",
    publisher: {
      "@type": "Organization",
      name: "Realsee",
    },
  };
}

/**
 * Get all structured data as a combined array
 */
export function getAllStructuredData() {
  return [
    getOrganizationSchema(),
    getWebsiteSchema(),
    getEventSchema(),
    getPremiumBundleProductSchema(),
    getStandardKitProductSchema(),
    getBreadcrumbSchema(),
  ];
}

