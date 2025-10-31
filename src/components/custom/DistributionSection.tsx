import { DISTRIBUTION_FEATURES } from "@/lib/constants";

interface DistributionSectionProps {
  className?: string;
}

export function DistributionSection({ className }: DistributionSectionProps) {
  return (
    <section
      id="distribution"
      className={`relative overflow-hidden bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-800 to-cyber-gray-900 py-20 sm:py-28 ${className || ""}`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-cyber-brand-500/10 blur-[150px]" />
        <div className="absolute right-1/3 bottom-1/4 h-80 w-80 rounded-full bg-cyber-neon-cyan/10 blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-gray-100 mb-4">
            Seamless 3D Virtual Tour Distribution
          </h2>
          <p className="text-lg sm:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
            Effortless sharing across platforms and devices for maximum reach.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {DISTRIBUTION_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="group cyber-card-neon p-6 flex flex-col items-center text-center hover:scale-105 transition-all duration-300"
            >
              {/* Feature image */}
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-brand-500/10 to-cyber-neon-cyan/10" />
                <div className="relative w-full h-full flex items-center justify-center bg-cyber-gray-800/50">
                  {/* Placeholder - will be replaced with actual images */}
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-cyber-brand-500/20 flex items-center justify-center">
                      <span className="text-3xl">🔗</span>
                    </div>
                    <p className="text-cyber-gray-400 text-xs">Feature Image</p>
                  </div>
                </div>
              </div>

              {/* Feature info */}
              <h3 className="text-xl font-semibold text-cyber-gray-100 mb-2 group-hover:text-cyber-brand-500 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-cyber-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
