import { ContactForm } from "@/components/custom/ContactForm";
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

export default function Home() {
  const structuredData = getAllStructuredData();

  return (
    <div className="relative">
      {/* Structured Data for SEO */}
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Header - Fixed */}
      <SiteHeader />

      {/* Main content */}
      <main className="relative">
        {/* Hero Section */}
        <HeroSection />

        {/* Black Friday Offers */}
        <ProductOffers />

        {/* Shipping Info */}
        <ShippingInfo />

        {/* Retail Partners */}
        <RetailPartners />

        {/* 3D Tour Showcases */}
        <ToursShowcase />

        {/* 3D Tour Distribution */}
        <DistributionSection />

        {/* About Galois - Features */}
        <FeaturesSection />

        {/* Testimonials */}
        <TestimonialSection />

        {/* Contact Form */}
        <ContactForm />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
