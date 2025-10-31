"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NAV_TABS } from "@/lib/constants";
import { throttle } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";

export function SiteHeader() {
  const {
    isMobileMenuOpen,
    activeSection,
    setMobileMenuOpen,
    setActiveSection,
  } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to highlight active section
  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 20);

      // Find active section based on scroll position
      const sections = NAV_TABS.map((tab) => document.querySelector(tab.href));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const { offsetTop } = section as HTMLElement;
          if (scrollPosition >= offsetTop) {
            setActiveSection(NAV_TABS[i].id);
            break;
          }
        }
      }
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setActiveSection]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string,
  ) => {
    e.preventDefault();
    setActiveSection(id);
    setMobileMenuOpen(false);

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
          ? "bg-cyber-gray-900/95 backdrop-blur-lg border-b border-cyber-brand-500/20 shadow-lg shadow-cyber-brand-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/assets/brand/favicon-rounded-512.png"
                alt="Realsee"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-cyber-gray-100 group-hover:text-cyber-brand-500 transition-colors hidden sm:inline">
              Realsee
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_TABS.map((tab) => (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => handleNavClick(e, tab.href, tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeSection === tab.id
                    ? "bg-cyber-brand-500/20 text-cyber-brand-500 shadow-[0_0_15px_rgba(51,102,255,0.3)]"
                    : "text-cyber-gray-300 hover:text-cyber-gray-100 hover:bg-white/5"
                }`}
              >
                {tab.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-cyber-gray-100 hover:bg-white/10 transition-colors"
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
        className={`lg:hidden absolute top-full left-0 right-0 bg-cyber-gray-900/98 backdrop-blur-lg border-b border-cyber-brand-500/20 transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
          {NAV_TABS.map((tab) => (
            <a
              key={tab.id}
              href={tab.href}
              onClick={(e) => handleNavClick(e, tab.href, tab.id)}
              className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeSection === tab.id
                  ? "bg-cyber-brand-500/20 text-cyber-brand-500 shadow-[0_0_15px_rgba(51,102,255,0.3)]"
                  : "text-cyber-gray-300 hover:text-cyber-gray-100 hover:bg-white/5"
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
