import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-t border-christmas-gold/30">
      {/* Christmas background patterns */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 40%, rgba(196, 30, 58, 0.08), transparent 70%), radial-gradient(circle at 80% 20%, rgba(212, 168, 83, 0.05), transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(196, 30, 58, 0.03) 50%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `conic-gradient(from 180deg at 50% 50%, transparent 0deg, rgba(212, 168, 83, 0.04) 60deg, transparent 120deg)`,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212, 168, 83, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 168, 83, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative">
        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          {/* Brand Section */}
          <div className="mb-12 sm:mb-16 md:mb-20 text-center">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-christmas-red/30 via-christmas-gold/20 to-christmas-red/30 rounded-3xl blur-md group-hover:blur-lg transition-all duration-500" />
                <Image
                  src="/assets/brand/realsee-logo.jpeg"
                  alt="Realsee Logo"
                  width={64}
                  height={64}
                  className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-2xl transition-all duration-500 p-1"
                  priority
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-5 sm:h-5 bg-gradient-to-br from-christmas-red to-christmas-gold rounded-full border-2 border-gray-900 shadow-lg shadow-christmas-gold/50" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold font-display bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-red bg-clip-text text-transparent">
                  Realsee
                </span>
                <span className="text-christmas-red text-sm sm:text-base md:text-lg font-semibold -mt-1 tracking-wider">
                  CHRISTMAS SALE
                </span>
              </div>
            </div>
            <p className="text-gray-300 max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed px-4">
              Professional 3D scanning technology for creators worldwide.
              <br className="hidden sm:block" />
              Limited time Christmas offers on Galois 3D LiDAR Camera.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid gap-12 sm:gap-16 mb-12 sm:mb-16 md:mb-20 sm:grid-cols-2 lg:grid-cols-3">
            {/* Products */}
            <div className="space-y-6 sm:space-y-8 group">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-widest text-cyber-brand-600 border-b-2 border-cyber-brand-500/30 pb-2 sm:pb-3 relative">
                Products
                <div className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-linear-to-r from-cyber-brand-500 to-cyber-neon-cyan group-hover:w-full transition-all duration-700" />
              </h3>
              <ul className="space-y-4 sm:space-y-6">
                {[
                  {
                    name: "Galois",
                    desc: "Advanced 3D LiDAR camera for ultra-precise virtual tours and point cloud capture.",
                    link: "https://home.realsee.ai/en/galois",
                  },
                  {
                    name: "Realsee G1",
                    desc: "Smartphone gimbal that turns your phone into an instant 3D tour scanner.",
                    link: "https://home.realsee.ai/en/realsee-g1",
                  },
                  {
                    name: "360 Camera",
                    desc: "3D virtual tour app that works with leading 360 cameras for rapid tour creation.",
                    link: "https://home.realsee.ai/en/vr-capture-with-360-camera",
                  },
                  {
                    name: "Mobile App",
                    desc: "Create immersive 3D tours, models, and floorplans using only your smartphone.",
                    link: "https://home.realsee.ai/en/vr-capture-with-mobile",
                  },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      className="group/link block p-4 -m-4 rounded-xl hover:bg-linear-to-r hover:from-cyber-brand-500/5 hover:to-cyber-neon-cyan/5 border border-transparent hover:border-cyber-brand-500/20 transition-all duration-300 backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-cyber-brand-500 focus-visible:outline-offset-2"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${item.name} - ${item.desc}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-cyber-gray-100 font-semibold text-lg group-hover/link:text-cyber-brand-500 transition-colors duration-300">
                          {item.name}
                        </span>
                        <Icon
                          className="text-cyber-gray-500 group-hover/link:text-cyber-brand-500 opacity-0 group-hover/link:opacity-100 transition-all duration-300 transform group-hover/link:translate-x-1"
                          icon="heroicons:arrow-top-right-on-square"
                          width={18}
                        />
                      </div>
                      <p className="text-sm text-cyber-gray-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div className="space-y-6 sm:space-y-8 group">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-widest text-cyber-brand-600 border-b-2 border-cyber-brand-500/30 pb-2 sm:pb-3 relative">
                Solutions
                <div className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-linear-to-r from-cyber-brand-500 to-cyber-neon-cyan group-hover:w-full transition-all duration-700" />
              </h3>
              <ul className="space-y-4 sm:space-y-6">
                {[
                  {
                    name: "Real Estate",
                    desc: "Complete 3D virtual tour solutions for property marketing and sales",
                    link: "https://home.realsee.ai/en/solutions-real-estate",
                  },
                  {
                    name: "Photography",
                    desc: "Professional real estate photography and virtual staging services",
                    link: "https://home.realsee.ai/en/solutions-real-estate-photographer",
                  },
                  {
                    name: "Brokerage",
                    desc: "Enterprise solutions for real estate brokerages and agencies",
                    link: "https://home.realsee.ai/en/real-estate-brokerage",
                  },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      className="group/link block p-4 -m-4 rounded-xl hover:bg-linear-to-r hover:from-cyber-brand-500/5 hover:to-cyber-neon-cyan/5 border border-transparent hover:border-cyber-brand-500/20 transition-all duration-300 backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-cyber-brand-500 focus-visible:outline-offset-2"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${item.name} - ${item.desc}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-cyber-gray-100 font-semibold text-lg group-hover/link:text-cyber-brand-500 transition-colors duration-300">
                          {item.name}
                        </span>
                        <Icon
                          className="text-cyber-gray-500 group-hover/link:text-cyber-brand-500 opacity-0 group-hover/link:opacity-100 transition-all duration-300 transform group-hover/link:translate-x-1"
                          icon="heroicons:arrow-top-right-on-square"
                          width={18}
                        />
                      </div>
                      <p className="text-sm text-cyber-gray-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-6 sm:space-y-8 group">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-widest text-cyber-brand-600 border-b-2 border-cyber-brand-500/30 pb-2 sm:pb-3 relative">
                Resources
                <div className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-linear-to-r from-cyber-brand-500 to-cyber-neon-cyan group-hover:w-full transition-all duration-700" />
              </h3>
              <ul className="space-y-4 sm:space-y-6">
                {[
                  {
                    name: "Realsee App",
                    desc: "Download our mobile app for iOS and Android devices",
                    link: "https://home.realsee.ai/en/download-realsee-vr",
                  },
                  {
                    name: "Console",
                    desc: "Manage your 3D content and virtual tours in our web dashboard",
                    link: "https://my.realsee.ai/capture-3d",
                  },
                  {
                    name: "Support Center",
                    desc: "Get help, documentation, and customer support resources",
                    link: "https://home.realsee.ai/en/contact-us",
                  },
                  {
                    name: "Legal",
                    desc: "Terms of service, privacy policy, and legal information",
                    link: "https://home.realsee.ai/legal",
                  },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      className="group/link block p-4 -m-4 rounded-xl hover:bg-linear-to-r hover:from-cyber-brand-500/5 hover:to-cyber-neon-cyan/5 border border-transparent hover:border-cyber-brand-500/20 transition-all duration-300 backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-cyber-brand-500 focus-visible:outline-offset-2"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${item.name} - ${item.desc}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-cyber-gray-100 font-semibold text-lg group-hover/link:text-cyber-brand-500 transition-colors duration-300">
                          {item.name}
                        </span>
                        <Icon
                          className="text-cyber-gray-500 group-hover/link:text-cyber-brand-500 opacity-0 group-hover/link:opacity-100 transition-all duration-300 transform group-hover/link:translate-x-1"
                          icon="heroicons:arrow-top-right-on-square"
                          width={18}
                        />
                      </div>
                      <p className="text-sm text-cyber-gray-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-christmas-gold/20 bg-gradient-to-r from-gray-900/80 via-black/60 to-gray-900/80 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-between gap-8 text-center lg:text-left">
              {/* Copyright */}
              <div className="text-sm text-cyber-gray-300 order-2 lg:order-1 max-w-md lg:max-w-none">
                <p>
                  © {new Date().getFullYear()} Beike Realsee Technology (HK)
                  Limited.
                </p>
                <p className="text-cyber-gray-400 mt-1">
                  All rights reserved. Pioneering the future of real estate
                  technology.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 order-1 lg:order-2">
                <span className="text-xs text-cyber-gray-400 uppercase tracking-wider mr-2">
                  Connect
                </span>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {[
                    {
                      icon: "mdi:facebook",
                      label: "Facebook",
                      link: "https://www.facebook.com/RealseeVR/",
                    },
                    {
                      icon: "mdi:instagram",
                      label: "Instagram",
                      link: "https://www.instagram.com/realsee_tech/",
                    },
                    {
                      icon: "mdi:linkedin",
                      label: "LinkedIn",
                      link: "https://www.linkedin.com/company/realsee/",
                    },
                    {
                      icon: "mdi:youtube",
                      label: "YouTube",
                      link: "https://www.youtube.com/channel/UCARlm-6LYCRgjIu_R8LbD8Q",
                    },
                    {
                      icon: "mdi:whatsapp",
                      label: "WhatsApp",
                      link: "https://wa.me/message/CGR6XJOODRABC1",
                    },
                    {
                      icon: "simple-icons:x",
                      label: "X",
                      link: "https://x.com/REALSEE_Moment",
                    },
                    {
                      icon: "mdi:reddit",
                      label: "Reddit",
                      link: "https://www.reddit.com/r/RealseeOfficial/",
                    },
                  ].map((social) => (
                    <Link
                      key={social.label}
                      aria-label={social.label}
                      title={`Follow Realsee on ${social.label}`}
                      className="p-2 sm:p-3 rounded-xl text-cyber-gray-100 border border-cyber-gray-600/40 bg-cyber-gray-800/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyber-brand-400 hover:text-cyber-neon-cyan hover:shadow-md hover:shadow-cyber-brand-500/20 focus-visible:outline-2 focus-visible:outline-cyber-brand-500 focus-visible:outline-offset-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-none"
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon icon={social.icon} width={18} className="sm:w-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
