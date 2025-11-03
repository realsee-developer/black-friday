"use client";

import { useEffect, useRef, useState } from "react";
import { geoPath, geoMercator } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, GeometryObject } from "geojson";
import { GLOBAL_STATS } from "@/lib/constants";

function useCountUp(end: number, duration: number, isVisible: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = end / (duration / 16); // 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, isVisible]);

  return count;
}

// 有业务的国家列表（使用 ISO 3166-1 numeric 代码）
const COVERED_COUNTRIES = new Set([
  // 北美
  840, // United States
  124, // Canada
  484, // Mexico
  
  // 南美
  76,  // Brazil
  32,  // Argentina
  152, // Chile
  
  // 欧洲
  826, // United Kingdom
  276, // Germany
  250, // France
  380, // Italy
  724, // Spain
  528, // Netherlands
  56,  // Belgium
  756, // Switzerland
  40,  // Austria
  752, // Sweden
  578, // Norway
  208, // Denmark
  616, // Poland
  
  // 中东
  784, // United Arab Emirates
  682, // Saudi Arabia
  634, // Qatar
  414, // Kuwait
  376, // Israel
  
  // 非洲
  710, // South Africa
  818, // Egypt
  404, // Kenya
  566, // Nigeria
  
  // 亚洲
  156, // China
  392, // Japan
  410, // South Korea
  158, // Taiwan
  344, // Hong Kong
  446, // Macau
  356, // India
  702, // Singapore
  458, // Malaysia
  764, // Thailand
  704, // Vietnam
  608, // Philippines
  360, // Indonesia
  
  // 大洋洲
  36,  // Australia
  554, // New Zealand
  
  // 其他
  792, // Turkey
]);

interface WorldMapProps {
  className?: string;
}

export function WorldMap({ className }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [worldGeoJSON, setWorldGeoJSON] = useState<FeatureCollection<GeometryObject> | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 加载真实的世界地图 TopoJSON 数据
  useEffect(() => {
    const loadWorldMap = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
        );
        const topoData = await response.json();
        
        // 将 TopoJSON 转换为 GeoJSON
        const countries = feature(topoData, topoData.objects.countries) as unknown as FeatureCollection<GeometryObject>;
        
        // 统计有业务的国家
        const coveredCount = countries.features.filter((f: any) => {
          const id = typeof f.id === 'string' ? parseInt(f.id, 10) : f.id;
          return COVERED_COUNTRIES.has(id);
        }).length;
        console.log('Covered countries:', coveredCount);
        
        setWorldGeoJSON(countries);
        setLoading(false);
      } catch (error) {
        console.error("Error loading world map data:", error);
        setLoading(false);
      }
    };

    loadWorldMap();
  }, []);

  // 创建地图投影 - 向北移动中心点，裁剪南极洲
  const width = 1200;
  const height = 600;
  const projection = geoMercator()
    .scale(140)
    .translate([width / 2, height / 1.8])
    .center([0, 30]);
  
  const pathGenerator = geoPath().projection(projection);

  return (
    <div ref={containerRef} className={`relative w-full ${className || ""}`}>
      <div className="relative w-full bg-black overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-cyber-gray-400">Loading map data...</div>
          </div>
        )}
        
        {/* 地图 SVG - 铺满整个容器 */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* 发光滤镜 */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* 强发光滤镜 */}
            <filter id="strong-glow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 网格背景 */}
          <g opacity="0.04">
            {[...Array(31)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 20}
                x2={width}
                y2={i * 20}
                stroke="#3366FF"
                strokeWidth="0.5"
              />
            ))}
            {[...Array(61)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 20}
                y1="0"
                x2={i * 20}
                y2={height}
                stroke="#3366FF"
                strokeWidth="0.5"
              />
            ))}
          </g>

          {/* 真实的世界地图 */}
          {worldGeoJSON && (
            <g id="world-countries">
              {worldGeoJSON.features.map((country: any, index: number) => {
                const countryId = country.id;
                const countryIdNum = typeof countryId === 'string' ? parseInt(countryId, 10) : countryId;
                const isCovered = COVERED_COUNTRIES.has(countryIdNum);
                const isHovered = hoveredCountry === countryId;
                
                return (
                  <path
                    key={`country-${index}`}
                    d={pathGenerator(country) || ""}
                    fill={isCovered ? "#00D9FF" : "none"}
                    fillOpacity={isCovered ? (isHovered ? "1" : "0.85") : "0"}
                    stroke={isCovered ? "#00D9FF" : "#3366FF"}
                    strokeWidth={isCovered ? "2.5" : "0.5"}
                    strokeOpacity={isCovered ? "1" : "0.5"}
                    filter={isCovered ? (isHovered ? "url(#strong-glow)" : "url(#glow)") : "none"}
                    className="country-path transition-all duration-300"
                    style={{
                      animation: isVisible && isCovered
                        ? `fadeIn 0.8s ease ${(index % 20) * 0.05}s forwards`
                        : "none",
                      cursor: isCovered ? "pointer" : "default",
                    }}
                    onMouseEnter={() => isCovered && setHoveredCountry(countryId)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* 统计数据居中叠加 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="max-w-5xl w-full px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {GLOBAL_STATS.map((stat, index) => {
                const count = useCountUp(stat.value, 2000, isVisible);
                const displayValue =
                  stat.label === "Spaces Scanned"
                    ? `${Math.floor(count / 1000000)}M`
                    : count.toLocaleString();

                return (
                  <div
                    key={stat.label}
                    className="pointer-events-auto backdrop-blur-md bg-black/70 border border-cyber-brand-500/40 rounded-lg p-6 text-center hover:bg-black/85 hover:border-cyber-brand-500/60 transition-all duration-300"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateY(0)" : "translateY(20px)",
                      transition: `all 0.6s ease ${index * 0.1}s`,
                    }}
                  >
                    <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#ffffff' }}>
                      {displayValue}
                      {stat.suffix || ""}
                    </div>
                    <div className="text-sm md:text-base text-cyber-gray-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            fill-opacity: 0;
          }
          to {
            opacity: 1;
            fill-opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
}
