import { create } from "zustand";
import type { FeatureCollection, GeometryObject } from "geojson";
import { feature } from "topojson-client";

interface CountUpState {
  count: number;
  targetValue: number;
  isActive: boolean;
  animationFrameId: number | null;
}

interface WorldMapState {
  isVisible: boolean;
  worldGeoJSON: FeatureCollection<GeometryObject> | null;
  loading: boolean;
  hoveredCountry: string | null;
  observer: IntersectionObserver | null;
  hasAnimated: boolean;
  
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
  resetAnimation: () => void;
  
  // 生命周期
  initializeIntersectionObserver: (element: HTMLDivElement) => void;
  loadWorldMapData: () => Promise<void>;
  cleanup: () => void;
}

// 缓动函数 - 使动画更自然
const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

export const useWorldMapStore = create<WorldMapState>((set, get) => ({
  isVisible: false,
  worldGeoJSON: null,
  loading: true,
  hoveredCountry: null,
  observer: null,
  hasAnimated: false,
  countUpStates: {},
  
  setIsVisible: (visible: boolean) => set({ isVisible: visible }),
  setWorldGeoJSON: (data: FeatureCollection<GeometryObject> | null) =>
    set({ worldGeoJSON: data }),
  setLoading: (loading: boolean) => set({ loading }),
  setHoveredCountry: (country: string | null) => set({ hoveredCountry: country }),
  
  startCountUp: (key: string, endValue: number, duration: number) => {
    const { countUpStates, stopCountUp } = get();
    
    // 如果已经在运行,先停止
    if (countUpStates[key]?.animationFrameId) {
      stopCountUp(key);
    }
    
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数使动画更丝滑
      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.floor(easedProgress * endValue);
      
      set((state) => ({
        countUpStates: {
          ...state.countUpStates,
          [key]: {
            ...state.countUpStates[key],
            count: currentValue,
            isActive: progress < 1,
          },
        },
      }));
      
      if (progress < 1) {
        const animationFrameId = requestAnimationFrame(animate);
        set((state) => ({
          countUpStates: {
            ...state.countUpStates,
            [key]: {
              ...state.countUpStates[key],
              animationFrameId,
            },
          },
        }));
      } else {
        // 动画完成，确保显示最终值
        set((state) => ({
          countUpStates: {
            ...state.countUpStates,
            [key]: {
              ...state.countUpStates[key],
              count: endValue,
              isActive: false,
              animationFrameId: null,
            },
          },
        }));
      }
    };
    
    // 初始化状态
    set((state) => ({
      countUpStates: {
        ...state.countUpStates,
        [key]: {
          count: 0,
          targetValue: endValue,
          isActive: true,
          animationFrameId: null,
        },
      },
    }));
    
    // 开始动画
    const animationFrameId = requestAnimationFrame(animate);
    set((state) => ({
      countUpStates: {
        ...state.countUpStates,
        [key]: {
          ...state.countUpStates[key],
          animationFrameId,
        },
      },
    }));
  },
  
  stopCountUp: (key: string) => {
    const { countUpStates } = get();
    const state = countUpStates[key];
    
    if (state?.animationFrameId) {
      cancelAnimationFrame(state.animationFrameId);
      set((prevState) => ({
        countUpStates: {
          ...prevState.countUpStates,
          [key]: {
            ...state,
            animationFrameId: null,
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
  
  resetAnimation: () => {
    const { countUpStates } = get();
    
    // 停止所有正在运行的动画
    Object.keys(countUpStates).forEach((key) => {
      const state = countUpStates[key];
      if (state?.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }
    });
    
    // 重置所有状态
    set({ 
      isVisible: false, 
      hasAnimated: false,
      countUpStates: {} 
    });
  },
  
  initializeIntersectionObserver: (element: HTMLDivElement) => {
    // 清理旧的 observer
    const oldObserver = get().observer;
    if (oldObserver) {
      oldObserver.disconnect();
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const { hasAnimated } = get();
        
        if (entry.isIntersecting && !hasAnimated) {
          // 进入视口且未动画过，开始动画
          set({ isVisible: true, hasAnimated: true });
        } else if (!entry.isIntersecting && hasAnimated) {
          // 离开视口且已经动画过，重置状态以便下次进入时重新触发
          const { resetAnimation } = get();
          resetAnimation();
        }
      },
      { 
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px' // 向上留100px边距，确保用户真正看到内容
      }
    );
    
    observer.observe(element);
    set({ observer });
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
    const { countUpStates, observer } = get();
    
    // 清理所有动画帧
    Object.keys(countUpStates).forEach((key) => {
      const state = countUpStates[key];
      if (state?.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }
    });
    
    // 断开 IntersectionObserver
    if (observer) {
      observer.disconnect();
    }
    
    set({ 
      countUpStates: {},
      observer: null,
      isVisible: false,
      hasAnimated: false
    });
  },
}));

