import { create } from "zustand";
import type { FormState } from "@/types";

export const useFormStore = create<FormState>((set) => ({
  isSubmitting: false,
  submitSuccess: false,
  submitError: null,

  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSubmitSuccess: (success) => set({ submitSuccess: success }),
  setSubmitError: (error) => set({ submitError: error }),
  resetForm: () =>
    set({
      isSubmitting: false,
      submitSuccess: false,
      submitError: null,
    }),
}));
