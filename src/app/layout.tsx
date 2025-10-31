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
  title: "Black Friday Event - Galois 3D LiDAR Camera | Realsee",
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
  ],
  authors: [{ name: "Realsee" }],
  creator: "Realsee",
  publisher: "Realsee",
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
        url: "/assets/hero/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Realsee Black Friday - Galois 3D LiDAR Camera",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Friday Event - Galois 3D LiDAR Camera | Realsee",
    description:
      "Black Friday Special: Save up to $1,425 on Galois 3D LiDAR Camera. Limited time offer!",
    images: ["/assets/hero/og-image.jpg"],
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
        {children}
      </body>
    </html>
  );
}
