import type { Metadata } from "next";
import { ContactForm } from "@/components/custom/ContactForm";
import { CountdownSection } from "@/components/custom/CountdownSection";
import { DistributionSection } from "@/components/custom/DistributionSection";
import { FeaturesSection } from "@/components/custom/FeaturesSection";
import { ProductOffers } from "@/components/custom/ProductOffers";
import { RetailPartners } from "@/components/custom/RetailPartners";
import { ShippingInfo } from "@/components/custom/ShippingInfo";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { TestimonialSection } from "@/components/custom/TestimonialSection";
import { ToursShowcase } from "@/components/custom/ToursShowcase";
import { getContactPageSchema } from "@/lib/structured-data";
import { generateGlobalAlternates, buildSEOImageUrl } from "@/lib/seo-utils";
import {
  getGeoCountryCode,
  getRetailPartnersCountryCode,
} from "@/lib/geo";

export const metadata: Metadata = {
  title: "Contact Us - Realsee Black Friday 2025",
  description:
    "Contact Realsee for Black Friday 2025 deals on Galois 3D LiDAR Camera. Get in touch for inquiries, pricing, demos, and worldwide shipping information. Limited time offer Nov 17 - Dec 7.",
  keywords: [
    "Contact Realsee",
    "Realsee Black Friday Contact",
    "Galois Camera Inquiry",
    "3D LiDAR Camera Contact",
    "Realsee Customer Service",
    "Black Friday Inquiry",
    "Lead Generation",
    "Contact Form",
    "Realsee Support",
    "Galois Pricing",
    "3D Camera Demo",
    "Virtual Tour Camera Contact",
  ],
  alternates: {
    canonical: "https://black-friday.realsee.ai/contact-us",
    languages: generateGlobalAlternates("https://black-friday.realsee.ai/contact-us"),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://black-friday.realsee.ai/contact-us",
    title: "Contact Us - Realsee Black Friday 2025",
    description:
      "Contact Realsee for Black Friday 2025 deals on Galois 3D LiDAR Camera. Get in touch for inquiries, pricing, demos, and more.",
    siteName: "Realsee Black Friday",
    images: [
      {
        url: buildSEOImageUrl("/assets/realsee-black-friday-2025-galois-share.jpg"),
        width: 1200,
        height: 1200,
        alt: "Realsee Black Friday 2025 - Contact Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - Realsee Black Friday 2025",
    description:
      "Contact Realsee for Black Friday 2025 deals on Galois 3D LiDAR Camera. Get in touch for inquiries, pricing, demos, and more.",
    images: [
      buildSEOImageUrl("/assets/realsee-black-friday-2025-galois-share.jpg"),
    ],
    creator: "@REALSEE_Moment",
    site: "@REALSEE_Moment",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "X-Robots-Tag":
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },
};

export default async function ContactUsPage() {
  const contactPageSchema = getContactPageSchema();
  
  // Get country code from headers set by proxy.ts
  const geoCountryCode = await getGeoCountryCode();
  
  // Only show RetailPartners for US and CA
  const countryCode = getRetailPartnersCountryCode(geoCountryCode);

  return (
    <div className="relative">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      {/* Header - Fixed */}
      <SiteHeader />

      {/* Main content */}
      <main className="relative">
        {/* Contact Form - At the top */}
        <ContactForm 
          initialCountryCode={geoCountryCode || undefined} 
          hideWhatsApp={true}
        />

        {/* Countdown Section */}
        <CountdownSection />

        {/* Black Friday Offers */}
        <ProductOffers />

        {/* Shipping Info */}
        <ShippingInfo />

        {/* Retail Partners */}
        <RetailPartners countryCode={countryCode} />

        {/* 3D Tour Showcases */}
        <ToursShowcase />

        {/* 3D Tour Distribution */}
        <DistributionSection />

        {/* About Galois - Features */}
        <FeaturesSection />

        {/* Testimonials */}
        <TestimonialSection />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

