import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://blackfriday.realsee.ai"),
  title: {
    default: "Black Friday Event - Galois 3D LiDAR Camera | Realsee",
    template: "%s | Realsee Black Friday",
  },
  description:
    "Black Friday Special: Save up to $1,425 on Galois 3D LiDAR Camera. Premium Bundle $4,999 (reg. $6,424). Limited time offer Nov 17 - Dec 7, 2025.",
  keywords: [
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
  ],
  authors: [{ name: "Realsee" }],
  creator: "Realsee",
  publisher: "Realsee",
  alternates: {
    canonical: "https://blackfriday.realsee.ai",
    languages: {
      "en-US": "https://blackfriday.realsee.ai",
    },
  },
  manifest: "/manifest.json",
  applicationName: "Realsee Black Friday",
  category: "Technology",
  classification: "E-commerce",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blackfriday.realsee.ai",
    title: "Black Friday Event - Galois 3D LiDAR Camera | Realsee",
    description:
      "Black Friday Special: Save up to $1,425 on Galois 3D LiDAR Camera. Premium Bundle $4,999 (reg. $6,424).",
    siteName: "Realsee Black Friday",
    images: [
      {
        url: "https://blackfriday.realsee.ai/assets/products/galois-premium-bundle.jpg",
        width: 1200,
        height: 1200,
        alt: "Realsee Black Friday - Galois 3D LiDAR Camera Premium Bundle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Friday Event - Galois 3D LiDAR Camera | Realsee",
    description:
      "Black Friday Special: Save up to $1,425 on Galois 3D LiDAR Camera. Limited time offer!",
    images: ["https://blackfriday.realsee.ai/assets/products/galois-premium-bundle.jpg"],
    creator: "@REALSEE_Moment",
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      </body>
    </html>
  );
}
