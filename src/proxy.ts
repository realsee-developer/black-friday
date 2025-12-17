import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { geolocation } from "@vercel/functions";

/**
 * Vercel Edge Proxy for SEO/GEO optimization (Next.js 16+)
 *
 * Features:
 * 1. Domain-based routing (christmas.realsee.ai -> /christmas)
 * 2. Add geo-location headers for better SEO
 * 3. Add security headers
 * 4. Add performance headers
 * 5. Add SEO-friendly headers
 *
 * @see https://nextjs.org/docs/app/getting-started/proxy
 * @see https://vercel.com/docs/functions/geolocation
 * @see https://vercel.com/docs/routing-middleware/api
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Domain-based routing for Christmas promotion page
  // This must be done in proxy.ts, not next.config.ts rewrites,
  // because Vercel doesn't properly support host-based rewrites in next.config.ts
  if (
    hostname === "christmas.realsee.ai" ||
    hostname === "christmas.realsee.dev" ||
    hostname === "localhost:9999"
  ) {
    const pathname = url.pathname;
    
    // Skip rewrite for static assets and API routes
    // Static assets: /assets, /videos, /images, etc.
    // Also skip if path already starts with /christmas
    const isStaticAsset =
      pathname.startsWith("/assets/") ||
      pathname.startsWith("/videos/") ||
      pathname.startsWith("/images/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/api/") ||
      /\.(jpg|jpeg|png|gif|svg|webp|avif|ico|mp4|webm|pdf|txt|xml|json|woff|woff2|ttf|eot)$/i.test(
        pathname
      );

    if (!isStaticAsset && !pathname.startsWith("/christmas")) {
      // Rewrite root path to /christmas, other paths to /christmas/path
      url.pathname = pathname === "/" ? "/christmas" : `/christmas${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  const response = NextResponse.next();

  // Get geo-location from Vercel Functions API
  // Note: request.geo is deprecated in Next.js 15+
  // Use @vercel/functions instead
  const geo = geolocation(request);
  // Don't set default country - let it be undefined if not detected
  // This way, RetailPartners will be hidden for unknown locations
  const country = geo?.country || undefined;
  const region = geo?.region || "";
  const city = geo?.city || "";
  const latitude = geo?.latitude || "";
  const longitude = geo?.longitude || "";

  // Add custom headers for SEO and analytics
  if (country) {
    response.headers.set("X-Geo-Country", country);
  }
  if (region) {
    response.headers.set("X-Geo-Region", region);
  }
  if (city) {
    response.headers.set("X-Geo-City", city);
  }

  // Security headers for SEO trust signals
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Performance headers
  // Disable caching in development environment
  if (process.env.NODE_ENV === "development") {
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
  } else {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
  }

  // SEO-friendly headers
  response.headers.set("X-Robots-Tag", "index, follow");

  // Add geo-location meta for analytics
  if (latitude && longitude) {
    response.headers.set("X-Geo-Location", `${latitude},${longitude}`);
  }

  return response;
}

// Configure which routes to run proxy on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets, videos, images (static assets)
     * - favicon.ico (favicon file)
     * - files with static extensions (.txt, .xml, .json, images, fonts, etc.)
     * 
     * Note: Using non-capturing groups (?:...) because Next.js matcher doesn't support capturing groups
     */
    "/((?!api|_next/static|_next/image|assets|videos|images|favicon\\.ico|.*\\.(?:txt|xml|json|jpg|jpeg|png|gif|svg|webp|avif|ico|mp4|webm|pdf|woff|woff2|ttf|eot)).*)",
  ],
};
