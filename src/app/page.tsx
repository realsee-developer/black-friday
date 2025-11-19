import { ContactForm } from "@/components/custom/ContactForm";
// import { CountdownSection } from "@/components/custom/CountdownSection";
import { DistributionSection } from "@/components/custom/DistributionSection";
import { FeaturesSection } from "@/components/custom/FeaturesSection";
import { HeroSection } from "@/components/custom/HeroSection";
import { ProductOffers } from "@/components/custom/ProductOffers";
import { RetailPartners } from "@/components/custom/RetailPartners";
import { ShippingInfo } from "@/components/custom/ShippingInfo";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { TestimonialSection } from "@/components/custom/TestimonialSection";
import { ToursShowcase } from "@/components/custom/ToursShowcase";
import { getAllStructuredData } from "@/lib/structured-data";
import {
  getGeoCountryCode,
  getRetailPartnersCountryCode,
} from "@/lib/geo";

export default async function Home() {
  const structuredData = getAllStructuredData();
  
  // Get country code from headers set by proxy.ts
  const geoCountryCode = await getGeoCountryCode();
  
  // Only show RetailPartners for US and CA
  const countryCode = getRetailPartnersCountryCode(geoCountryCode);

  return (
    <div className="relative">
      {/* Structured Data for SEO */}
      {structuredData.map((schema, index) => (
        <script
          key={`schema-${schema["@type"]}-${index}`}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Header - Fixed */}
      <SiteHeader />

      {/* Main content */}
      <main className="relative">
        {/* Hero Section */}
        <HeroSection />

        {/* Countdown Section */}
        {/* <CountdownSection /> */}

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

        {/* Contact Form */}
        <ContactForm initialCountryCode={geoCountryCode || undefined} />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
