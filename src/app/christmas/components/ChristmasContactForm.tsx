"use client";

import Image from "next/image";
import { ContactForm } from "@/components/custom/ContactForm";

interface ChristmasContactFormProps {
  initialCountryCode?: string;
}

/**
 * Christmas Contact Form wrapper with Christmas-themed background images
 */
export function ChristmasContactForm({
  initialCountryCode,
}: ChristmasContactFormProps) {
  return (
    <div className="relative">
      {/* Christmas Contact Background - Override the default background */}
      <div className="absolute inset-0 z-0">
        {/* Mobile */}
        <Image
          src="/assets/christmas/contact/contact-bg-mobile.jpg"
          alt="Christmas Contact Background"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-center block md:hidden"
        />
        {/* Tablet */}
        <Image
          src="/assets/christmas/contact/contact-bg-pad.jpg"
          alt="Christmas Contact Background"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-center hidden md:block lg:hidden"
        />
        {/* Desktop */}
        <Image
          src="/assets/christmas/contact/contact-bg-pc.jpg"
          alt="Christmas Contact Background"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-center hidden lg:block"
        />
      </div>

      {/* Contact Form with transparent background */}
      <div className="relative z-10 [&_section]:bg-transparent [&_.absolute.inset-0.z-0]:hidden">
        <ContactForm
          initialCountryCode={initialCountryCode}
          hideWhatsApp={false}
        />
      </div>
    </div>
  );
}
