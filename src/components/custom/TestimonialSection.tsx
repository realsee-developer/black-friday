import { Icon } from "@iconify/react";
import { GLOBAL_STATS, KOL_VIDEOS } from "@/lib/constants";

interface TestimonialSectionProps {
  className?: string;
}

export function TestimonialSection({ className }: TestimonialSectionProps) {
  return (
    <section
      id="testimonial"
      className={`relative overflow-hidden bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-800 to-cyber-gray-900 py-20 sm:py-28 ${className || ""}`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyber-brand-500/10 blur-[150px]" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-cyber-neon-cyan/10 blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-24">
        {/* 1. KOL Videos */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-gray-100 mb-4">
              Watch Galois in Action
            </h2>
            <p className="text-lg sm:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
              Get inspired by real-world applications. Explore our curated
              collection of YouTube reviews from trusted experts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {KOL_VIDEOS.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group cyber-card-neon p-4 hover:scale-105 transition-all duration-300"
              >
                {/* YouTube thumbnail */}
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon
                        icon="lucide:play"
                        className="w-8 h-8 text-white ml-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Video info */}
                <div>
                  <h3 className="text-cyber-gray-100 font-semibold mb-1 group-hover:text-cyber-brand-500 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-cyber-gray-400">
                    by {video.creator}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 2. Professionals - Placeholder */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-gray-100 mb-4">
              Realsee Galois Professionals
            </h2>
            <p className="text-lg sm:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
              Explore a global roster of certified creators delivering premium
              spatial capture, 3D storytelling, and immersive experiences.
            </p>
          </div>

          {/* Placeholder for Professionals component */}
          <div className="cyber-card-neon p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cyber-brand-500/20 flex items-center justify-center">
              <Icon
                icon="lucide:users"
                className="w-12 h-12 text-cyber-brand-500"
              />
            </div>
            <p className="text-cyber-gray-400 text-lg">
              Professionals Component
              <br />
              <span className="text-sm">
                (To be integrated from Discover project)
              </span>
            </p>
          </div>
        </div>

        {/* 3. Global Stats */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-gray-100 mb-4">
              Trusted 3D Tour Solution for Global Business
            </h2>
            <p className="text-lg sm:text-xl text-cyber-gray-300 max-w-3xl mx-auto">
              Powering innovation across continents
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Stats */}
            <div className="grid grid-cols-2 gap-6">
              {GLOBAL_STATS.map((stat, index) => (
                <div
                  key={index}
                  className="cyber-card-neon p-6 text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-4xl sm:text-5xl font-bold text-cyber-brand-500 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-cyber-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: World Map Placeholder */}
            <div className="cyber-card-neon p-8">
              <div className="aspect-[4/3] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-cyber-brand-500/20 flex items-center justify-center">
                    <Icon
                      icon="lucide:globe"
                      className="w-12 h-12 text-cyber-brand-500"
                    />
                  </div>
                  <p className="text-cyber-gray-400">
                    World Map Visualization
                    <br />
                    <span className="text-sm">
                      Coverage: Americas, Europe, Asia-Pacific, Middle East
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
