import { Icon } from "@iconify/react";
import { RETAIL_PARTNERS } from "@/lib/constants";

interface RetailPartnersProps {
  className?: string;
}

export function RetailPartners({ className }: RetailPartnersProps) {
  return (
    <section
      id="retail-partners"
      className={`relative overflow-hidden bg-gradient-to-b from-cyber-gray-800 via-cyber-gray-900 to-cyber-gray-900 py-16 sm:py-20 ${className || ""}`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber-brand-500/10 blur-[160px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyber-gray-100 mb-3">
            Available at Trusted Retailers
          </h2>
          <p className="text-base sm:text-lg text-cyber-gray-300 max-w-2xl mx-auto">
            Purchase Galois from our authorized retail partners
          </p>
        </div>

        {/* Partners grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {RETAIL_PARTNERS.map((partner) => (
            <a
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group cyber-card-neon p-8 flex flex-col items-center justify-center text-center hover:scale-105 transition-all duration-300"
            >
              {/* Logo placeholder - will be replaced with actual logos */}
              <div className="relative w-full h-24 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-white/5 backdrop-blur-sm" />
                <div className="relative z-10 text-cyber-gray-100 font-semibold text-xl">
                  {partner.name}
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-cyber-brand-500 font-medium group-hover:text-cyber-neon-cyan transition-colors">
                <span>Shop Now</span>
                <Icon
                  icon="lucide:external-link"
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
