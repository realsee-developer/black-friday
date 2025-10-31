import { create } from "zustand";
import type { UIState } from "@/types";

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  activeSection: "offers",
  isScrolling: false,

  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  setActiveSection: (section) => set({ activeSection: section }),
  setScrolling: (isScrolling) => set({ isScrolling }),
}));
