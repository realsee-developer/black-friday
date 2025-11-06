"use client";

import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";

interface CountryCodeData {
  code: string;
  country: string;
  region: string;
}

interface CountryCodeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  selectedCode: string;
  countryCodes: CountryCodeData[];
}

export function CountryCodeSelector({
  isOpen,
  onClose,
  onSelect,
  selectedCode,
  countryCodes,
}: CountryCodeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 所有大洲
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(
      new Set(countryCodes.map((c) => c.region)),
    ).sort();
    return ["All", ...uniqueRegions];
  }, [countryCodes]);

  // 按区号分组（去重）
  const codeGroups = useMemo(() => {
    const groups = new Map<string, CountryCodeData[]>();
    
    countryCodes.forEach((item) => {
      if (!groups.has(item.code)) {
        groups.set(item.code, []);
      }
      groups.get(item.code)?.push(item);
    });

    return groups;
  }, [countryCodes]);

  // 过滤后的区号组
  const filteredCodeGroups = useMemo(() => {
    let filtered = Array.from(codeGroups.entries());

    // 按大洲筛选
    if (selectedRegion !== "All") {
      filtered = filtered.filter(([, countries]) =>
        countries.some((c) => c.region === selectedRegion),
      );
    }

    // 按搜索词筛选（搜索区号或国家名）
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(([code, countries]) => {
        return (
          code.includes(search) ||
          countries.some((c) => c.country.toLowerCase().includes(search))
        );
      });
    }

    // 按区号数字排序
    return filtered.sort(([codeA], [codeB]) => {
      const numA = Number.parseInt(codeA.replace("+", ""));
      const numB = Number.parseInt(codeB.replace("+", ""));
      return numA - numB;
    });
  }, [codeGroups, selectedRegion, searchTerm]);

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

  const handleSelectCode = (code: string) => {
    onSelect(code);
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
        className="relative w-full max-w-3xl h-[85vh] max-h-[600px] sm:max-h-[700px] bg-cyber-gray-900 border-2 border-cyber-brand-500/30 rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(51,102,255,0.3)] animate-in zoom-in slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-cyber-gray-900/95 backdrop-blur-lg border-b border-cyber-gray-700 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-cyber-brand-500/20 rounded-lg flex-shrink-0">
                <Icon
                  icon="lucide:phone"
                  className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-brand-500"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-xl font-bold text-cyber-gray-100 truncate">
                  Select Country Code
                </h2>
                <p className="text-xs sm:text-sm text-cyber-gray-400">
                  {filteredCodeGroups.length} codes
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
              placeholder="Search code or country..."
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
          {/* Left Sidebar - Regions Filter (Hidden on mobile) */}
          <div className="hidden md:block w-48 border-r border-cyber-gray-700 bg-cyber-gray-900/50 overflow-y-auto country-dropdown-scrollbar">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-cyber-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Icon icon="lucide:map" className="w-3 h-3" />
                Regions
              </h3>
              <div className="space-y-1">
                {regions.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
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
          </div>

          {/* Right Content - Code List */}
          <div className="flex-1 overflow-y-auto country-dropdown-scrollbar p-3 sm:p-6">
            {filteredCodeGroups.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {filteredCodeGroups.map(([code, countries]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSelectCode(code)}
                    className={`group flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all ${
                      selectedCode === code
                        ? "bg-cyber-brand-500/10 border-2 border-cyber-brand-500 shadow-lg shadow-cyber-brand-500/20"
                        : "bg-cyber-gray-800 border border-cyber-gray-700 hover:border-cyber-brand-500/50 hover:bg-cyber-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="font-bold text-lg sm:text-xl text-cyber-brand-500 min-w-[50px] sm:min-w-[60px]">
                        {code}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm text-cyber-gray-100 font-medium truncate">
                          {countries.length === 1
                            ? countries[0].country
                            : `${countries.length} countries`}
                        </div>
                        {countries.length > 1 ? (
                          <div className="text-xs text-cyber-gray-500 truncate">
                            {countries.map((c) => c.country).join(", ")}
                          </div>
                        ) : (
                          <div className="text-xs text-cyber-gray-500">
                            {countries[0].region}
                          </div>
                        )}
                      </div>
                    </div>
                    {selectedCode === code && (
                      <Icon
                        icon="lucide:check-circle"
                        className="w-4 h-4 sm:w-5 sm:h-5 text-cyber-brand-500 animate-in zoom-in duration-200 flex-shrink-0"
                      />
                    )}
                  </button>
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
                  No codes found
                </h3>
                <p className="text-sm text-cyber-gray-500 max-w-xs">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRegion("All");
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
              <span className="hidden sm:inline">💡 Tip: Search by code or country name</span>
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

