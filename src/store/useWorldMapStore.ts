import { create } from "zustand";
import type { FeatureCollection, GeometryObject } from "geojson";
import { feature } from "topojson-client";

interface CountUpState {
  count: number;
  targetValue: number;
  isActive: boolean;
  timer: NodeJS.Timeout | null;
}

interface WorldMapState {
  isVisible: boolean;
  worldGeoJSON: FeatureCollection<GeometryObject> | null;
  loading: boolean;
  hoveredCountry: string | null;
  
  // Count up 状态 - 为每个统计项维护独立的状态
  countUpStates: Record<string, CountUpState>;
  
  setIsVisible: (visible: boolean) => void;
  setWorldGeoJSON: (data: FeatureCollection<GeometryObject> | null) => void;
  setLoading: (loading: boolean) => void;
  setHoveredCountry: (country: string | null) => void;
  
  // Count up actions
  startCountUp: (key: string, endValue: number, duration: number) => void;
  stopCountUp: (key: string) => void;
  getCount: (key: string) => number;
  
  // 生命周期
  initializeIntersectionObserver: (element: HTMLDivElement) => void;
  loadWorldMapData: () => Promise<void>;
  cleanup: () => void;
}

export const useWorldMapStore = create<WorldMapState>((set, get) => ({
  isVisible: false,
  worldGeoJSON: null,
  loading: true,
  hoveredCountry: null,
  countUpStates: {},
  
  setIsVisible: (visible: boolean) => set({ isVisible: visible }),
  setWorldGeoJSON: (data: FeatureCollection<GeometryObject> | null) =>
    set({ worldGeoJSON: data }),
  setLoading: (loading: boolean) => set({ loading }),
  setHoveredCountry: (country: string | null) => set({ hoveredCountry: country }),
  
  startCountUp: (key: string, endValue: number, duration: number) => {
    const { countUpStates, stopCountUp } = get();
    
    // 如果已经在运行,先停止
    if (countUpStates[key]?.timer) {
      stopCountUp(key);
    }
    
    let start = 0;
    const increment = endValue / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      
      if (start >= endValue) {
        set((state) => ({
          countUpStates: {
            ...state.countUpStates,
            [key]: {
              ...state.countUpStates[key],
              count: endValue,
              isActive: false,
            },
          },
        }));
        stopCountUp(key);
      } else {
        set((state) => ({
          countUpStates: {
            ...state.countUpStates,
            [key]: {
              ...state.countUpStates[key],
              count: Math.floor(start),
            },
          },
        }));
      }
    }, 16);
    
    set((state) => ({
      countUpStates: {
        ...state.countUpStates,
        [key]: {
          count: 0,
          targetValue: endValue,
          isActive: true,
          timer,
        },
      },
    }));
  },
  
  stopCountUp: (key: string) => {
    const { countUpStates } = get();
    const state = countUpStates[key];
    
    if (state?.timer) {
      clearInterval(state.timer);
      set((prevState) => ({
        countUpStates: {
          ...prevState.countUpStates,
          [key]: {
            ...state,
            timer: null,
            isActive: false,
          },
        },
      }));
    }
  },
  
  getCount: (key: string) => {
    const { countUpStates } = get();
    return countUpStates[key]?.count || 0;
  },
  
  initializeIntersectionObserver: (element: HTMLDivElement) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          set({ isVisible: true });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    observer.observe(element);
  },
  
  loadWorldMapData: async () => {
    try {
      set({ loading: true });
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
      );
      const topoData = await response.json();
      
      // 将 TopoJSON 转换为 GeoJSON
      const countries = feature(
        topoData,
        topoData.objects.countries
      ) as unknown as FeatureCollection<GeometryObject>;
      
      set({ worldGeoJSON: countries, loading: false });
    } catch (error) {
      console.error("Error loading world map data:", error);
      set({ loading: false });
    }
  },
  
  cleanup: () => {
    const { countUpStates } = get();
    
    // 清理所有 count up 定时器
    Object.keys(countUpStates).forEach((key) => {
      const state = countUpStates[key];
      if (state?.timer) {
        clearInterval(state.timer);
      }
    });
    
    set({ countUpStates: {} });
  },
}));

