/**
 * Badge utility functions for consistent badge styling across components
 */

import { Icon } from "@iconify/react";

export function getBadgeIcon(category: string): string {
  const c = (category || "").toLowerCase();
  if (c.includes("residential") || c.includes("house") || c.includes("home")) return "heroicons:home";
  if (c.includes("industrial") || c.includes("factory")) return "heroicons:building-office-2";
  if (c.includes("exhibition")) return "heroicons:photo";
  if (c.includes("showroom")) return "heroicons:sparkles";
  if (c.includes("museum")) return "heroicons:building-library";
  if (c.includes("office")) return "heroicons:building-office";
  if (c.includes("restaurant")) return "heroicons:building-storefront";
  if (c.includes("studio")) return "heroicons:video-camera";
  if (c.includes("church")) return "mdi:church";
  if (c.includes("gym")) return "mdi:dumbbell";
  if (c.includes("aerial")) return "heroicons:paper-airplane";
  if (c.includes("outdoor") || c.includes("outside")) return "heroicons:globe-alt";
  if (c.includes("retail") || c.includes("store")) return "heroicons:building-storefront";
  if (c.includes("hospitality")) return "heroicons:building-storefront";
  if (c.includes("cultural")) return "heroicons:building-library";
  if (c.includes("construction")) return "heroicons:building-office-2";
  return "heroicons:tag";
}

export function getDeviceIcon(device: string): string {
  const d = (device || "").toLowerCase();
  if (d.includes("galois") || d.includes("伽罗华")) return "mdi:laser-pointer";
  if (d.includes("pano to 3d") || d.includes("panorama") || d.includes("全景")) return "mdi:panorama-variant";
  return "heroicons:camera";
}

/**
 * Device icon component that handles icons
 */
export function DeviceIcon({ device, width = 16, className = "" }: { device: string; width?: number; className?: string }) {
  return <Icon icon={getDeviceIcon(device)} width={width} className={className} />;
}

