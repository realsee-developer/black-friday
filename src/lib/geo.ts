import { headers } from "next/headers";

/**
 * Get geo country code from request headers
 * 
 * @returns Country code string or undefined if not available
 */
export async function getGeoCountryCode(): Promise<string | undefined> {
  const headersList = await headers();
  return (
    headersList.get("x-geo-country") || headersList.get("X-Geo-Country") || undefined
  );
}

/**
 * Check if RetailPartners section should be shown
 * 
 * @param countryCode - Country code from geo detection
 * @returns true if country is US or CA, false otherwise
 */
export function shouldShowRetailPartners(
  countryCode: string | undefined | null,
): countryCode is "US" | "CA" {
  return countryCode === "US" || countryCode === "CA";
}

/**
 * Get filtered country code for RetailPartners
 * Returns country code only if it's US or CA, otherwise null
 * 
 * @param countryCode - Country code from geo detection
 * @returns "US" | "CA" | null
 */
export function getRetailPartnersCountryCode(
  countryCode: string | undefined | null,
): "US" | "CA" | null {
  return shouldShowRetailPartners(countryCode) ? countryCode : null;
}

