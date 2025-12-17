"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect } from "react";
import { CHRISTMAS_NAV_TABS } from "@/lib/christmas-constants";
import { useUIStore } from "@/store/useUIStore";

export function ChristmasHeader() {
  // ✅ 使用 selector 只订阅需要渲染的状态
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const activeSection = useUIStore((state) => state.activeSection);
  const isScrolled = useUIStore((state) => state.isScrolled);

  // Handle scroll to highlight active section
  useEffect(() => {
    const { initializeScrollListener, cleanupScrollListener } =
      useUIStore.getState();
    initializeScrollListener();
    return () => cleanupScrollListener();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string
  ) => {
    e.preventDefault();
    useUIStore.getState().setActiveSection(id);
    useUIStore.getState().setMobileMenuOpen(false);

    const element = document.querySelector(href);
    if (element) {
      const offsetTop = (element as HTMLElement).offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass-card border-b border-christmas-ice/20"
          : "bg-gradient-to-b from-christmas-winter-dark/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="https://home.realsee.ai/en/home"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 sm:gap-3 group"
          >
            <div className="relative group floating-glow rounded-2xl">
              <div className="absolute -inset-3 bg-gradient-to-r from-christmas-ice/30 via-christmas-red/20 to-christmas-ice/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-10 w-auto">
                <Image
                  src="/assets/realsee-logo-en-with-brands-wihte.svg"
                  alt="Realsee Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto drop-shadow-[0_0_10px_rgba(208,232,255,0.3)]"
                  priority
                />
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-start ml-2">
              <span className="text-christmas-ice text-xs font-bold tracking-widest uppercase pulse-badge px-2 py-0.5 rounded-full bg-christmas-red/20 border border-christmas-red/40">
                🎄 SALE
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-full px-2 py-1 border border-christmas-ice/10">
            {CHRISTMAS_NAV_TABS.map((tab) => (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => handleNavClick(e, tab.href, tab.id)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeSection === tab.id
                    ? "bg-christmas-ice/20 text-white shadow-[0_0_15px_rgba(208,232,255,0.3)] border border-christmas-ice/30"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              useUIStore.getState().setMobileMenuOpen(!isMobileMenuOpen)
            }
            className="lg:hidden p-2 rounded-lg text-gray-100 hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-none"
            aria-label="Toggle menu"
          >
            <Icon
              icon={isMobileMenuOpen ? "lucide:x" : "lucide:menu"}
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-christmas-winter/98 backdrop-blur-lg border-b border-christmas-ice/30 transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
          {CHRISTMAS_NAV_TABS.map((tab) => (
            <a
              key={tab.id}
              href={tab.href}
              onClick={(e) => handleNavClick(e, tab.href, tab.id)}
              className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 min-h-[44px] flex items-center touch-none ${
                activeSection === tab.id
                  ? "bg-christmas-ice/20 text-white shadow-[0_0_20px_rgba(184,212,232,0.4)]"
                  : "text-gray-300 hover:text-gray-100 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
