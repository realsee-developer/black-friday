import { create } from "zustand";
import { throttle } from "@/lib/utils";
import { NAV_TABS } from "@/lib/constants";
import type { UIState } from "@/types";

export const useUIStore = create<UIState>((set, get) => ({
  isMobileMenuOpen: false,
  activeSection: "offers",
  isScrolling: false,
  isScrolled: false,
  scrollHandler: null,

  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  setActiveSection: (section) => set({ activeSection: section }),
  setScrolling: (isScrolling) => set({ isScrolling }),
  setScrolled: (isScrolled) => set({ isScrolled }),
  
  initializeScrollListener: () => {
    const handler = throttle(() => {
      const { setScrolled, setActiveSection } = get();
      setScrolled(window.scrollY > 20);
      
      // 找到当前激活的区域
      const sections = NAV_TABS.map((tab) => document.querySelector(tab.href));
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const { offsetTop } = section as HTMLElement;
          if (scrollPosition >= offsetTop) {
            setActiveSection(NAV_TABS[i].id);
            break;
          }
        }
      }
    }, 100);
    
    window.addEventListener("scroll", handler);
    set({ scrollHandler: handler });
  },
  
  cleanupScrollListener: () => {
    const { scrollHandler } = get();
    if (scrollHandler) {
      window.removeEventListener("scroll", scrollHandler);
      set({ scrollHandler: null });
    }
  },
}));
