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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#082a2a]/95 backdrop-blur-lg border-b border-christmas-teal-light/30 shadow-lg shadow-christmas-teal/10"
          : "bg-transparent"
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
            <div className="relative group">
              <div className="absolute -inset-2 bg-linear-to-r from-christmas-teal/30 via-christmas-gold/30 to-christmas-teal/30 rounded-3xl blur-md group-hover:blur-lg transition-all duration-500" />
              <Image
                src="/assets/brand/realsee-logo.jpeg"
                alt="Realsee Logo"
                width={40}
                height={40}
                className="relative w-10 h-10 rounded-2xl shadow-2xl ring-2 ring-christmas-teal-light/50 group-hover:ring-christmas-gold/70 transition-all duration-500"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-linear-to-br from-christmas-gold to-christmas-red rounded-full border-2 border-[#082a2a] shadow-lg shadow-christmas-gold/50" />
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-xl font-bold font-display bg-linear-to-r from-christmas-gold via-christmas-red to-christmas-gold bg-clip-text text-transparent">
                Realsee
              </span>
              <span className="text-christmas-gold text-xs font-semibold -mt-1 tracking-wider">
                CHRISTMAS SALE
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {CHRISTMAS_NAV_TABS.map((tab) => (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => handleNavClick(e, tab.href, tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeSection === tab.id
                    ? "bg-christmas-teal/30 text-white shadow-[0_0_15px_rgba(212,168,83,0.3)]"
                    : "text-gray-300 hover:text-gray-100 hover:bg-white/5"
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
        className={`lg:hidden absolute top-full left-0 right-0 bg-[#082a2a]/98 backdrop-blur-lg border-b border-christmas-teal-light/30 transition-all duration-300 ${
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
                  ? "bg-christmas-teal/30 text-white shadow-[0_0_15px_rgba(212,168,83,0.3)]"
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
