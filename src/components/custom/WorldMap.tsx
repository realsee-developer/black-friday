"use client";

import { geoMercator, geoPath } from "d3-geo";
import type { Feature } from "geojson";
import { useEffect } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { GLOBAL_STATS } from "@/lib/constants";
import { useWorldMapStore } from "@/store/useWorldMapStore";

// 有业务的国家列表（使用 ISO 3166-1 numeric 代码）
const COVERED_COUNTRIES = new Set([
  // 亚洲
  156, // China 中国
  344, // Hong Kong 中国香港
  158, // Taiwan 中国台湾
  392, // Japan 日本
  410, // South Korea 韩国

  // 中东
  376, // Israel 以色列
  196, // Cyprus 塞浦路斯
  682, // Saudi Arabia 沙特
  512, // Oman 阿曼
  784, // United Arab Emirates 阿联酋
  422, // Lebanon 黎巴嫩
  792, // Turkey 土耳其

  // 东南亚
  702, // Singapore 新加坡
  458, // Malaysia 马来西亚
  764, // Thailand 泰国
  360, // Indonesia 印尼
  704, // Vietnam 越南
  116, // Cambodia 柬埔寨
  608, // Philippines 菲律宾
  356, // India 印度
  144, // Sri Lanka 斯里兰卡

  // 欧洲
  276, // Germany 德国
  756, // Switzerland 瑞士
  616, // Poland 波兰
  826, // United Kingdom 英国
  372, // Ireland 爱尔兰
  578, // Norway 挪威
  191, // Croatia 克罗地亚
  348, // Hungary 匈牙利
  250, // France 法国
  528, // Netherlands 荷兰
  208, // Denmark 丹麦
  233, // Estonia 爱沙尼亚
  56, // Belgium 比利时
  300, // Greece 希腊
  380, // Italy 意大利
  724, // Spain 西班牙
  620, // Portugal 葡萄牙
  688, // Serbia 塞尔维亚

  // 非洲
  710, // South Africa 南非
  788, // Tunisia 突尼斯
  384, // Ivory Coast 科特迪瓦
  686, // Senegal 塞内加尔
  12, // Algeria 阿尔及利亚

  // 北美
  840, // United States 美国
  124, // Canada 加拿大

  // 拉美
  484, // Mexico 墨西哥
  32, // Argentina 阿根廷
  188, // Costa Rica 哥斯达黎加
  76, // Brazil 巴西
  218, // Ecuador 厄瓜多尔
  604, // Peru 秘鲁
  170, // Colombia 哥伦比亚
  68, // Bolivia 玻利维亚

  // 大洋洲
  36, // Australia 澳大利亚
  554, // New Zealand 新西兰
]);

interface WorldMapProps {
  className?: string;
}

export function WorldMap({ className }: WorldMapProps) {
  // 使用 react-intersection-observer 检测可见性
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false, // 每次进入都触发
  });

  const worldGeoJSON = useWorldMapStore((state) => state.worldGeoJSON);
  const loading = useWorldMapStore((state) => state.loading);
  const hoveredCountry = useWorldMapStore((state) => state.hoveredCountry);

  useEffect(() => {
    const { loadWorldMapData } = useWorldMapStore.getState();
    loadWorldMapData();
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
    <div ref={inViewRef} className={`relative w-full ${className || ""}`}>
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
          role="img"
          aria-label="Global coverage map showing Realsee service areas"
        >
          <title>Realsee Global Coverage Map</title>
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
              {worldGeoJSON.features.map((country: Feature, index: number) => {
                const countryId = country.id;
                const countryIdNum =
                  typeof countryId === "string"
                    ? parseInt(countryId, 10)
                    : countryId;
                const isCovered = countryIdNum !== undefined && COVERED_COUNTRIES.has(countryIdNum);
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
                    filter={
                      isCovered
                        ? isHovered
                          ? "url(#strong-glow)"
                          : "url(#glow)"
                        : "none"
                    }
                    className="country-path transition-all duration-300"
                    style={{
                      animation:
                        inView && isCovered
                          ? `fadeIn 0.8s ease ${(index % 20) * 0.05}s forwards`
                          : "none",
                      cursor: isCovered ? "pointer" : "default",
                    }}
                    onMouseEnter={() =>
                      isCovered && countryId !== undefined &&
                      useWorldMapStore.getState().setHoveredCountry(String(countryId))
                    }
                    onMouseLeave={() =>
                      useWorldMapStore.getState().setHoveredCountry(null)
                    }
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
                // Spaces Scanned 显示为百万单位
                const isSpacesScanned = stat.label === "Spaces Scanned";
                const endValue = isSpacesScanned
                  ? stat.value / 1000000
                  : stat.value;
                const suffix = isSpacesScanned ? "M" : stat.suffix || "";

                return (
                  <div
                    key={stat.label}
                    className="pointer-events-auto backdrop-blur-md bg-black/70 border border-cyber-brand-500/40 rounded-lg p-6 text-center hover:bg-black/85 hover:border-cyber-brand-500/60 transition-all duration-300"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? "translateY(0)" : "translateY(20px)",
                      transition: `all 0.6s ease ${index * 0.1}s`,
                    }}
                  >
                    <div
                      className="text-4xl md:text-5xl font-bold mb-2"
                      style={{ color: "#ffffff" }}
                    >
                      {inView ? (
                        <CountUp
                          key={`${stat.label}-${inView}`}
                          start={0}
                          end={endValue}
                          duration={2.5}
                          separator=","
                          suffix={suffix}
                          decimals={0}
                          useEasing={true}
                        />
                      ) : (
                        `0${suffix}`
                      )}
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
