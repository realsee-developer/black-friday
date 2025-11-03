import { create } from "zustand";
import type { KOLVideo } from "@/lib/constants";
import type { VideoExposureResponse } from "@/types/kol-exposure";

interface TestimonialState {
  // 轮播状态
  currentPage: number;
  paused: boolean;
  itemsPerPage: number;
  prefersReducedMotion: boolean;
  touchStart: { x: number; y: number } | null;
  
  // 视频排序状态
  sortedVideos: KOLVideo[];
  isLoadingOrder: boolean;
  
  // 曝光追踪状态 - 使用普通对象而非 Set,避免引用问题
  exposedVideos: Record<string, boolean>;
  pendingExposures: string[];
  
  // 定时器和观察器引用
  submitTimerRef: number | null;
  
  // Actions
  setCurrentPage: (page: number) => void;
  setPaused: (paused: boolean) => void;
  setItemsPerPage: (items: number) => void;
  setTouchStart: (touchStart: { x: number; y: number } | null) => void;
  setSortedVideos: (videos: KOLVideo[]) => void;
  setIsLoadingOrder: (loading: boolean) => void;
  setPrefersReducedMotion: (value: boolean) => void;
  
  goToPage: (page: number, totalPages: number) => void;
  nextPage: (totalPages: number) => void;
  prevPage: (totalPages: number) => void;
  
  markVideoExposed: (videoId: string) => void;
  submitExposures: () => Promise<void>;
  
  initialize: (kolVideos: KOLVideo[]) => void;
  fetchVideoOrder: (kolVideos: KOLVideo[]) => Promise<void>;
  cleanup: () => void;
}

export const useTestimonialStore = create<TestimonialState>((set, get) => ({
  // 初始状态
  currentPage: 0,
  paused: false,
  itemsPerPage: 2,
  prefersReducedMotion: false,
  touchStart: null,
  
  sortedVideos: [],
  isLoadingOrder: true,
  
  exposedVideos: {},
  pendingExposures: [],
  
  submitTimerRef: null,
  
  // 基础状态设置
  setCurrentPage: (page) => set({ currentPage: page }),
  setPaused: (paused) => set({ paused }),
  setItemsPerPage: (items) => set({ itemsPerPage: items }),
  setTouchStart: (touchStart) => set({ touchStart }),
  setSortedVideos: (videos) => set({ sortedVideos: videos }),
  setIsLoadingOrder: (loading) => set({ isLoadingOrder: loading }),
  setPrefersReducedMotion: (value) => set({ prefersReducedMotion: value }),
  
  // 轮播控制
  goToPage: (page, totalPages) => {
    if (page >= 0 && page < totalPages) {
      set({ currentPage: page });
    }
  },
  
  nextPage: (totalPages) => {
    const { currentPage } = get();
    set({ currentPage: (currentPage + 1) % totalPages });
  },
  
  prevPage: (totalPages) => {
    const { currentPage } = get();
    set({ currentPage: (currentPage - 1 + totalPages) % totalPages });
  },
  
  // 视频曝光管理 - 简化版本
  markVideoExposed: (videoId) => {
    const state = get();
    if (!state.exposedVideos[videoId]) {
      set({
        exposedVideos: { ...state.exposedVideos, [videoId]: true },
        pendingExposures: [...state.pendingExposures, videoId],
      });
    }
  },
  
  submitExposures: async () => {
    const { pendingExposures } = get();
    if (pendingExposures.length === 0) return;

    try {
      await fetch("/api/kol-exposure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoIds: pendingExposures }),
      });
      set({ pendingExposures: [] });
    } catch (error) {
      console.error("Error submitting exposures:", error);
    }
  },
  
  // 初始化
  initialize: (kolVideos) => {
    const { fetchVideoOrder } = get();
    
    // 设置 prefers-reduced-motion
    if (typeof window !== "undefined") {
      try {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        set({ prefersReducedMotion: mediaQuery.matches });
      } catch {}
    }
    
    // 获取视频顺序
    fetchVideoOrder(kolVideos);
    
    // 启动提交定时器
    const timerId = window.setInterval(() => {
      get().submitExposures();
    }, 30000);
    set({ submitTimerRef: timerId });
  },
  
  fetchVideoOrder: async (kolVideos) => {
    try {
      const response = await fetch("/api/kol-exposure");
      if (!response.ok) {
        throw new Error("Failed to fetch video order");
      }
      
      const data: VideoExposureResponse = await response.json();
      
      const sortedByExposure = data.videos
        .map((exposure) => kolVideos.find((v) => v.id === exposure.videoId))
        .filter((v): v is KOLVideo => v !== undefined);
      
      const missingVideos = kolVideos.filter(
        (v) => !sortedByExposure.find((sv) => sv.id === v.id)
      );
      
      set({ 
        sortedVideos: [...sortedByExposure, ...missingVideos],
        isLoadingOrder: false 
      });
    } catch (error) {
      console.error("Error fetching video order:", error);
      const shuffled = [...kolVideos].sort(() => Math.random() - 0.5);
      set({ 
        sortedVideos: shuffled,
        isLoadingOrder: false 
      });
    }
  },
  
  cleanup: () => {
    const { submitTimerRef, submitExposures } = get();
    if (submitTimerRef) {
      window.clearInterval(submitTimerRef);
    }
    submitExposures(); // 提交剩余的曝光记录
  },
}));
