import { DistributionSection } from "@/components/custom/DistributionSection";
import { FeaturesSection } from "@/components/custom/FeaturesSection";
import { Professionals } from "@/components/custom/Professionals";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { TestimonialSection } from "@/components/custom/TestimonialSection";
import { ToursShowcase } from "@/components/custom/ToursShowcase";
import { getGeoCountryCode } from "@/lib/geo";
import { ChristmasContactForm } from "./components/ChristmasContactForm";
import { ChristmasHeader } from "./components/ChristmasHeader";
import { ChristmasHeroSection } from "./components/ChristmasHeroSection";
import { ChristmasProductOffers } from "./components/ChristmasProductOffers";
import { ChristmasShippingInfo } from "./components/ChristmasShippingInfo";

import { CHRISTMAS_KOL_VIDEOS } from "@/lib/christmas-constants";

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

        {/* Shipping Info - Christmas themed */}
        <ChristmasShippingInfo />

        {/* 3D Tour Showcases - Reuse existing component */}
        <ToursShowcase />

        {/* 3D Tour Distribution - Reuse existing component with Christmas Title */}
        <DistributionSection
          title="Seamless Virtual Tour Distribution"
          theme="christmas"
        />

        {/* About Galois - Features - Reuse existing component with Christmas Title */}
        <FeaturesSection
          title="3D LiDAR Solution with Pay-As-You-Go 3D Hosting"
          subtitle="Professional-grade features designed for creators"
        />

        {/* Testimonials - Christmas specific videos and title */}
        <TestimonialSection
          title="Creator Testimonials"
          subtitle="Trusted by Photographers and 3D Creators Worldwide"
          videos={CHRISTMAS_KOL_VIDEOS}
          hideProfessionals
          hideWorldMap
        />

        {/* Professionals - Reuse existing component */}
        <Professionals />

        {/* Contact Form - Christmas themed */}
        <ChristmasContactForm
          initialCountryCode={geoCountryCode || undefined}
        />
      </main>

      {/* Footer - Reuse existing component */}
      <SiteFooter />
    </div>
  );
}
