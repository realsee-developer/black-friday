import { create } from "zustand";

interface ProductState {
  expandedProduct: string | null;
  showMobileDetails: string | null;

  toggleExpand: (productId: string) => void;
  showDetails: (productId: string) => void;
  hideDetails: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  expandedProduct: null,
  showMobileDetails: null,

  toggleExpand: (productId: string) =>
    set((state) => ({
      expandedProduct: state.expandedProduct === productId ? null : productId,
    })),

  showDetails: (productId: string) => set({ showMobileDetails: productId }),

  hideDetails: () => set({ showMobileDetails: null }),
}));
