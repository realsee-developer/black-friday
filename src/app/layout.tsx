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
      "Our Black Friday Has Ended - Realsee Galois 3D LiDAR Camera | Contact Us",
    template: "%s | Realsee",
  },
  description:
    "Our Black Friday 2025 event has ended. Thank you for your interest. For more information about Realsee Galois 3D LiDAR Camera products, please contact us.",
  keywords: [
    "Realsee Black Friday 2025",
    "如视 黑五",
    "Galois Black Friday",
    "3D LiDAR Camera",
    "Realsee",
    "Black Friday Deals",
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
      "Our Black Friday Has Ended - Realsee Galois 3D LiDAR Camera | Contact Us",
    description:
      "Our Black Friday 2025 event has ended. Thank you for your interest. For more information about Realsee Galois 3D LiDAR Camera products, please contact us.",
    siteName: "Realsee Black Friday",
    images: [
      {
        url: buildSEOImageUrl(
          "/assets/realsee-black-friday-2025-galois-share.jpg"
        ),
        width: 1200,
        height: 1200,
        alt: "Realsee Black Friday 2025 - Galois 3D LiDAR Camera Premium Bundle - Save $1,425",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Our Black Friday Has Ended - Realsee Galois 3D LiDAR Camera | Contact Us",
    description:
      "Our Black Friday 2025 event has ended. Thank you for your interest. For more information about Realsee Galois 3D LiDAR Camera products, please contact us.",
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
    ICBM: "global",
    // Allow AI crawlers to use content for training and search
    "X-Robots-Tag":
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    // Indicate commercial content for AI understanding
    "article:tag": "e-commerce, technology, 3d-scanning, black-friday, lidar",
    "product:availability": "in stock",
    "product:condition": "new",
    "product:price:currency": "USD",
    // Performance optimization hints
    "resource-hints": "preconnect, dns-prefetch",
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
      suppressHydrationWarning
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
