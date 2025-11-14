/**
 * Google Tag Manager Event Tracking Utilities
 * 
 * Provides type-safe wrapper functions for sending events to GTM using
 * Next.js @next/third-parties sendGTMEvent API.
 */

import type {
  AnalyticsEvent,
  HeroCTAClickEvent,
  ProductContactClickEvent,
  ProductBuyClickEvent,
  ProductDetailsViewEvent,
  TourLaunchClickEvent,
  RetailShopClickEvent,
  FormSubmitEvent,
  WhatsAppClickEvent,
  DownloadAppClickEvent,
  FacebookLeadEvent,
  FacebookInitiateCheckoutEvent,
} from "@/types/analytics";
import {
  CURRENCY_USD,
  FACEBOOK_EVENT_LEAD,
  FACEBOOK_EVENT_INITIATE_CHECKOUT,
  FACEBOOK_CONTENT_TYPE_PRODUCT,
} from "@/lib/analytics-constants";

/**
 * Check if GTM is enabled via environment variable
 */
export const isGTMEnabled = (): boolean => {
  return !!(
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_GTM_ID &&
    process.env.NEXT_PUBLIC_GTM_ID !== "GTM-XXXXXXX"
  );
};

/**
 * Generic function to send events to GTM
 * Uses the Next.js sendGTMEvent API when available
 */
export const sendGTMEvent = (event: AnalyticsEvent): void => {
  if (!isGTMEnabled()) {
    console.log("[Analytics - Dev Mode]", event);
    return;
  }

  try {
    // Push to dataLayer (GTM standard approach)
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push(event);
      console.log("[Analytics - Sent]", event);
    }
  } catch (error) {
    console.error("[Analytics - Error]", error);
  }
};

/**
 * Track Hero CTA clicks
 */
export const trackHeroCTAClick = (ctaText: string, destination: string): void => {
  const event: HeroCTAClickEvent = {
    event: "hero_cta_click",
    cta_text: ctaText,
    cta_destination: destination,
  };
  sendGTMEvent(event);
};

/**
 * Track Product Contact button clicks
 */
export const trackProductContactClick = (
  productId: string,
  productName: string,
  productPrice: number,
): void => {
  const event: ProductContactClickEvent = {
    event: "product_contact_click",
    product_id: productId,
    product_name: productName,
    product_price: productPrice,
  };
  sendGTMEvent(event);
};

/**
 * Track Product Buy button clicks
 */
export const trackProductBuyClick = (
  productId: string,
  productName: string,
  productPrice: number,
  buyUrl: string,
): void => {
  const event: ProductBuyClickEvent = {
    event: "product_buy_click",
    product_id: productId,
    product_name: productName,
    product_price: productPrice,
    buy_url: buyUrl,
  };
  sendGTMEvent(event);
};

/**
 * Track Product Details expand/collapse
 */
export const trackProductDetailsView = (
  productId: string,
  productName: string,
  action: "expand" | "collapse",
): void => {
  const event: ProductDetailsViewEvent = {
    event: "product_details_view",
    product_id: productId,
    product_name: productName,
    action: action,
  };
  sendGTMEvent(event);
};

/**
 * Track Tour Launch button clicks
 */
export const trackTourLaunchClick = (
  tourTitle: string,
  tourUrl: string,
  tourCategory?: string,
): void => {
  const event: TourLaunchClickEvent = {
    event: "tour_launch_click",
    tour_title: tourTitle,
    tour_url: tourUrl,
    tour_category: tourCategory,
  };
  sendGTMEvent(event);
};

/**
 * Track Retail Partner Shop Now clicks
 */
export const trackRetailShopClick = (partnerName: string, partnerUrl: string): void => {
  const event: RetailShopClickEvent = {
    event: "retail_shop_click",
    partner_name: partnerName,
    partner_url: partnerUrl,
  };
  sendGTMEvent(event);
};

/**
 * Track Contact Form submission
 */
export const trackFormSubmit = (
  industry: string,
  country: string,
  devicesUsed?: string,
  phoneContact?: string,
  hasCompany?: boolean,
): void => {
  const event: FormSubmitEvent = {
    event: "form_submit",
    form_name: "contact_form",
    industry: industry,
    country: country,
    devices_used: devicesUsed,
    phone_contact: phoneContact,
    has_company: hasCompany || false,
  };
  sendGTMEvent(event);
};

/**
 * Track WhatsApp button clicks
 */
export const trackWhatsAppClick = (source: string): void => {
  const event: WhatsAppClickEvent = {
    event: "whatsapp_click",
    source: source,
  };
  sendGTMEvent(event);
};

/**
 * Track Download App button clicks
 */
export const trackDownloadAppClick = (source: string): void => {
  const event: DownloadAppClickEvent = {
    event: "download_app_click",
    source: source,
  };
  sendGTMEvent(event);
};

/**
 * Track Facebook Pixel Lead event (form submission)
 */
export const trackFacebookLead = (
  contentName?: string,
  contentCategory?: string,
  value?: number,
  currency: string = CURRENCY_USD,
): void => {
  try {
    const event: FacebookLeadEvent = {
      event: FACEBOOK_EVENT_LEAD,
      content_name: contentName,
      content_category: contentCategory,
      value: value,
      currency: currency,
    };
    sendGTMEvent(event);
  } catch (error) {
    // Silently fail to prevent tracking errors from affecting user experience
    console.error("[Analytics - Facebook Lead Error]", error);
  }
};

/**
 * Track Facebook Pixel InitiateCheckout event (Buy Now button click)
 */
export const trackFacebookInitiateCheckout = (
  contentName: string,
  contentIds: string[],
  value: number,
  currency: string = CURRENCY_USD,
  numItems: number = 1,
): void => {
  try {
    const event: FacebookInitiateCheckoutEvent = {
      event: FACEBOOK_EVENT_INITIATE_CHECKOUT,
      content_name: contentName,
      content_ids: contentIds,
      content_type: FACEBOOK_CONTENT_TYPE_PRODUCT,
      value: value,
      currency: currency,
      num_items: numItems,
    };
    sendGTMEvent(event);
  } catch (error) {
    // Silently fail to prevent tracking errors from affecting user experience
    console.error("[Analytics - Facebook InitiateCheckout Error]", error);
  }
};

