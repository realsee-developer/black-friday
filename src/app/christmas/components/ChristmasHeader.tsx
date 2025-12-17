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
          ? "glass-card border-b border-christmas-gold/20"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo with Christmas decoration */}
          <a
            href="https://home.realsee.ai/en/home"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
            aria-label="Go to homepage"
          >
            <div className="relative h-8 w-auto">
              <Image
                src="/assets/realsee-logo-en-with-brands-wihte.svg"
                alt="Realsee Logo"
                width={100}
                height={32}
                className="h-8 w-auto"
                unoptimized
                priority
              />
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-full px-2 py-1 border border-christmas-gold/10">
            {CHRISTMAS_NAV_TABS.map((tab) => (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => handleNavClick(e, tab.href, tab.id)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeSection === tab.id
                    ? "bg-christmas-gold/20 text-white shadow-[0_0_15px_rgba(212,168,83,0.3)] border border-christmas-gold/30"
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
        className={`lg:hidden absolute top-full left-0 right-0 bg-black/98 backdrop-blur-lg border-b border-christmas-gold/30 transition-all duration-300 ${
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
                  ? "bg-christmas-gold/20 text-white shadow-[0_0_20px_rgba(212,168,83,0.4)]"
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
