import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compress: true,
  poweredByHeader: false,

  // 优化生产构建
  productionBrowserSourceMaps: false,
  reactStrictMode: true,

  images: {
    loaderFile: "./src/lib/cloudflare-image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "global-public.realsee-cdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [75, 80, 85, 90, 95],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // 添加资源预连接提示，加速外部资源加载
          {
            key: "Link",
            value: [
              "<https://discover-assets.realsee.dev>; rel=preconnect; crossorigin",
              "<https://fonts.googleapis.com>; rel=preconnect; crossorigin",
              "<https://fonts.gstatic.com>; rel=preconnect; crossorigin",
              "<https://www.googletagmanager.com>; rel=preconnect; crossorigin",
              "<https://www.google-analytics.com>; rel=dns-prefetch",
              "<https://www.youtube.com>; rel=dns-prefetch",
              "<https://api.iconify.design>; rel=dns-prefetch",
              "<https://cdn.plyr.io>; rel=dns-prefetch",
            ].join(", "),
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
    ];
  },
  // Note: Domain-based routing is now handled in src/proxy.ts
  // The rewrites() function in next.config.ts doesn't properly support
  // host-based rewrites on Vercel. Use Next.js proxy/middleware instead.
  // See: https://vercel.com/docs/routing-middleware/api
};

export default nextConfig;
