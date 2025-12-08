import type { Product, WithContext } from "schema-dts";
import { buildSEOImageUrl, buildAssetUrl } from "./seo-utils";

/**
 * Organization Schema for Realsee
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Realsee",
    url: "https://realsee.ai",
    logo: buildSEOImageUrl("/assets/brand/realsee-logo.jpeg"),
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
    name: "Realsee Black Friday 2025 Event - Galois 3D LiDAR Camera Sale - Has Ended",
    description:
      "Realsee Black Friday 2025 event has ended. Thank you for your interest. For more information about our products, please contact us.",
    startDate: "2025-11-17T00:00:00-08:00",
    endDate: "2025-12-07T23:59:59-08:00",
    eventStatus: "https://schema.org/EventPostponed",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: "https://black-friday.realsee.ai",
    },
    image: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
    organizer: {
      "@type": "Organization",
      name: "Realsee",
      url: "https://realsee.ai",
    },
    keywords:
      "Realsee Black Friday, Galois Black Friday, 3D LiDAR Camera Sale, Black Friday 2025",
    offers: [
      {
        "@type": "Offer",
        name: "Realsee Galois Premium Bundle - Black Friday Deal",
        price: "4999",
        priceCurrency: "USD",
        availability: "https://schema.org/OutOfStock",
        validFrom: "2025-11-17T00:00:00-08:00",
        priceValidUntil: "2025-12-07T23:59:59-08:00",
        url: "https://black-friday.realsee.ai",
        eligibleRegion: [
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "Canada" },
          { "@type": "Country", name: "United Kingdom" },
          { "@type": "Country", name: "Australia" },
          { "@type": "Country", name: "Germany" },
          { "@type": "Country", name: "France" },
          { "@type": "Country", name: "Japan" },
        ],
      },
      {
        "@type": "Offer",
        name: "Realsee Galois Standard Kit - Black Friday Deal",
        price: "4599",
        priceCurrency: "USD",
        availability: "https://schema.org/OutOfStock",
        validFrom: "2025-11-17T00:00:00-08:00",
        priceValidUntil: "2025-12-07T23:59:59-08:00",
        url: "https://black-friday.realsee.ai",
        eligibleRegion: [
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "Canada" },
          { "@type": "Country", name: "United Kingdom" },
          { "@type": "Country", name: "Australia" },
          { "@type": "Country", name: "Germany" },
          { "@type": "Country", name: "France" },
          { "@type": "Country", name: "Japan" },
        ],
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
    name: "Realsee Galois Premium Bundle - 3D LiDAR Camera - Black Friday 2025",
    description:
      "Realsee Galois Professional 3D LiDAR scanning camera with 134MP true color, pay-as-you-go credits plan, and complete accessories package. Perfect for real estate, architecture, and virtual tours. Black Friday special pricing with worldwide shipping available.",
    image: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
    brand: {
      "@type": "Brand",
      name: "Realsee Galois",
    },
    offers: {
      "@type": "Offer",
      price: "4999",
      priceCurrency: "USD",
      availability: "https://schema.org/OutOfStock",
      priceValidUntil: "2025-12-07T23:59:59-08:00",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Realsee",
      },
      url: "https://black-friday.realsee.ai",
      shippingDetails: [
        {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "0",
            currency: "USD",
          },
          shippingDestination: [
            { "@type": "DefinedRegion", addressCountry: "US" },
            { "@type": "DefinedRegion", addressCountry: "CA" },
            { "@type": "DefinedRegion", addressCountry: "GB" },
            { "@type": "DefinedRegion", addressCountry: "AU" },
            { "@type": "DefinedRegion", addressCountry: "DE" },
            { "@type": "DefinedRegion", addressCountry: "FR" },
            { "@type": "DefinedRegion", addressCountry: "JP" },
          ],
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
              maxValue: 10,
              unitCode: "DAY",
            },
          },
        },
      ],
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
    name: "Realsee Galois Standard Kit - 3D LiDAR Camera - Black Friday 2025",
    description:
      "Realsee Galois Professional 3D LiDAR scanning camera with essential accessories. Ideal for getting started with professional 3D scanning and virtual tour creation. Black Friday special pricing with worldwide shipping available.",
    image: buildSEOImageUrl("/assets/products/galois-standard-kit.jpg"),
    brand: {
      "@type": "Brand",
      name: "Realsee Galois",
    },
    offers: {
      "@type": "Offer",
      price: "4599",
      priceCurrency: "USD",
      availability: "https://schema.org/OutOfStock",
      priceValidUntil: "2025-12-07T23:59:59-08:00",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Realsee",
      },
      url: "https://black-friday.realsee.ai",
      shippingDetails: [
        {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "0",
            currency: "USD",
          },
          shippingDestination: [
            { "@type": "DefinedRegion", addressCountry: "US" },
            { "@type": "DefinedRegion", addressCountry: "CA" },
            { "@type": "DefinedRegion", addressCountry: "GB" },
            { "@type": "DefinedRegion", addressCountry: "AU" },
            { "@type": "DefinedRegion", addressCountry: "DE" },
            { "@type": "DefinedRegion", addressCountry: "FR" },
            { "@type": "DefinedRegion", addressCountry: "JP" },
          ],
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
              maxValue: 10,
              unitCode: "DAY",
            },
          },
        },
      ],
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
        item: "https://black-friday.realsee.ai",
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
    url: "https://black-friday.realsee.ai",
    description:
      "Black Friday Special: Save up to $1,425 on Galois 3D LiDAR Camera. Professional 3D scanning technology for real estate, architecture, and virtual tours.",
    publisher: {
      "@type": "Organization",
      name: "Realsee",
    },
    potentialAction: {
      "@type": "ReadAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://black-friday.realsee.ai#offers",
      },
      "expectsAcceptanceOf": {
        "@type": "Offer",
        price: "4999",
        priceCurrency: "USD",
      },
    },
  };
}

/**
 * FAQ Schema for Black Friday Campaign
 */
export function getFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the Realsee Black Friday 2025 event?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Realsee Black Friday 2025 is a special promotional event offering significant discounts on Galois 3D LiDAR Camera products. Save up to $1,425 on the Premium Bundle ($4,999, regularly $6,424) and get the Standard Kit for $4,599. The event runs from November 17 to December 7, 2025, with worldwide shipping available.",
        },
      },
      {
        "@type": "Question",
        name: "What is included in the Realsee Galois Premium Bundle?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Galois Premium Bundle includes: Galois M2 3D LiDAR Camera, Battery, Extra Battery, Extra Charger, Backpack, Tripod, Lens protector, Quick Release, and 300 Credits for 3D Tour Hosting, 16K Panorama Downloads, RAW Panorama Downloads, OBJ Downloads, and E57 Downloads. Total value at $6,424, Black Friday price $4,999.",
        },
      },
      {
        "@type": "Question",
        name: "Does Realsee offer worldwide shipping?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Realsee offers free worldwide shipping for the Black Friday event. We ship to the United States, Canada, United Kingdom, Australia, Germany, France, Japan, and many other countries. Delivery typically takes 3-10 business days depending on your location.",
        },
      },
      {
        "@type": "Question",
        name: "What currency are the prices in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All prices are in USD (United States Dollars). The Galois Premium Bundle is $4,999 USD and the Standard Kit is $4,599 USD during the Black Friday event.",
        },
      },
      {
        "@type": "Question",
        name: "What is Galois 3D LiDAR Camera?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Galois is Realsee's professional 3D LiDAR scanning camera featuring 134MP true color imaging, 940nm LiDAR precision, one-click indoor and outdoor scanning, and pay-as-you-go credits plan. It's perfect for real estate virtual tours, architecture documentation, and professional 3D scanning projects.",
        },
      },
      {
        "@type": "Question",
        name: "How long is the Realsee Black Friday sale?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Realsee Black Friday 2025 sale runs from November 17, 2025 to December 7, 2025. This limited-time offer includes special pricing on both the Premium Bundle and Standard Kit with worldwide shipping.",
        },
      },
    ],
  };
}

/**
 * VideoObject Schema for product videos
 */
export function getProductVideoSchema(videoData: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: videoData.name,
    description: videoData.description,
    thumbnailUrl: videoData.thumbnailUrl,
    uploadDate: videoData.uploadDate,
    contentUrl: videoData.contentUrl,
    embedUrl: videoData.embedUrl,
    publisher: {
      "@type": "Organization",
      name: "Realsee",
      logo: {
        "@type": "ImageObject",
        url: buildSEOImageUrl("/assets/brand/realsee-logo.jpeg"),
      },
    },
  };
}

/**
 * HowTo Schema for using Galois products
 */
export function getHowToUseGaloisSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Use Realsee Galois 3D LiDAR Camera",
    description:
      "Complete guide on using the Realsee Galois 3D LiDAR Camera for professional 3D scanning and virtual tour creation.",
    image: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
    totalTime: "PT15M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    tool: [
      {
        "@type": "HowToTool",
        name: "Realsee Galois 3D LiDAR Camera",
      },
      {
        "@type": "HowToTool",
        name: "Tripod (included in Premium Bundle)",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Setup and Power On",
        text: "Charge your Galois camera fully. Mount it on the tripod for stable scanning. Power on the device.",
        image: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Position the Camera",
        text: "Place the camera at the center of the space you want to scan. Ensure 360-degree clearance for optimal results.",
        image: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Start Scanning",
        text: "Press the capture button to start scanning. The camera will automatically capture 134MP true color images and LiDAR depth data.",
        image: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Move to Next Position",
        text: "Move the camera to the next scanning position. Repeat the process for complete coverage of your space.",
        image: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Process and Share",
        text: "Upload your scans to the Realsee platform. The system will automatically process and create your 3D virtual tour.",
        image: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
      },
    ],
  };
}

/**
 * Get VideoObject Schemas for product demo videos
 */
export function getProductDemoVideosSchema() {
  const videos = [
    {
      name: "One-Click LiDAR for Indoor & Outdoor Scanning & Co-capture",
      description:
        "Galois rapidly captures complex environments, generating immersive 3D tours with a single click. For large projects, dual-device co-capture ensures maximum efficiency.",
      contentUrl: buildAssetUrl("/videos/one-click-lidar-indoor-outdoor-scanning-co-capture.mp4"),
      thumbnailUrl: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
      uploadDate: "2025-11-01T00:00:00Z",
    },
    {
      name: "LiDAR Precision & 134MP True Color & Ultra Detail",
      description:
        "Galois delivers 134MP Clarity 3D for luxury marketing, powered by a 940nm LiDAR, a 4/3-inch CMOS, and 5-bracket HDR. Showcase superior craftsmanship and finishes to enhance perceived value and command premium pricing for high-end properties.",
      contentUrl: buildAssetUrl("/videos/lidar-precision-134mp-true-color-ultra-detail.mp4"),
      thumbnailUrl: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
      uploadDate: "2025-11-01T00:00:00Z",
    },
    {
      name: "Pay-As-You-Go Credits Plan",
      description:
        "No monthly subscriptions. Only pay to activate. Shoot, edit, upload, and store all your projects for free. Get everything at once: RAW images, 16K panoramas, 3D models, E57 Point cloud, floor plans & CAD from a single scan.",
      contentUrl: buildAssetUrl("/videos/pay-as-you-go-credits-plan.mp4"),
      thumbnailUrl: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
      uploadDate: "2025-11-01T00:00:00Z",
    },
    {
      name: "Rich Editor Features",
      description:
        "Create captivating tours fast with Realsee editor: add multimedia label, screen label, area label, fusion video, AI Camera Removal, logo customization, aerial 3D connection, and automatic floor plans.",
      contentUrl: buildAssetUrl("/videos/rich-editor-features.mp4"),
      thumbnailUrl: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
      uploadDate: "2025-11-01T00:00:00Z",
    },
  ];

  return videos.map((video) => getProductVideoSchema(video));
}

/**
 * Get VideoObject Schemas for YouTube KOL videos
 */
export function getYouTubeKOLVideosSchema() {
  const kolVideos = [
    {
      youtubeId: "2I4Xn85I2Co",
      title: "Galois Review by Arthur R",
      creator: "Arthur R",
    },
    {
      youtubeId: "tJyaBmGIvkY",
      title: "Galois Review by Hugh Hou",
      creator: "Hugh Hou",
    },
    {
      youtubeId: "ox0HgPfWDs8",
      title: "Galois Review by Sparks Media Group",
      creator: "Sparks Media Group",
    },
    {
      youtubeId: "IRWP9hYZsrA",
      title: "Galois Review by The 360 guy",
      creator: "The 360 guy",
    },
    {
      youtubeId: "m0_AcH49dKY",
      title: "Galois Review by Reveal Rabbit",
      creator: "Reveal Rabbit",
    },
    {
      youtubeId: "IWnjwSZraLE",
      title: "Galois Review by Film Sandwich",
      creator: "Film Sandwich",
    },
    {
      youtubeId: "JsB2u-TS-3o",
      title: "Galois Review by Jonathan Shilton",
      creator: "Jonathan Shilton",
    },
    {
      youtubeId: "Vi_lYgBRTBg",
      title: "Galois Review by 戸田覚：ガジェット【辛口】点数評価",
      creator: "戸田覚：ガジェット【辛口】点数評価",
    },
  ];

  return kolVideos.map((video) =>
    getProductVideoSchema({
      name: video.title,
      description: `Professional review of the Realsee Galois 3D LiDAR Camera by ${video.creator}. Learn about features, performance, and real-world usage.`,
      thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
      uploadDate: "2025-11-01T00:00:00Z",
      embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
      contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    }),
  );
}

/**
 * ItemList Schema for product offerings
 * Helps search engines understand the product catalog structure
 */
export function getProductListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Realsee Black Friday 2025 Product Offers",
    description: "Black Friday special offers for Realsee Galois 3D LiDAR Camera products",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "Realsee Galois Premium Bundle - 3D LiDAR Camera",
          description:
            "Realsee Galois Professional 3D LiDAR scanning camera with 134MP true color, pay-as-you-go credits plan, and complete accessories package. Perfect for real estate, architecture, and virtual tours. Black Friday special pricing with worldwide shipping available.",
          url: "https://black-friday.realsee.ai#offers",
          image: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
          offers: {
            "@type": "Offer",
            price: "4999",
            priceCurrency: "USD",
            availability: "https://schema.org/OutOfStock",
            priceValidUntil: "2025-12-07T23:59:59-08:00",
            shippingDetails: [
              {
                "@type": "OfferShippingDetails",
                shippingRate: {
                  "@type": "MonetaryAmount",
                  value: "0",
                  currency: "USD",
                },
                shippingDestination: [
                  { "@type": "DefinedRegion", addressCountry: "US" },
                  { "@type": "DefinedRegion", addressCountry: "CA" },
                  { "@type": "DefinedRegion", addressCountry: "GB" },
                  { "@type": "DefinedRegion", addressCountry: "AU" },
                  { "@type": "DefinedRegion", addressCountry: "DE" },
                  { "@type": "DefinedRegion", addressCountry: "FR" },
                  { "@type": "DefinedRegion", addressCountry: "JP" },
                ],
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
                    maxValue: 10,
                    unitCode: "DAY",
                  },
                },
              },
            ],
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "Realsee Galois Standard Kit - 3D LiDAR Camera",
          description:
            "Realsee Galois Professional 3D LiDAR scanning camera with essential accessories. Ideal for getting started with professional 3D scanning and virtual tour creation. Black Friday special pricing with worldwide shipping available.",
          url: "https://black-friday.realsee.ai#offers",
          image: buildSEOImageUrl("/assets/products/galois-standard-kit.jpg"),
          offers: {
            "@type": "Offer",
            price: "4599",
            priceCurrency: "USD",
            availability: "https://schema.org/OutOfStock",
            priceValidUntil: "2025-12-07T23:59:59-08:00",
            shippingDetails: [
              {
                "@type": "OfferShippingDetails",
                shippingRate: {
                  "@type": "MonetaryAmount",
                  value: "0",
                  currency: "USD",
                },
                shippingDestination: [
                  { "@type": "DefinedRegion", addressCountry: "US" },
                  { "@type": "DefinedRegion", addressCountry: "CA" },
                  { "@type": "DefinedRegion", addressCountry: "GB" },
                  { "@type": "DefinedRegion", addressCountry: "AU" },
                  { "@type": "DefinedRegion", addressCountry: "DE" },
                  { "@type": "DefinedRegion", addressCountry: "FR" },
                  { "@type": "DefinedRegion", addressCountry: "JP" },
                ],
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
                    maxValue: 10,
                    unitCode: "DAY",
                  },
                },
              },
            ],
          },
        },
      },
    ],
  };
}

/**
 * Brand Schema for Realsee Galois
 * Enhanced brand information for better brand recognition
 */
export function getBrandSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: "Realsee Galois",
    description:
      "Realsee Galois is a professional 3D LiDAR scanning camera brand offering cutting-edge technology for real estate, architecture, and virtual tour creation.",
    logo: buildSEOImageUrl("/assets/brand/realsee-logo.jpeg"),
    url: "https://realsee.ai",
    sameAs: [
      "https://twitter.com/REALSEE_Moment",
      "https://www.youtube.com/@realsee3d",
      "https://www.linkedin.com/company/realsee",
    ],
  };
}

/**
 * Review Schema for Galois Products
 * Adds detailed reviews to enhance SEO and rich snippets
 */
export function getProductReviewsSchema() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: {
        "@type": "Product",
        name: "Realsee Galois Premium Bundle - 3D LiDAR Camera",
        description:
          "Realsee Galois Professional 3D LiDAR scanning camera with 134MP true color, pay-as-you-go credits plan, and complete accessories package. Perfect for real estate, architecture, and virtual tours. Black Friday special pricing with worldwide shipping available.",
        image: buildSEOImageUrl("/assets/products/galois-premium-bundle.jpg"),
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
          shippingDetails: [
            {
              "@type": "OfferShippingDetails",
              shippingRate: {
                "@type": "MonetaryAmount",
                value: "0",
                currency: "USD",
              },
              shippingDestination: [
                { "@type": "DefinedRegion", addressCountry: "US" },
                { "@type": "DefinedRegion", addressCountry: "CA" },
                { "@type": "DefinedRegion", addressCountry: "GB" },
                { "@type": "DefinedRegion", addressCountry: "AU" },
                { "@type": "DefinedRegion", addressCountry: "DE" },
                { "@type": "DefinedRegion", addressCountry: "FR" },
                { "@type": "DefinedRegion", addressCountry: "JP" },
              ],
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
                  maxValue: 10,
                  unitCode: "DAY",
                },
              },
            },
          ],
        },
      },
      author: {
        "@type": "Person",
        name: "Professional Photographer",
      },
      datePublished: "2025-10-15",
      reviewBody:
        "The Galois Premium Bundle exceeded my expectations. The 134MP true color imaging and LiDAR precision make it perfect for high-end real estate virtual tours. The pay-as-you-go credits plan is much better than monthly subscriptions.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: {
        "@type": "Product",
        name: "Realsee Galois Standard Kit - 3D LiDAR Camera",
        description:
          "Realsee Galois Professional 3D LiDAR scanning camera with essential accessories. Ideal for getting started with professional 3D scanning and virtual tour creation. Black Friday special pricing with worldwide shipping available.",
        image: buildSEOImageUrl("/assets/products/galois-standard-kit.jpg"),
        brand: {
          "@type": "Brand",
          name: "Realsee Galois",
        },
        offers: {
          "@type": "Offer",
          price: "4599",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2025-12-07T23:59:59-08:00",
          shippingDetails: [
            {
              "@type": "OfferShippingDetails",
              shippingRate: {
                "@type": "MonetaryAmount",
                value: "0",
                currency: "USD",
              },
              shippingDestination: [
                { "@type": "DefinedRegion", addressCountry: "US" },
                { "@type": "DefinedRegion", addressCountry: "CA" },
                { "@type": "DefinedRegion", addressCountry: "GB" },
                { "@type": "DefinedRegion", addressCountry: "AU" },
                { "@type": "DefinedRegion", addressCountry: "DE" },
                { "@type": "DefinedRegion", addressCountry: "FR" },
                { "@type": "DefinedRegion", addressCountry: "JP" },
              ],
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
                  maxValue: 10,
                  unitCode: "DAY",
                },
              },
            },
          ],
        },
      },
      author: {
        "@type": "Person",
        name: "Architecture Professional",
      },
      datePublished: "2025-10-20",
      reviewBody:
        "Excellent entry-level option for professional 3D scanning. The Standard Kit has everything needed to get started. Image quality is outstanding and the workflow is intuitive.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "4.5",
        bestRating: "5",
        worstRating: "1",
      },
    },
  ];
}

/**
 * ContactPage Schema for contact-us page
 */
export function getContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Us - Realsee Black Friday 2025",
    description:
      "Contact Realsee for Black Friday 2025 deals on Galois 3D LiDAR Camera. Get in touch for inquiries, pricing, demos, and more.",
    url: "https://black-friday.realsee.ai/contact-us",
    mainEntity: {
      "@type": "Organization",
      name: "Realsee",
      url: "https://realsee.ai",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        availableLanguage: ["English"],
        areaServed: "Worldwide",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://black-friday.realsee.ai",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact Us",
          item: "https://black-friday.realsee.ai/contact-us",
        },
      ],
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
    getBrandSchema(),
    getEventSchema(),
    getProductListSchema(),
    getPremiumBundleProductSchema(),
    getStandardKitProductSchema(),
    getBreadcrumbSchema(),
    getFAQSchema(),
    getHowToUseGaloisSchema(),
    ...getProductDemoVideosSchema(),
    ...getYouTubeKOLVideosSchema(),
    ...getProductReviewsSchema(),
  ];
}
