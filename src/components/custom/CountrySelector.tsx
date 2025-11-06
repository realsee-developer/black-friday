"use client";

import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";

interface CountryData {
  code: string;
  country: string;
  region: string;
}

interface CountrySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (country: string, code: string) => void;
  selectedCountry: string;
  countryCodes: CountryData[];
}

export function CountrySelector({
  isOpen,
  onClose,
  onSelect,
  selectedCountry,
  countryCodes,
}: CountrySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 所有大洲
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(
      new Set(countryCodes.map((c) => c.region)),
    ).sort();
    return ["All", ...uniqueRegions];
  }, [countryCodes]);

  // 获取所有国家（去重）
  const allCountries = useMemo(() => {
    const countryMap = new Map<string, CountryData>();
    countryCodes.forEach((item) => {
      if (!countryMap.has(item.country)) {
        countryMap.set(item.country, item);
      }
    });
    return Array.from(countryMap.values()).sort((a, b) =>
      a.country.localeCompare(b.country),
    );
  }, [countryCodes]);

  // 过滤后的国家
  const filteredCountries = useMemo(() => {
    let filtered = allCountries;

    // 按大洲筛选
    if (selectedRegion !== "All") {
      filtered = filtered.filter((c) => c.region === selectedRegion);
    }

    // 按搜索词筛选
    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.country.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 按字母筛选
    if (selectedLetter) {
      filtered = filtered.filter((c) =>
        c.country.toLowerCase().startsWith(selectedLetter.toLowerCase()),
      );
    }

    return filtered;
  }, [allCountries, selectedRegion, searchTerm, selectedLetter]);

  // 按字母分组
  const countriesByLetter = useMemo(() => {
    const grouped = new Map<string, CountryData[]>();
    filteredCountries.forEach((country) => {
      const firstLetter = country.country[0].toUpperCase();
      if (!grouped.has(firstLetter)) {
        grouped.set(firstLetter, []);
      }
      grouped.get(firstLetter)?.push(country);
    });
    return grouped;
  }, [filteredCountries]);

  // 所有可用的字母
  const availableLetters = useMemo(() => {
    return Array.from(countriesByLetter.keys()).sort();
  }, [countriesByLetter]);

  // 打开时自动聚焦搜索框
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // ESC 键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // 点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSelectCountry = (country: string, code: string) => {
    onSelect(country, code);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl h-[85vh] max-h-[600px] sm:max-h-[700px] bg-cyber-gray-900 border-2 border-cyber-brand-500/30 rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(51,102,255,0.3)] animate-in zoom-in slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-cyber-gray-900/95 backdrop-blur-lg border-b border-cyber-gray-700 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-cyber-brand-500/20 rounded-lg flex-shrink-0">
                <Icon
                  icon="lucide:globe"
                  className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-brand-500"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-xl font-bold text-cyber-gray-100 truncate">
                  Select Country/Region
                </h2>
                <p className="text-xs sm:text-sm text-cyber-gray-400">
                  {filteredCountries.length} countries
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-cyber-gray-800 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <Icon
                icon="lucide:x"
                className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-gray-400 hover:text-cyber-gray-100"
              />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Icon
              icon="lucide:search"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-cyber-gray-400"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-10 sm:pr-4 py-2.5 sm:py-3 bg-cyber-gray-800 border border-cyber-gray-600 rounded-lg text-sm sm:text-base text-cyber-gray-100 placeholder-cyber-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-cyber-gray-700 rounded transition-colors"
              >
                <Icon
                  icon="lucide:x"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyber-gray-400"
                />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Regions & Letters (Hidden on mobile) */}
          <div className="hidden md:block w-48 border-r border-cyber-gray-700 bg-cyber-gray-900/50 overflow-y-auto country-dropdown-scrollbar">
            {/* Regions Filter */}
            <div className="p-4 border-b border-cyber-gray-700">
              <h3 className="text-xs font-semibold text-cyber-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Icon icon="lucide:map" className="w-3 h-3" />
                Regions
              </h3>
              <div className="space-y-1">
                {regions.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => {
                      setSelectedRegion(region);
                      setSelectedLetter("");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedRegion === region
                        ? "bg-cyber-brand-500 text-white font-medium shadow-lg shadow-cyber-brand-500/30"
                        : "text-cyber-gray-300 hover:bg-cyber-gray-800 hover:text-cyber-gray-100"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* A-Z Index */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-cyber-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Icon icon="lucide:list" className="w-3 h-3" />
                Quick Jump
              </h3>
              <div className="grid grid-cols-4 gap-1">
                {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => {
                  const isAvailable = availableLetters.includes(letter);
                  const isSelected = selectedLetter === letter;
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedLetter(
                            selectedLetter === letter ? "" : letter,
                          );
                          // 滚动到对应字母
                          const element = document.getElementById(
                            `letter-${letter}`,
                          );
                          element?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      disabled={!isAvailable}
                      className={`p-1.5 text-xs font-semibold rounded transition-all ${
                        isSelected
                          ? "bg-cyber-brand-500 text-white shadow-lg shadow-cyber-brand-500/30"
                          : isAvailable
                            ? "text-cyber-gray-300 hover:bg-cyber-gray-800 hover:text-cyber-gray-100"
                            : "text-cyber-gray-600 cursor-not-allowed opacity-50"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Content - Country List */}
          <div className="flex-1 overflow-y-auto country-dropdown-scrollbar p-3 sm:p-6">
            {filteredCountries.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {Array.from(countriesByLetter.entries())
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([letter, countries]) => (
                    <div key={letter} id={`letter-${letter}`}>
                      <div className="sticky top-0 bg-cyber-gray-900/95 backdrop-blur-sm py-1.5 sm:py-2 mb-2 sm:mb-3 border-b border-cyber-gray-700 flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyber-brand-500/20 flex items-center justify-center">
                          <span className="text-base sm:text-lg font-bold text-cyber-brand-500">
                            {letter}
                          </span>
                        </div>
                        <span className="text-xs text-cyber-gray-400">
                          {countries.length}{" "}
                          {countries.length === 1 ? "country" : "countries"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {countries.map((country) => (
                          <button
                            key={country.country}
                            type="button"
                            onClick={() =>
                              handleSelectCountry(country.country, country.code)
                            }
                            className={`group flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all ${
                              selectedCountry === country.country
                                ? "bg-cyber-brand-500/10 border-2 border-cyber-brand-500 shadow-lg shadow-cyber-brand-500/20"
                                : "bg-cyber-gray-800 border border-cyber-gray-700 hover:border-cyber-brand-500/50 hover:bg-cyber-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="text-left min-w-0 flex-1">
                                <div className="font-medium text-sm sm:text-base text-cyber-gray-100 group-hover:text-cyber-brand-500 transition-colors truncate">
                                  {country.country}
                                </div>
                                <div className="text-xs text-cyber-gray-500 truncate">
                                  {country.region} • {country.code}
                                </div>
                              </div>
                            </div>
                            {selectedCountry === country.country && (
                              <Icon
                                icon="lucide:check-circle"
                                className="w-4 h-4 sm:w-5 sm:h-5 text-cyber-brand-500 animate-in zoom-in duration-200 flex-shrink-0"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="p-4 bg-cyber-gray-800 rounded-full mb-4">
                  <Icon
                    icon="lucide:search-x"
                    className="w-12 h-12 text-cyber-gray-500"
                  />
                </div>
                <h3 className="text-lg font-semibold text-cyber-gray-300 mb-2">
                  No countries found
                </h3>
                <p className="text-sm text-cyber-gray-500 max-w-xs">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRegion("All");
                    setSelectedLetter("");
                  }}
                  className="mt-4 px-4 py-2 bg-cyber-brand-500 text-white rounded-lg hover:bg-cyber-brand-600 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-cyber-gray-900/95 backdrop-blur-lg border-t border-cyber-gray-700 px-3 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between text-xs text-cyber-gray-400">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline">💡 Tip: Use search or browse by region</span>
              <span className="sm:hidden">💡 Search to find</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-1 bg-cyber-gray-800 border border-cyber-gray-700 rounded text-cyber-gray-400">
              ESC to close
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

