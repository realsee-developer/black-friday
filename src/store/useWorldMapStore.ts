import type { FeatureCollection, GeometryObject } from "geojson";
import { feature } from "topojson-client";
import { create } from "zustand";

interface WorldMapState {
  worldGeoJSON: FeatureCollection<GeometryObject> | null;
  loading: boolean;
  hoveredCountry: string | null;

  setWorldGeoJSON: (data: FeatureCollection<GeometryObject> | null) => void;
  setLoading: (loading: boolean) => void;
  setHoveredCountry: (country: string | null) => void;
  loadWorldMapData: () => Promise<void>;
}

export const useWorldMapStore = create<WorldMapState>((set) => ({
  worldGeoJSON: null,
  loading: true,
  hoveredCountry: null,

  setWorldGeoJSON: (data: FeatureCollection<GeometryObject> | null) =>
    set({ worldGeoJSON: data }),
  setLoading: (loading: boolean) => set({ loading }),
  setHoveredCountry: (country: string | null) =>
    set({ hoveredCountry: country }),

  loadWorldMapData: async () => {
    try {
      set({ loading: true });
      const response = await fetch("/countries-110m.json");
      const topoData = await response.json();

      // 将 TopoJSON 转换为 GeoJSON
      const countries = feature(
        topoData,
        topoData.objects.countries,
      ) as unknown as FeatureCollection<GeometryObject>;

      set({ worldGeoJSON: countries, loading: false });
    } catch (error) {
      console.error("Error loading world map data:", error);
      set({ loading: false });
    }
  },
}));
