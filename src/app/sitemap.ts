import type { MetadataRoute } from "next";

/**
 * Dynamic sitemap for black-friday.realsee.ai
 * Optimized for search engines and AI crawlers
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://black-friday.realsee.ai";

  // Event dates
  const eventStartDate = new Date("2025-11-17T00:00:00-08:00");
  const eventEndDate = new Date("2025-12-07T23:59:59-08:00");
  const now = new Date();

  // Determine if we're currently in the event period
  const isEventActive = now >= eventStartDate && now <= eventEndDate;

  // Use current time if event is active, otherwise use event start date
  const lastModified = isEventActive ? now : eventStartDate;

  return [
    {
      url: baseUrl,
      lastModified: lastModified,
      changeFrequency: isEventActive ? "hourly" : "daily",
      priority: 1.0,
      // Add images for better image search indexing
      images: [
        {
          url: `${baseUrl}/assets/realsee-black-friday-2025-galois-share.jpg`,
          title: "Realsee Black Friday 2025 - Galois 3D LiDAR Camera",
          alt: "Realsee Black Friday 2025 - Galois 3D LiDAR Camera Premium Bundle - Save $1,425",
        },
        {
          url: `${baseUrl}/assets/products/galois-premium-bundle.jpg`,
          title: "Realsee Galois Premium Bundle - 3D LiDAR Camera",
          alt: "Realsee Galois Premium Bundle - Professional 3D LiDAR Camera with accessories",
        },
        {
          url: `${baseUrl}/assets/products/galois-standard-kit.jpg`,
          title: "Realsee Galois Standard Kit - 3D LiDAR Camera",
          alt: "Realsee Galois Standard Kit - Essential 3D LiDAR Camera package",
        },
      ],
    },
  ];
}
