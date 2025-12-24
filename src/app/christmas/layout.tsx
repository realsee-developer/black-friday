import type { Metadata } from "next";
import { buildSEOImageUrl } from "@/lib/seo-utils";

// 使用 CDN 生成小尺寸 4:3 比例的 og:image (800x600) - 活动结束图片
const ogImageUrl = buildSEOImageUrl(
  "/assets/christmas/products/galois-premium-bundle-ended.jpg",
  { width: 800, quality: 85 }
);

export const metadata: Metadata = {
  title:
    "Christmas Sale 2025 Has Ended - Realsee Galois 3D LiDAR Camera | Contact Us",
  description:
    "Our Christmas 2025 event has ended. Thank you for your interest. For more information about Realsee Galois 3D LiDAR Camera products, please contact us.",
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
    title: "Christmas Sale 2025 Has Ended - Realsee Galois 3D LiDAR Camera",
    description:
      "Our Christmas 2025 event has ended. Thank you for your interest. Contact us for more information.",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 800,
        height: 600,
        alt: "Galois Premium Bundle - Christmas Sale Ended",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Christmas Sale 2025 Has Ended - Realsee Galois 3D LiDAR Camera",
    description:
      "Our Christmas 2025 event has ended. Thank you for your interest. Contact us for more information.",
    images: [ogImageUrl],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
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
