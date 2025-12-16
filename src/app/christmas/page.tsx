import { ContactForm } from "@/components/custom/ContactForm";
import { DistributionSection } from "@/components/custom/DistributionSection";
import { FeaturesSection } from "@/components/custom/FeaturesSection";
import { Professionals } from "@/components/custom/Professionals";
import { ShippingInfo } from "@/components/custom/ShippingInfo";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { TestimonialSection } from "@/components/custom/TestimonialSection";
import { ToursShowcase } from "@/components/custom/ToursShowcase";
import { getGeoCountryCode } from "@/lib/geo";
import { ChristmasHeader } from "./components/ChristmasHeader";
import { ChristmasHeroSection } from "./components/ChristmasHeroSection";
import { ChristmasProductOffers } from "./components/ChristmasProductOffers";
import { TrustStats } from "./components/TrustStats";

export default async function ChristmasPage() {
  // Get country code from headers set by proxy.ts
  const geoCountryCode = await getGeoCountryCode();

  return (
    <div className="relative christmas-theme">
      {/* Header - Fixed */}
      <ChristmasHeader />

      {/* Main content */}
      <main className="relative">
        {/* Hero Section */}
        <ChristmasHeroSection />

        {/* Christmas Offers */}
        <ChristmasProductOffers />

        {/* Shipping Info - Reuse existing component */}
        <ShippingInfo />

        {/* 3D Tour Showcases - Reuse existing component */}
        <ToursShowcase />

        {/* 3D Tour Distribution - Reuse existing component */}
        <DistributionSection />

        {/* About Galois - Features - Reuse existing component */}
        <FeaturesSection />

        {/* Testimonials - Reuse existing component */}
        <TestimonialSection />

        {/* Professionals - Reuse existing component */}
        <Professionals />

        {/* Global Trust Stats */}
        <TrustStats />

        {/* Contact Form - Reuse existing component */}
        <ContactForm initialCountryCode={geoCountryCode || undefined} />
      </main>

      {/* Footer - Reuse existing component */}
      <SiteFooter />
    </div>
  );
}
