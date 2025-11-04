import { create } from "zustand";
import { KOL_VIDEOS } from "@/lib/constants";
import type { KOLStats, VideoExposureResponse } from "@/types/kol-exposure";

interface KolStatsState {
  stats: KOLStats[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string;
  environment: string;

  setStats: (stats: KOLStats[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdated: (lastUpdated: string) => void;
  setEnvironment: (environment: string) => void;

  fetchStats: () => Promise<void>;
}

export const useKolStatsStore = create<KolStatsState>((set, _get) => ({
  stats: [],
  isLoading: true,
  error: null,
  lastUpdated: "",
  environment: "",

  setStats: (stats: KOLStats[]) => set({ stats }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  setLastUpdated: (lastUpdated: string) => set({ lastUpdated }),
  setEnvironment: (environment: string) => set({ environment }),

  fetchStats: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/kol-exposure");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: VideoExposureResponse = await response.json();

      // 构建统计数据
      const statsData: KOLStats[] = data.videos
        .map((video) => {
          const kolVideo = KOL_VIDEOS.find((v) => v.id === video.videoId);
          return {
            videoId: video.videoId,
            youtubeId: kolVideo?.youtubeId || "",
            title: kolVideo?.title || "Unknown",
            creator: kolVideo?.creator || "Unknown",
            exposureCount: video.count,
          };
        })
        .sort((a, b) => a.exposureCount - b.exposureCount);

      set({
        stats: statsData,
        lastUpdated: new Date().toLocaleString("zh-CN", {
          timeZone: "Asia/Shanghai",
        }),
        environment: data.environment || "Unknown",
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch statistics",
        isLoading: false,
      });
    }
  },
}));
