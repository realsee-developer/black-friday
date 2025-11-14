/**
 * Analytics Event Types for Google Tag Manager and GA4
 * 
 * This file defines all custom events and their parameters for tracking
 * user interactions and conversions throughout the application.
 */

// Base event structure
export interface GTMEvent {
  event: string;
  [key: string]: string | number | boolean | undefined;
}

// Hero Section Events
export interface HeroCTAClickEvent extends GTMEvent {
  event: "hero_cta_click";
  cta_text: string;
  cta_destination: string;
}

// Product Events
export interface ProductContactClickEvent extends GTMEvent {
  event: "product_contact_click";
  product_id: string;
  product_name: string;
  product_price: number;
}

export interface ProductBuyClickEvent extends GTMEvent {
  event: "product_buy_click";
  product_id: string;
  product_name: string;
  product_price: number;
  buy_url: string;
}

export interface ProductDetailsViewEvent extends GTMEvent {
  event: "product_details_view";
  product_id: string;
  product_name: string;
  action: "expand" | "collapse";
}

// Tour Events
export interface TourLaunchClickEvent extends GTMEvent {
  event: "tour_launch_click";
  tour_title: string;
  tour_url: string;
  tour_category?: string;
}

// Retail Partner Events
export interface RetailShopClickEvent extends GTMEvent {
  event: "retail_shop_click";
  partner_name: string;
  partner_url: string;
}

// Contact & Conversion Events
export interface FormSubmitEvent extends GTMEvent {
  event: "form_submit";
  form_name: "contact_form";
  industry: string;
  country: string;
  devices_used?: string;
  phone_contact?: string;
  has_company: boolean;
}

export interface WhatsAppClickEvent extends GTMEvent {
  event: "whatsapp_click";
  source: "contact_form" | "floating_button" | string;
}

export interface DownloadAppClickEvent extends GTMEvent {
  event: "download_app_click";
  source: "contact_form" | string;
}

// Facebook Pixel Events
export interface FacebookLeadEvent extends GTMEvent {
  event: "Lead";
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface FacebookInitiateCheckoutEvent extends GTMEvent {
  event: "InitiateCheckout";
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  [key: string]: string | number | boolean | string[] | undefined;
}

// Union type of all possible events
export type AnalyticsEvent =
  | HeroCTAClickEvent
  | ProductContactClickEvent
  | ProductBuyClickEvent
  | ProductDetailsViewEvent
  | TourLaunchClickEvent
  | RetailShopClickEvent
  | FormSubmitEvent
  | WhatsAppClickEvent
  | DownloadAppClickEvent
  | FacebookLeadEvent
  | FacebookInitiateCheckoutEvent;

// Event parameter types for convenience
export type EventParams<T extends AnalyticsEvent> = Omit<T, "event">;

