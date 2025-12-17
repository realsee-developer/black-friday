"use client";

import { geoMercator, geoPath } from "d3-geo";
import type { Feature } from "geojson";
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

interface ChristmasWorldMapProps {
  className?: string;
}

export function ChristmasWorldMap({ className }: ChristmasWorldMapProps) {
  // 使用 react-intersection-observer 检测可见性
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  const worldGeoJSON = useWorldMapStore((state) => state.worldGeoJSON);
  const hoveredCountry = useWorldMapStore((state) => state.hoveredCountry);

  // 创建地图投影
  const width = 1200;
  const height = 600;
  const projection = geoMercator()
    .scale(140)
    .translate([width / 2, height / 1.8])
    .center([0, 30]);

  const pathGenerator = geoPath().projection(projection);

  return (
    <div
      ref={inViewRef}
      className={`relative w-full pt-16 sm:pt-20 ${className || ""}`}
    >
      {/* 标题区块 - 圣诞主题金色渐变 */}
      <div className="text-center mb-12">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          style={{
            background:
              "linear-gradient(135deg, #d4a853 0%, #ffd700 50%, #d4a853 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Trusted 3D Tour Solution for Global Business
        </h2>
      </div>

      {/* 外层容器 */}
      <div className="flex flex-col md:relative md:block">
        {/* 统计数据 */}
        <div className="mb-6 md:mb-0 md:absolute md:inset-0 md:flex md:items-center md:justify-center md:pointer-events-none md:z-10">
          <div className="max-w-5xl w-full mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-6">
              {GLOBAL_STATS.map((stat, index) => {
                const isSpacesScanned = stat.label === "Spaces Scanned";
                const endValue = isSpacesScanned
                  ? stat.value / 1000000
                  : stat.value;
                const suffix = isSpacesScanned ? "M" : stat.suffix || "";

                return (
                  <div
                    key={stat.label}
                    className="md:pointer-events-auto p-2 md:backdrop-blur-md md:bg-black/70 md:border md:border-[var(--color-christmas-gold)]/40 md:rounded-lg md:p-6 text-center md:hover:bg-black/85 md:hover:border-[var(--color-christmas-gold)]/60 transition-all duration-300"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? "translateY(0)" : "translateY(20px)",
                      transition: `all 0.6s ease ${index * 0.1}s`,
                    }}
                  >
                    {/* 数字 - 金色渐变 */}
                    <div
                      className="text-2xl sm:text-3xl md:text-5xl font-bold mb-1 md:mb-2"
                      style={{
                        background:
                          "linear-gradient(135deg, #d4a853 0%, #ffd700 50%, #d4a853 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
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
                    <div className="text-xs sm:text-sm md:text-base text-[var(--color-christmas-snow)]/80 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 地图 SVG - 圣诞主题 */}
        <div
          className="relative w-full overflow-hidden"
          style={{ backgroundColor: "#0a0505" }}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Global coverage map showing Realsee service areas"
          >
            <title>Realsee Global Coverage Map - Christmas Edition</title>
            <defs>
              {/* 圣诞红发光滤镜 */}
              <filter id="christmas-glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* 强发光滤镜 - 金色 */}
              <filter id="christmas-strong-glow">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 网格背景 - 金色细线 */}
            <g opacity="0.06">
              {[...Array(31)].map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={i * 20}
                  x2={width}
                  y2={i * 20}
                  stroke="#d4a853"
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
                  stroke="#d4a853"
                  strokeWidth="0.5"
                />
              ))}
            </g>

            {/* 世界地图 - 圣诞配色 */}
            <g id="christmas-world-countries">
              {worldGeoJSON.features.map((country: Feature, index: number) => {
                const countryId = country.id;
                const countryIdNum =
                  typeof countryId === "string"
                    ? parseInt(countryId, 10)
                    : countryId;
                const isCovered =
                  countryIdNum !== undefined &&
                  COVERED_COUNTRIES.has(countryIdNum);
                const isHovered = hoveredCountry === countryId;

                return (
                  <path
                    key={`country-${index}`}
                    d={pathGenerator(country) || ""}
                    fill={isCovered ? "#c41e3a" : "none"}
                    fillOpacity={isCovered ? (isHovered ? "1" : "0.85") : "0"}
                    stroke={isCovered ? "#d4a853" : "#2a1515"}
                    strokeWidth={isCovered ? "2" : "0.5"}
                    strokeOpacity={isCovered ? "1" : "0.6"}
                    filter={
                      isCovered
                        ? isHovered
                          ? "url(#christmas-strong-glow)"
                          : "url(#christmas-glow)"
                        : "none"
                    }
                    className="country-path transition-all duration-300"
                    style={{
                      animation:
                        inView && isCovered
                          ? `christmasFadeIn 0.8s ease ${
                              (index % 20) * 0.05
                            }s forwards`
                          : "none",
                      cursor: isCovered ? "pointer" : "default",
                    }}
                    onMouseEnter={() =>
                      isCovered &&
                      countryId !== undefined &&
                      useWorldMapStore
                        .getState()
                        .setHoveredCountry(String(countryId))
                    }
                    onMouseLeave={() =>
                      useWorldMapStore.getState().setHoveredCountry(null)
                    }
                  />
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes christmasFadeIn {
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
