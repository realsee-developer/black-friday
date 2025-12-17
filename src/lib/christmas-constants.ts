/**
 * Christmas Promotion Page Constants
 * Dec 17-23, 2025
 */

import type {
  NavTab,
  ProductSKU,
  TourCase,
  KOLVideo,
  GlobalStat,
  ShippingPoint,
} from "./constants";

/**
 * Christmas 导航 Tabs
 */
export const CHRISTMAS_NAV_TABS: NavTab[] = [
  { id: "offers", label: "Christmas Offers", href: "#offers" },
  { id: "showcases", label: "3D Tour Showcases", href: "#showcases" },
  { id: "testimonial", label: "Testimonials", href: "#testimonial" },
  { id: "contact", label: "Contact Us", href: "#contact" },
];

/**
 * Christmas 产品 SKUs
 */
export const CHRISTMAS_PRODUCTS: ProductSKU[] = [
  {
    id: "premium-bundle",
    name: "Galois Premium Bundle",
    subtitle: "Complete Professional Kit",
    description: "Everything you need for professional 3D scanning",
    originalPrice: 6424,
    discountedPrice: 5199,
    discount: 1225,
    discountPercentage: 19,
    featured: true,
    image: "/assets/christmas/products/galois-premium-bundle.jpg",
    buyUrl: "https://home.realsee.ai/en/store-item/1643646673",
    availableFrom: new Date("2025-12-17T00:00:00-05:00"),
    whatsIncluded: [
      {
        title: "Galois Standard Kit",
        items: [
          "Galois M2 3D LiDAR Camera",
          "Battery",
          "Backpack",
          "Tripod",
          "Lens protector",
          "Quick Release",
          "More Accessories",
        ],
        value: "Value at $5499",
      },
      {
        title: "Extra Battery",
        items: ["Extra Battery"],
        value: "Value at $150",
      },
      {
        title: "Extra Charger",
        items: ["Extra Charger"],
        value: "Value at $100",
      },
      {
        title: "300 Credits",
        items: [
          "For 3D Tour Hosting",
          "16K Panorama Downloads",
          "RAW Panorama Downloads",
          "OBJ Downloads",
          "E57 Downloads",
        ],
        value: "Value at $675",
      },
    ],
  },
  {
    id: "standard-kit",
    name: "Galois Standard Kit",
    subtitle: "Essential Scanning Package",
    description: "All the essentials for getting started",
    originalPrice: 5499,
    discountedPrice: 4799,
    discount: 700,
    discountPercentage: 12,
    featured: false,
    image: "/assets/christmas/products/galois-standard-kit.jpg",
    buyUrl: "https://home.realsee.ai/en/store-item/1643646648",
    availableFrom: new Date("2025-12-17T00:00:00-05:00"),
    whatsIncluded: [
      {
        title: "What's Included",
        items: [
          "Galois M2 3D LiDAR Camera",
          "Battery",
          "Backpack",
          "Tripod",
          "Lens protector",
          "Quick Release",
          "More Accessories",
        ],
      },
    ],
  },
];

/**
 * Christmas 3D Tour 案例 (7个)
 */
export const CHRISTMAS_TOUR_CASES: TourCase[] = [
  {
    id: "1",
    title: "Luxury Residential",
    category: "Residential",
    url: "https://realsee.ai/v4OOR4qm",
    image: "/assets/tours/galois-3d-tour-luxury-residential.jpg",
  },
  {
    id: "2",
    title: "Retail Space",
    category: "Retail",
    url: "https://realsee.ai/jmxxR7qV",
    image: "/assets/tours/galois-3d-tour-retail-space.jpg",
  },
  {
    id: "3",
    title: "Restaurant",
    category: "Hospitality",
    url: "https://realsee.ai/Ae44XBBg",
    image: "/assets/tours/galois-3d-tour-restaurant.jpg",
  },
  {
    id: "4",
    title: "Museum",
    category: "Cultural",
    url: "https://realsee.ai/8VRR9e8a",
    image: "/assets/tours/galois-3d-tour-museum.jpg",
  },
  {
    id: "5",
    title: "Aerial 3D",
    category: "Outdoor",
    url: "https://realsee.ai/GjVV2lEO",
    image: "/assets/tours/galois-3d-tour-aerial-outdoor.jpg",
  },
  {
    id: "6",
    title: "Industrial",
    category: "Industrial",
    url: "https://realsee.ai/gL99yxrL",
    image: "/assets/tours/galois-3d-tour-industrial.jpg",
  },
  {
    id: "7",
    title: "Construction",
    category: "Construction",
    url: "https://realsee.ai/p8EEaW6z",
    image: "/assets/tours/galois-3d-tour-construction.jpg",
  },
];

/**
 * Christmas KOL 视频 (11个)
 */
export const CHRISTMAS_KOL_VIDEOS: KOLVideo[] = [
  {
    id: "1",
    youtubeId: "keucTdCxTmI",
    title: "Galois Review by TD Vision U",
    creator: "TD Vision U",
  },
  {
    id: "2",
    youtubeId: "7O7uNd4Nkl8",
    title: "Galois Review by PhotoJeseph",
    creator: "PhotoJeseph",
  },
  {
    id: "3",
    youtubeId: "guyQduQ73Qc",
    title: "Galois Review by Sergio Barata",
    creator: "Sergio Barata",
  },
  {
    id: "4",
    youtubeId: "2I4Xn85I2Co",
    title: "Galois Review by Arthur R",
    creator: "Arthur R",
  },
  {
    id: "5",
    youtubeId: "tJyaBmGIvkY",
    title: "Galois Review by Hugh Hou",
    creator: "Hugh Hou",
  },
  {
    id: "6",
    youtubeId: "ox0HgPfWDs8",
    title: "Galois Review by Sparks Media Group",
    creator: "Sparks Media Group",
  },
  {
    id: "7",
    youtubeId: "IRWP9hYZsrA",
    title: "Galois Review by The 360 guy",
    creator: "The 360 guy",
  },
  {
    id: "8",
    youtubeId: "m0_AcH49dKY",
    title: "Galois Review by Reveal Rabbit",
    creator: "Reveal Rabbit",
  },
  {
    id: "9",
    youtubeId: "IWnjwSZraLE",
    title: "Galois Review by Film Sandwich",
    creator: "Film Sandwich",
  },
  {
    id: "10",
    youtubeId: "JsB2u-TS-3o",
    title: "Galois Review by Jonathan Shilton",
    creator: "Jonathan Shilton",
  },
  {
    id: "11",
    youtubeId: "Vi_lYgBRTBg",
    title: "Galois Review by 戸田覚",
    creator: "戸田覚",
  },
];

/**
 * Christmas 全球统计
 */
export const CHRISTMAS_GLOBAL_STATS: GlobalStat[] = [
  { label: "Countries", value: 50, suffix: "+", icon: "🌍" },
  { label: "Spaces Scanned", value: 50000000, suffix: "", icon: "📸" },
  { label: "Partnership Companies", value: 3000, suffix: "+", icon: "🤝" },
  { label: "Patents", value: 600, suffix: "+", icon: "💡" },
];

/**
 * Christmas 收货说明
 */
export const CHRISTMAS_SHIPPING_POINTS: ShippingPoint[] = [
  {
    title: "Data Security",
    icon: "/assets/christmas/shipping/data-security.png",
    description:
      "Your data is securely stored on AWS, the world's leading cloud platform. Rest assured, your information is protected with top-tier encryption and compliance standards.",
  },
  {
    title: "1-on-1 Support",
    icon: "/assets/christmas/shipping/support.png",
    description:
      "Skip the bots. Get personalized assistance from our expert team. From questions to solutions, we're with you every step.",
  },
  {
    title: "Global Delivery",
    icon: "/assets/christmas/shipping/delivery.png",
    description:
      "Shop anywhere, ship everywhere—for free. Fast, reliable delivery to your doorstep, no hidden costs.",
  },
  {
    title: "1-Year Warranty",
    icon: "/assets/christmas/shipping/warranty.png",
    description:
      "Shop with confidence. Enjoy full hardware product protection for a year after purchase, with easy claim processing.",
  },
];

/**
 * Christmas Hero Section 配置
 */
export const CHRISTMAS_HERO_CONFIG = {
  title: "Galois 3D LiDAR Camera Christmas Promotion",
  subtitle: "Dec 17th - Dec 23rd, 2025 | Worldwide Shipping",
  description: "Experience professional 3D scanning with up to $1225 OFF",
  backgroundImages: {
    pc: "/assets/christmas/hero/banner-pc.jpg",
    pad: "/assets/christmas/hero/banner-pad.jpg",
    mobile: "/assets/christmas/hero/banner-mobile.jpg",
  },
  ctaButtons: [
    { label: "Shop Now", href: "#offers", primary: true },
    { label: "Contact Us", href: "#contact", primary: false },
  ],
};

/**
 * Christmas 主题色配置
 */
export const CHRISTMAS_THEME = {
  primary: "#C41E3A", // Christmas Red - 主题色
  primaryDark: "#8B0000", // Dark Red
  primaryLight: "#DC143C", // Crimson
  accent: "#165B33", // Christmas Green - 点缀色 (use sparingly!)
  accentLight: "#22863a", // Forest Green
  gold: "#D4A853", // Antique Gold - 装饰色
  goldLight: "#FFD700", // Bright Gold
  snow: "#FFFFFF", // Snow White
  bgDark: "#0a0505", // Deep Black-Red background
  bg: "#1a0a0a", // Dark Red-Brown background
} as const;

/**
 * Christmas 促销日期配置
 */
export const CHRISTMAS_PROMO_DATES = {
  start: new Date("2025-12-17T00:00:00-05:00"),
  end: new Date("2025-12-23T23:59:59-05:00"),
} as const;
