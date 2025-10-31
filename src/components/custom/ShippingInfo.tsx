import Image from "next/image";
import { SHIPPING_POINTS } from "@/lib/constants";

interface ShippingInfoProps {
  className?: string;
}

export function ShippingInfo({ className }: ShippingInfoProps) {
  return (
    <section
      id="shipping-info"
      className={`relative overflow-hidden bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-900/95 to-cyber-gray-800 py-20 sm:py-28 ${className || ""}`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute left-[20%] top-12 h-80 w-80 rounded-full bg-cyber-brand-500/10 blur-[140px]" />
        <div className="absolute right-[20%] bottom-12 h-72 w-72 rounded-full bg-cyber-neon-cyan/10 blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-gray-100 mb-4">
            Shop Now, Worry-Free
          </h2>
          <p className="text-lg sm:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
            Your satisfaction, our commitment. Discover the advantages that set
            us apart.
          </p>
        </div>

        {/* Points grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {SHIPPING_POINTS.map((point, index) => (
            <div
              key={index}
              className="group cyber-card-neon p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              {/* Icon */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyber-brand-500/20 to-cyber-neon-cyan/20 blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-cyber-brand-500/30 group-hover:border-cyber-brand-500/60 transition-colors">
                  <Image
                    src={point.icon}
                    alt={point.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-cyber-gray-100 mb-3 group-hover:text-cyber-brand-500 transition-colors">
                {point.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-cyber-gray-300 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
