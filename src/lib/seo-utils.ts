/**
 * SEO utility functions for black-friday.realsee.ai
 * Provides helpers for international SEO, hreflang tags, and AI crawler optimization
 */

/**
 * Generate hreflang alternates for global markets
 * All markets use English content with USD currency for now
 * @param baseUrl - The base URL of the site
 * @returns Object with language codes and URLs for metadata.alternates.languages
 */
export function generateGlobalAlternates(baseUrl: string) {
  return {
    // Default for unmatched languages
    "x-default": baseUrl,
    // North America
    "en-US": baseUrl,
    "en-CA": baseUrl,
    // Europe
    "en-GB": baseUrl,
    "de-DE": baseUrl, // German market
    "fr-FR": baseUrl, // French market
    "es-ES": baseUrl, // Spanish market
    "it-IT": baseUrl, // Italian market
    "nl-NL": baseUrl, // Dutch market
    "pl-PL": baseUrl, // Polish market
    "pt-PT": baseUrl, // Portuguese market
    // Asia Pacific
    "en-AU": baseUrl,
    "en-SG": baseUrl, // Singapore
    "en-NZ": baseUrl, // New Zealand
    "ja-JP": baseUrl, // Japanese market
    "zh-CN": baseUrl, // Simplified Chinese
    "zh-TW": baseUrl, // Traditional Chinese
    "zh-HK": baseUrl, // Hong Kong
    "ko-KR": baseUrl, // Korean market
    // Middle East
    "en-AE": baseUrl, // UAE
    "ar-AE": baseUrl, // Arabic (UAE)
    "en-SA": baseUrl, // Saudi Arabia
    // Latin America
    "es-MX": baseUrl, // Mexico
    "pt-BR": baseUrl, // Brazil
    "es-AR": baseUrl, // Argentina
    "es-CL": baseUrl, // Chile
    // Other markets
    "en-IN": baseUrl, // India
    "en-ZA": baseUrl, // South Africa
    "ru-RU": baseUrl, // Russia
  };
}

/**
 * Get list of AI crawler user agents
 * Used for robots.txt and analytics
 */
export function getAICrawlers() {
  return [
    "GPTBot",
    "ChatGPT-User",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Google-Extended",
    "Amazonbot",
    "FacebookBot",
    "Meta-ExternalAgent",
    "Applebot",
    "Bingbot", // Also used for ChatGPT search
  ];
}

/**
 * Check if a user agent is an AI crawler
 * @param userAgent - The user agent string to check
 * @returns true if the user agent is an AI crawler
 */
export function isAICrawler(userAgent: string): boolean {
  const aiCrawlers = getAICrawlers();
  const userAgentLower = userAgent.toLowerCase();
  return aiCrawlers.some((crawler) =>
    userAgentLower.includes(crawler.toLowerCase()),
  );
}

/**
 * Get optimized meta tags for AI search engines
 * These tags help AI models better understand and index content
 */
export function getAIOptimizedMetaTags() {
  return {
    // Allow AI crawlers to use content
    robots: "index, follow, max-image-preview:large, max-snippet:-1",
    // Help AI understand the content type
    "article:content_tier": "free",
    // Indicate this is commercial content
    "article:tag": "e-commerce, technology, 3d-scanning",
  };
}

/**
 * Generate canonical URL with proper formatting
 * @param path - The path to append to base URL
 * @param baseUrl - The base URL
 * @returns Properly formatted canonical URL
 */
export function generateCanonicalUrl(
  path: string,
  baseUrl: string = "https://black-friday.realsee.ai",
): string {
  // Remove trailing slash from baseUrl
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  // Ensure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Remove trailing slash from path unless it's just "/"
  const finalPath = cleanPath === "/" ? "" : cleanPath.replace(/\/$/, "");

  return `${cleanBaseUrl}${finalPath}`;
}

/**
 * Get target markets information
 * Useful for displaying shipping info and market-specific content
 */
export function getTargetMarkets() {
  return [
    { code: "US", name: "United States", region: "North America" },
    { code: "CA", name: "Canada", region: "North America" },
    { code: "GB", name: "United Kingdom", region: "Europe" },
    { code: "DE", name: "Germany", region: "Europe" },
    { code: "FR", name: "France", region: "Europe" },
    { code: "ES", name: "Spain", region: "Europe" },
    { code: "IT", name: "Italy", region: "Europe" },
    { code: "NL", name: "Netherlands", region: "Europe" },
    { code: "AU", name: "Australia", region: "Asia Pacific" },
    { code: "SG", name: "Singapore", region: "Asia Pacific" },
    { code: "JP", name: "Japan", region: "Asia Pacific" },
    { code: "CN", name: "China", region: "Asia Pacific" },
    { code: "KR", name: "South Korea", region: "Asia Pacific" },
    { code: "AE", name: "United Arab Emirates", region: "Middle East" },
    { code: "MX", name: "Mexico", region: "Latin America" },
    { code: "BR", name: "Brazil", region: "Latin America" },
  ];
}

/**
 * Build SEO image URL for metadata (Open Graph, Twitter, etc.)
 * Uses Cloudflare CDN with Image Resizing if configured
 * @param imagePath - Relative path to image (e.g., "/assets/image.jpg" or "assets/image.jpg")
 * @param options - Image transformation options
 * @returns Full URL for SEO metadata
 */
export function buildSEOImageUrl(
  imagePath: string,
  options: {
    width?: number;
    quality?: number;
    baseUrl?: string;
  } = {},
): string {
  const {
    width = 1200,
    quality = 85,
    baseUrl = "https://black-friday.realsee.ai",
  } = options;

  // Get CDN base URL from environment
  const cdnBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, "");
  const projectPrefix =
    process.env.NEXT_PUBLIC_ASSET_PROJECT_PREFIX || "black-friday";

  // Normalize image path (remove leading slash)
  const normalizedPath = imagePath.startsWith("/")
    ? imagePath.slice(1)
    : imagePath;

  // If CDN is configured, use Cloudflare Image Resizing
  if (cdnBase) {
    const transforms = [
      `width=${width}`,
      `quality=${quality}`,
      "format=auto",
    ].join(",");
    const fullPath = `${projectPrefix}/${normalizedPath}`;
    return `${cdnBase}/cdn-cgi/image/${transforms}/${fullPath}`;
  }

  // Fallback to site URL
  return `${baseUrl}/${normalizedPath}`;
}

/**
 * Build asset URL for non-image resources (videos, documents, etc.)
 * Uses CDN if configured, but without image transformation parameters
 * @param assetPath - Relative path to asset (e.g., "/videos/demo.mp4" or "videos/demo.mp4")
 * @param baseUrl - Base URL to use if CDN is not configured
 * @returns Full URL for the asset
 */
export function buildAssetUrl(
  assetPath: string,
  baseUrl: string = "https://black-friday.realsee.ai",
): string {
  // Get CDN base URL from environment
  const cdnBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, "");
  const projectPrefix =
    process.env.NEXT_PUBLIC_ASSET_PROJECT_PREFIX || "black-friday";

  // Normalize asset path (remove leading slash)
  const normalizedPath = assetPath.startsWith("/")
    ? assetPath.slice(1)
    : assetPath;

  // If CDN is configured, use direct CDN path (no image transformation)
  if (cdnBase) {
    const fullPath = `${projectPrefix}/${normalizedPath}`;
    return `${cdnBase}/${fullPath}`;
  }

  // Fallback to site URL
  return `${baseUrl}/${normalizedPath}`;
}

