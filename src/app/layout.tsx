import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { generateGlobalAlternates, buildSEOImageUrl } from "@/lib/seo-utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://black-friday.realsee.ai"),
  title: {
    default:
      "Realsee Black Friday 2025 - Galois 3D LiDAR Camera Sale | Save $1,425",
    template: "%s | Realsee Black Friday",
  },
  description:
    "Realsee Black Friday 2025: Save up to $1,425 on Galois 3D LiDAR Camera. Premium Bundle $4,999 (reg. $6,424). Worldwide shipping available. Limited time offer Nov 17 - Dec 7, 2025.",
  keywords: [
    // 核心品牌+活动关键词
    "Realsee Black Friday",
    "Realsee Black Friday 2025",
    "Realsee 黑五",
    "Realsee 黑色星期五",
    "如实 黑五",
    // 产品+活动组合
    "Galois Black Friday",
    "Galois Black Friday Deal",
    "Realsee Black Friday Sale",
    "Realsee Galois Black Friday",
    "Galois 3D Camera Black Friday",
    // 通用关键词
    "Black Friday",
    "Galois",
    "3D LiDAR Camera",
    "Realsee",
    "3D Scanning",
    "Virtual Tour",
    "Real Estate Technology",
    "Black Friday Deals",
    "LiDAR Scanner",
    "3D Tour Camera",
    "Professional 3D Camera",
    "Real Estate Photography",
    "Virtual Tour Camera",
    "3D Mapping",
    "Indoor Scanning",
    "Outdoor Scanning",
    "134MP Camera",
    "Black Friday Camera Deals",
    "3D Scanning Technology",
    "Worldwide Shipping",
    "Global Delivery",
  ],
  authors: [{ name: "Realsee" }],
  creator: "Realsee",
  publisher: "Realsee",
  alternates: {
    canonical: "https://black-friday.realsee.ai",
    languages: generateGlobalAlternates("https://black-friday.realsee.ai"),
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/assets/brand/favicon.ico" },
      { url: "/assets/brand/favicon.png", type: "image/png" },
      {
        url: "/assets/brand/favicon-rounded-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/assets/brand/favicon-rounded-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  applicationName: "Realsee Black Friday",
  category: "Technology",
  classification: "E-commerce",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://black-friday.realsee.ai",
    title:
      "Realsee Black Friday 2025 - Galois 3D LiDAR Camera Sale | Save $1,425",
    description:
      "Realsee Black Friday 2025: Save up to $1,425 on Galois 3D LiDAR Camera. Premium Bundle $4,999 (reg. $6,424). Worldwide shipping available. Limited offer Nov 17 - Dec 7.",
    siteName: "Realsee Black Friday",
    images: [
      {
        url: buildSEOImageUrl("/assets/realsee-black-friday-2025-galois-share.jpg"),
        width: 1200,
        height: 1200,
        alt: "Realsee Black Friday 2025 - Galois 3D LiDAR Camera Premium Bundle - Save $1,425",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Realsee Black Friday 2025 - Galois 3D LiDAR Camera Sale | Save $1,425",
    description:
      "Realsee Black Friday 2025: Save up to $1,425 on Galois 3D LiDAR Camera. Worldwide shipping. Limited time offer Nov 17 - Dec 7!",
    images: [
      buildSEOImageUrl("/assets/realsee-black-friday-2025-galois-share.jpg"),
    ],
    creator: "@REALSEE_Moment",
    site: "@REALSEE_Moment",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Google verification: Already completed via DNS for realsee.ai domain
  // Bing verification: Already completed via Google Search Console import
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Realsee Black Friday",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  other: {
    "theme-color": "#0a0f1a",
    "color-scheme": "dark",
    "mobile-web-app-capable": "yes",
    // AI Search Engine optimization tags
    "ai-content-declaration": "ai-assisted",
    "content-language": "en",
    "geo.region": "US",
    "geo.position": "global",
    "ICBM": "global",
    // Allow AI crawlers to use content for training and search
    "X-Robots-Tag":
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    // Indicate commercial content for AI understanding
    "article:tag": "e-commerce, technology, 3d-scanning, black-friday, lidar",
    "product:availability": "in stock",
    "product:condition": "new",
    "product:price:currency": "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html
      lang="en"
      data-theme="cyberpunk"
      className={`dark ${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}
    >
      <body className="bg-cyber-gray-900 text-cyber-gray-200 antialiased">
        {/* Skip to main content link for accessibility */}
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-cyber-brand-500 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        {children}
        {/* Google Tag Manager - only load if GTM ID is configured */}
        {gtmId && gtmId !== "GTM-XXXXXXX" && <GoogleTagManager gtmId={gtmId} />}
      </body>
    </html>
  );
}
