import type { Metadata } from "next";
import { buildSEOImageUrl } from "@/lib/seo-utils";

// 使用 CDN 生成小尺寸 4:3 比例的 og:image (800x600)
const ogImageUrl = buildSEOImageUrl(
  "/assets/christmas/products/galois-premium-bundle.jpg",
  { width: 800, quality: 85 }
);

export const metadata: Metadata = {
  title:
    "Christmas Sale 2025 - Galois 3D LiDAR Camera | Up to $1225 OFF | Realsee",
  description:
    "Dec 17-23, 2025. Experience professional 3D scanning with Realsee Galois. Premium Bundle $5199, Standard Kit $4799. Worldwide shipping.",
  keywords: [
    "Galois",
    "3D LiDAR Camera",
    "Christmas Sale",
    "3D Scanning",
    "Virtual Tours",
    "Realsee",
    "LiDAR",
    "Professional Camera",
  ],
  openGraph: {
    title: "Galois 3D LiDAR Camera Christmas Promotion",
    description:
      "Experience professional 3D scanning with up to $1225 OFF. Dec 17-23, 2025.",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 800,
        height: 600,
        alt: "Galois Premium Bundle - Christmas Special Offer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Galois 3D LiDAR Camera Christmas Promotion",
    description:
      "Experience professional 3D scanning with up to $1225 OFF. Dec 17-23, 2025.",
    images: [ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://christmas.realsee.ai",
  },
};

export default function ChristmasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="christmas-theme">{children}</div>;
}
