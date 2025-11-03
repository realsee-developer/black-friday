/**
 * UI 相关类型
 */
export interface UIState {
  isMobileMenuOpen: boolean;
  activeSection: string;
  isScrolling: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  setActiveSection: (section: string) => void;
  setScrolling: (isScrolling: boolean) => void;
}

/**
 * Debug 相关类型
 */
export interface DebugState {
  isDebugMode: boolean;
  mockTime: Date | null;
  setDebugMode: (enabled: boolean) => void;
  setMockTime: (time: Date | null) => void;
}

/**
 * 表单相关类型
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  country?: string;
  companyName?: string;
  industry: string;
  message: string;
  devicesUsed?: string;
}

export interface FormState {
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitSuccess: (success: boolean) => void;
  setSubmitError: (error: string | null) => void;
  resetForm: () => void;
}

/**
 * CRO 相关类型
 */
export interface CROState {
  variant: "A" | "B";
  events: CROEvent[];
  addEvent: (event: Omit<CROEvent, "timestamp">) => void;
}

export interface CROEvent {
  type: "click" | "view" | "submit" | "scroll";
  target: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

/**
 * 倒计时状态类型
 */
export type CountdownPhase = "before" | "active" | "ending" | "ended";

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}
