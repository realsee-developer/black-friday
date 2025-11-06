import Image from "next/image";
import { DISTRIBUTION_FEATURES } from "@/lib/constants";

interface DistributionSectionProps {
  className?: string;
}

export function DistributionSection({ className }: DistributionSectionProps) {
  return (
    <section
      id="distribution"
      className={`relative overflow-hidden bg-linear-to-b from-cyber-gray-900 via-cyber-gray-800 to-cyber-gray-900 pt-12 sm:pt-16 md:pt-20 lg:pt-28 pb-12 sm:pb-16 ${className || ""}`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-cyber-brand-500/10 blur-[150px]" />
        <div className="absolute right-1/3 bottom-1/4 h-80 w-80 rounded-full bg-cyber-neon-cyan/10 blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyber-gray-100 mb-3 sm:mb-4">
            Seamless 3D Virtual Tour Distribution
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
            Effortless sharing across platforms and devices for maximum reach.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {DISTRIBUTION_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="group cyber-card-neon p-0 flex flex-col overflow-hidden hover:scale-105 transition-all duration-300"
            >
              {/* Feature image - 贴边显示，与卡片圆角一致 */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-cyber-gray-800">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>

              {/* Feature info - 添加内边距 */}
              <div className="p-4 sm:p-6 flex flex-col items-center text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-cyber-gray-100 mb-1 sm:mb-2 group-hover:text-cyber-brand-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-cyber-gray-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
