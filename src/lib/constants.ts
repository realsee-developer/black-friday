/**
 * 导航 Tabs
 */
export interface NavTab {
  id: string;
  label: string;
  href: string;
}

export const NAV_TABS: NavTab[] = [
  { id: "offers", label: "Black Friday Offers", href: "#offers" },
  { id: "showcases", label: "3D Tour Showcases", href: "#showcases" },
  { id: "about", label: "About Galois", href: "#about" },
  { id: "testimonial", label: "Testimonial", href: "#testimonial" },
  { id: "contact", label: "Contact Us", href: "#contact" },
];

/**
 * 产品相关类型
 */
export interface IncludedItem {
  title: string;
  items: string[];
  value?: string;
}

export interface ProductSKU {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  discountPercentage: number;
  featured: boolean;
  image: string;
  buyUrl: string;
  whatsIncluded: IncludedItem[];
  availableFrom: Date;
}

/**
 * 产品 SKUs
 */
export const PRODUCTS: ProductSKU[] = [
  {
    id: "premium-bundle",
    name: "Galois Premium Bundle",
    subtitle: "Complete Professional Kit",
    description: "Everything you need for professional 3D scanning",
    originalPrice: 6424,
    discountedPrice: 4999,
    discount: 1425,
    discountPercentage: 22,
    featured: true,
    image: "/assets/products/galois-premium-bundle.jpg",
    buyUrl: "https://home.realsee.ai/en/store-item/1643646673",
    availableFrom: new Date("2025-11-03T00:00:00-05:00"),
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
        value: "Value at $625",
      },
    ],
  },
  {
    id: "standard-kit",
    name: "Galois Standard Kit",
    subtitle: "Essential Scanning Package",
    description: "All the essentials for getting started",
    originalPrice: 5499,
    discountedPrice: 4599,
    discount: 900,
    discountPercentage: 16,
    featured: false,
    image: "/assets/products/galois-standard-kit.jpg",
    buyUrl: "https://home.realsee.ai/en/store-item/1643646648",
    availableFrom: new Date("2025-11-03T00:00:00-05:00"),
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
 * 第三方零售伙伴
 */
export interface RetailPartner {
  id: string;
  name: string;
  heroImage: string;
  url: string;
  themeColor: {
    from: string;
    to: string;
    hover: string;
    shadow: string;
  };
}

export const RETAIL_PARTNERS: RetailPartner[] = [
  {
    id: "bh",
    name: "B&H",
    heroImage: "/assets/partners/b&h.jpg",
    url: "https://www.bhphotovideo.com/c/product/1791796-REG/realsee_technology_rs41010_galois_m2_3d_lidar.html",
    themeColor: {
      from: "#DC143C",
      to: "#B71C1C",
      hover: "#FF1744",
      shadow: "220, 20, 60",
    },
  },
  {
    id: "adorama",
    name: "Adorama",
    heroImage: "/assets/partners/adorama.jpg",
    url: "https://www.adorama.com/rlrs41025.html",
    themeColor: {
      from: "#FDB813",
      to: "#F57C00",
      hover: "#FFD54F",
      shadow: "253, 184, 19",
    },
  },
  {
    id: "robotshop",
    name: "RobotShop",
    heroImage: "/assets/partners/robotshop.jpg",
    url: "https://www.robotshop.com/products/realsee-technology-galois-m2-3d-lidar-camera-kit-us",
    themeColor: {
      from: "#00A0E3",
      to: "#0277BD",
      hover: "#29B6F6",
      shadow: "0, 160, 227",
    },
  },
];

/**
 * 3D Tour 案例
 */
export interface TourCase {
  id: string;
  title: string;
  category: string;
  url: string;
  image: string;
}

export const TOUR_CASES: TourCase[] = [
  {
    id: "1",
    title: "Luxury Residential",
    category: "Residential",
    url: "https://realsee.ai/v4OOR4qm",
    image: "/assets/tours/v4OOR4qm.jpg",
  },
  {
    id: "2",
    title: "Retail Space",
    category: "Retail",
    url: "https://realsee.ai/jmxxR7qV",
    image: "/assets/tours/jmxxR7qV.jpg",
  },
  {
    id: "3",
    title: "Restaurant",
    category: "Hospitality",
    url: "https://realsee.ai/Ae44XBBg",
    image: "/assets/tours/Ae44XBBg.jpg",
  },
  {
    id: "4",
    title: "Museum",
    category: "Cultural",
    url: "https://realsee.ai/8VRR9e8a",
    image: "/assets/tours/8VRR9e8a.jpg",
  },
  {
    id: "5",
    title: "Aerial 3D",
    category: "Outdoor",
    url: "https://realsee.ai/GjVV2lEO",
    image: "/assets/tours/GjVV2lEO.jpg",
  },
  {
    id: "6",
    title: "Industrial",
    category: "Industrial",
    url: "https://realsee.ai/gL99yxrL",
    image: "/assets/tours/gL99yxrL.jpg",
  },
  {
    id: "7",
    title: "Construction",
    category: "Construction",
    url: "https://realsee.ai/p8EEaW6z",
    image: "/assets/tours/p8EEaW6z.jpg",
  },
];

/**
 * KOL 视频
 */
export interface KOLVideo {
  id: string;
  youtubeId: string;
  title: string;
  creator: string;
}

export const KOL_VIDEOS: KOLVideo[] = [
  {
    id: "1",
    youtubeId: "2I4Xn85I2Co",
    title: "Galois Review by Arthur",
    creator: "Arthur",
  },
  {
    id: "2",
    youtubeId: "tJyaBmGIvkY",
    title: "Galois Review by Hugh",
    creator: "Hugh",
  },
  {
    id: "3",
    youtubeId: "ox0HgPfWDs8",
    title: "Galois Review by Sparks",
    creator: "Sparks",
  },
  {
    id: "4",
    youtubeId: "IRWP9hYZsrA",
    title: "Galois Review by 360 Guy",
    creator: "360 Guy",
  },
];

/**
 * 全球统计
 */
export interface GlobalStat {
  label: string;
  value: number;
  suffix?: string;
  icon?: string;
}

export const GLOBAL_STATS: GlobalStat[] = [
  { label: "Countries", value: 50, suffix: "+", icon: "🌍" },
  { label: "Spaces Scanned", value: 50000000, suffix: "", icon: "📸" },
  { label: "Partnership Companies", value: 3000, suffix: "+", icon: "🤝" },
  { label: "Patents", value: 600, suffix: "+", icon: "💡" },
];

/**
 * 收货说明要点
 */
export interface ShippingPoint {
  title: string;
  description: string;
  icon: string;
}

export const SHIPPING_POINTS: ShippingPoint[] = [
  {
    title: "Data Security",
    icon: "/assets/shipping/data-security.jpg",
    description:
      "Your data is securely stored on AWS, the world's leading cloud platform. Rest assured, your information is protected with top-tier encryption and compliance standards.",
  },
  {
    title: "1-on-1 Support",
    icon: "/assets/shipping/support.jpg",
    description:
      "Skip the bots. Get personalized assistance from our expert team. From questions to solutions, we're with you every step.",
  },
  {
    title: "Global Delivery",
    icon: "/assets/shipping/delivery.jpg",
    description:
      "Shop anywhere, ship everywhere—for free. Fast, reliable delivery to your doorstep, no hidden costs.",
  },
  {
    title: "1-Year Warranty",
    icon: "/assets/shipping/warranty.jpg",
    description:
      "Shop with confidence. Enjoy full hardware product protection for a year after purchase, with easy claim processing.",
  },
];

/**
 * 分享场景特性
 */
export interface DistributionFeature {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const DISTRIBUTION_FEATURES: DistributionFeature[] = [
  {
    id: "1",
    title: "One Click Sharing",
    description: "Facebook, X, GSV and more",
    image: "/assets/3d-tour-distribution/one-click-sharing.jpg",
  },
  {
    id: "2",
    title: "Embed Code",
    description: "Embed Your Tour. Anywhere.",
    image: "/assets/3d-tour-distribution/embed-code.jpg",
  },
  {
    id: "3",
    title: "Unbrand Links",
    description: "Brand-free sharing.",
    image: "/assets/3d-tour-distribution/unbrand-links.jpg",
  },
  {
    id: "4",
    title: "Ready-to-Use Assets",
    description: "3D tour, Photos, floorplan, and more.",
    image: "/assets/3d-tour-distribution/ready-to-use-assets.jpg",
  },
];

/**
 * Galois 特性
 */
export interface Feature {
  id: string;
  title: string;
  description: string;
  video: string;
}

export const FEATURES: Feature[] = [
  {
    id: "1",
    title: "One-Click LiDAR for Indoor & Outdoor Scanning & Co-capture",
    description:
      "Galois rapidly captures complex environments, generating immersive 3D tours with a single click. For large projects, dual-device co-capture ensures maximum efficiency.",
    video: "/videos/One-Click LiDAR for Indoor & Outdoor Scanning & Co-capture.mp4",
  },
  {
    id: "2",
    title: "LiDAR Precision & 134MP True Color & Ultra Detail",
    description:
      "Galois delivers 134MP Clarity 3D for luxury marketing, powered by a 940nm LiDAR, a 4/3-inch CMOS, and 5-bracket HDR. Showcase superior craftsmanship and finishes to enhance perceived value and command premium pricing for high-end properties.",
    video: "/videos/LiDAR Precision & 134MP True Color & Ultra Detail.mp4",
  },
  {
    id: "3",
    title: "Pay-As-You-Go Credits Plan",
    description:
      "No monthly subscriptions. Only pay to activate. Shoot, edit, upload, and store all your projects for free. Get everything at once: RAW images, 16K panoramas, 3D models, E57 Point cloud, floor plans & CAD from a single scan.",
    video: "/videos/Pay-As-You-Go Credits Plan.mp4",
  },
  {
    id: "4",
    title: "Rich Editor Features",
    description:
      "Create captivating tours fast with Realsee editor: add multimedia label, screen label, area label, fusion video, AI Camera Removal, logo customization, aerial 3D connection, and automatic floor plans.",
    video: "/videos/Rich Editor features.mp4",
  },
];
