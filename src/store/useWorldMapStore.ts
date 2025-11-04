import type { FeatureCollection, GeometryObject } from "geojson";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { create } from "zustand";
import topoData from '@/data/countries-110m.json';

// 在模块加载时就转换数据
const initialWorldGeoJSON = feature(
  topoData as unknown as Topology<{ countries: GeometryCollection }>,
  (topoData as any).objects.countries,
) as unknown as FeatureCollection<GeometryObject>;

interface WorldMapState {
  worldGeoJSON: FeatureCollection<GeometryObject>;
  hoveredCountry: string | null;

  setHoveredCountry: (country: string | null) => void;
}

export const useWorldMapStore = create<WorldMapState>((set) => ({
  worldGeoJSON: initialWorldGeoJSON,
  hoveredCountry: null,

  setHoveredCountry: (country: string | null) =>
    set({ hoveredCountry: country }),
}));
