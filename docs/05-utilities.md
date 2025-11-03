# 工具函数与类型定义文档 - Black Friday 网站

## 一、时间处理工具

### 1.1 美东时间转换

**文件**: `src/lib/time.ts`

```typescript
/**
 * 获取美东时间（EST/EDT）
 * EST: UTC-5 (11月第一个周日 - 3月第二个周日)
 * EDT: UTC-4 (3月第二个周日 - 11月第一个周日)
 */
export function getEasternTime(date: Date = new Date()): Date {
  // 使用 Intl.DateTimeFormat 自动处理夏令时
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  const parts = formatter.formatToParts(date);
  const values: Record<string, string> = {};
  
  for (const part of parts) {
    if (part.type !== 'literal') {
      values[part.type] = part.value;
    }
  }
  
  return new Date(
    `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`
  );
}

/**
 * 创建美东时间
 */
export function createEasternDate(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0
): Date {
  // 创建一个美东时间的日期字符串
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  
  // 使用 Date 构造函数并指定时区
  return new Date(dateStr + '-05:00'); // EST 固定偏移（简化版）
}

/**
 * 倒计时阶段定义
 */
export type CountdownStage = 'before' | 'active' | 'ending' | 'ended';

/**
 * 活动时间配置
 */
export const EVENT_DATES = {
  // 开始倒计时显示时间
  COUNTDOWN_START: createEasternDate(2025, 11, 10, 0, 0, 0),
  
  // 活动开始时间
  EVENT_START: createEasternDate(2025, 11, 17, 0, 0, 0),
  
  // 结束倒计时显示时间
  COUNTDOWN_ENDING: createEasternDate(2025, 12, 1, 0, 0, 0),
  
  // 活动结束时间
  EVENT_END: createEasternDate(2025, 12, 7, 23, 59, 59),
} as const;

/**
 * 获取当前倒计时阶段
 */
export function getCountdownStage(currentTime: Date = new Date()): CountdownStage {
  const now = getEasternTime(currentTime);
  
  if (now < EVENT_DATES.EVENT_START) {
    return 'before';
  }
  
  if (now >= EVENT_DATES.EVENT_START && now < EVENT_DATES.COUNTDOWN_ENDING) {
    return 'active';
  }
  
  if (now >= EVENT_DATES.COUNTDOWN_ENDING && now < EVENT_DATES.EVENT_END) {
    return 'ending';
  }
  
  return 'ended';
}

/**
 * 计算倒计时数据
 */
export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  stage: CountdownStage;
  targetDate: Date;
}

export function calculateCountdown(
  currentTime: Date = new Date(),
  forcedStage?: CountdownStage | null
): CountdownData {
  const stage = forcedStage || getCountdownStage(currentTime);
  const now = getEasternTime(currentTime);
  
  // 根据阶段确定目标时间
  let targetDate: Date;
  
  switch (stage) {
    case 'before':
      targetDate = EVENT_DATES.EVENT_START;
      break;
    case 'active':
      // 活动进行中，倒计时到结束倒计时阶段
      targetDate = EVENT_DATES.COUNTDOWN_ENDING;
      break;
    case 'ending':
      targetDate = EVENT_DATES.EVENT_END;
      break;
    case 'ended':
    default:
      // 活动已结束，返回零值
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        stage: 'ended',
        targetDate: EVENT_DATES.EVENT_END,
      };
  }
  
  // 计算时间差（毫秒）
  const diff = targetDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      stage,
      targetDate,
    };
  }
  
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    stage,
    targetDate,
  };
}

/**
 * 获取倒计时阶段文案
 */
export function getCountdownMessage(stage: CountdownStage): string {
  switch (stage) {
    case 'before':
      return 'Event Starts In';
    case 'active':
      return 'Event Live Now';
    case 'ending':
      return 'Event Ends In';
    case 'ended':
      return 'Event Has Ended';
    default:
      return '';
  }
}

/**
 * 格式化倒计时数字（补零）
 */
export function formatCountdownNumber(num: number): string {
  return num.toString().padStart(2, '0');
}
```

### 1.2 时间工具函数测试

```typescript
// src/lib/__tests__/time.test.ts
import { describe, it, expect } from 'vitest';
import {
  getCountdownStage,
  calculateCountdown,
  createEasternDate,
} from '../time';

describe('Time utilities', () => {
  it('should detect before stage', () => {
    const testDate = createEasternDate(2025, 11, 15, 12, 0, 0);
    expect(getCountdownStage(testDate)).toBe('before');
  });
  
  it('should detect active stage', () => {
    const testDate = createEasternDate(2025, 11, 20, 12, 0, 0);
    expect(getCountdownStage(testDate)).toBe('active');
  });
  
  it('should calculate correct countdown', () => {
    const now = createEasternDate(2025, 11, 10, 12, 0, 0);
    const countdown = calculateCountdown(now);
    
    expect(countdown.days).toBeGreaterThan(0);
    expect(countdown.stage).toBe('before');
  });
});
```

---

## 二、表单验证

### 2.1 Zod Schemas

**文件**: `src/lib/validation.ts`

```typescript
import { z } from 'zod';

/**
 * Industry 枚举
 */
export enum Industry {
  Photography = 'Photography Service',
  Residential = 'Residential Real Estate',
  Commercial = 'Commercial Real Estate',
  AEC = 'Architecture, Engineering, Construction',
  Travel = 'Travel, Hospitality',
  Retail = 'Retail, Restaurant',
  Other = 'Other',
}

/**
 * Contact Form Schema
 */
export const contactFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long'),
  
  email: z.string()
    .email('Invalid email address')
    .toLowerCase(),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number is too long')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Phone number contains invalid characters'),
  
  countryCode: z.string()
    .min(1, 'Country code is required'),
  
  country: z.string()
    .optional(),
  
  industry: z.nativeEnum(Industry, {
    errorMap: () => ({ message: 'Please select an industry' }),
  }),
  
  inquiry: z.string()
    .min(10, 'Please provide more details (at least 10 characters)')
    .max(1000, 'Inquiry is too long (max 1000 characters)'),
  
  otherProducts: z.string()
    .max(500, 'Response is too long (max 500 characters)')
    .optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Newsletter Schema
 */
export const newsletterSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase(),
  
  source: z.enum(['exit-intent', 'footer', 'hero', 'other'])
    .optional(),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

/**
 * 验证表单数据
 */
export async function validateContactForm(
  data: unknown
): Promise<{ success: true; data: ContactFormData } | { success: false; errors: Record<string, string> }> {
  const result = await contactFormSchema.safeParseAsync(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  // 转换 Zod errors 为简单对象
  const errors: Record<string, string> = {};
  
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  }
  
  return { success: false, errors };
}
```

### 2.2 国家和区号数据

**文件**: `src/lib/countries.ts`

```typescript
/**
 * 国家/地区定义
 * 特别注意中国台湾省、香港、澳门的表述
 */
export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dialCode: string;
}

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'CN', name: 'China', dialCode: '+86' },
  
  // 特别注意的表述
  { code: 'TW', name: 'Taiwan, Province of China', dialCode: '+886' },
  { code: 'HK', name: 'Hong Kong SAR, China', dialCode: '+852' },
  { code: 'MO', name: 'Macao SAR, China', dialCode: '+853' },
  
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'KR', name: 'South Korea', dialCode: '+82' },
  { code: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'IT', name: 'Italy', dialCode: '+39' },
  { code: 'ES', name: 'Spain', dialCode: '+34' },
  { code: 'BR', name: 'Brazil', dialCode: '+55' },
  { code: 'MX', name: 'Mexico', dialCode: '+52' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
  
  // ... 更多国家
];

/**
 * 根据区号查找国家
 */
export function findCountryByDialCode(dialCode: string): Country | undefined {
  return COUNTRIES.find(c => c.dialCode === dialCode);
}

/**
 * 根据国家代码查找国家
 */
export function findCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code === code);
}

/**
 * 获取常用国家（排序：US, CA, GB, CN, 其他按字母）
 */
export function getPopularCountries(): Country[] {
  const popularCodes = ['US', 'CA', 'GB', 'CN'];
  const popular = COUNTRIES.filter(c => popularCodes.includes(c.code));
  const others = COUNTRIES.filter(c => !popularCodes.includes(c.code))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  return [...popular, ...others];
}
```

---

## 三、通用工具函数

### 3.1 Class Name 合并

**文件**: `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 class names，处理 Tailwind 冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 格式化价格
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * 格式化数字（添加千分位）
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

/**
 * 滚动到元素
 */
export function scrollToElement(
  elementId: string,
  options?: ScrollIntoViewOptions
): void {
  const element = document.getElementById(elementId);
  
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options,
    });
  }
}

/**
 * 检查是否在视口内
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
```

### 3.2 分析追踪工具

**文件**: `src/lib/analytics.ts`

```typescript
/**
 * Google Analytics 4 事件追踪
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * 追踪页面浏览
 */
export function trackPageView(url: string): void {
  if (typeof window.gtag === 'function') {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
}

/**
 * 追踪事件
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
): void {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
  
  // 同时记录到 console（开发环境）
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Track Event:', { action, category, label, value });
  }
}

/**
 * 预定义的追踪事件
 */
export const AnalyticsEvents = {
  // 产品相关
  viewProduct: (productName: string) =>
    trackEvent('view_item', 'Product', productName),
  
  clickBuyNow: (productName: string, price: number) =>
    trackEvent('add_to_cart', 'Product', productName, price),
  
  expandWhatsIncluded: (productName: string) =>
    trackEvent('expand_details', 'Product', productName),
  
  // 表单相关
  startForm: () =>
    trackEvent('begin_checkout', 'Form', 'Contact Form'),
  
  submitForm: (industry: string) =>
    trackEvent('generate_lead', 'Form', industry),
  
  formError: (field: string) =>
    trackEvent('form_error', 'Form', field),
  
  // 视频相关
  playVideo: (videoTitle: string) =>
    trackEvent('play_video', 'Engagement', videoTitle),
  
  // 导航相关
  clickNavigation: (section: string) =>
    trackEvent('click_navigation', 'Navigation', section),
  
  // 社交分享
  shareOnSocial: (platform: string) =>
    trackEvent('share', 'Social', platform),
  
  // Exit Intent
  showExitIntent: () =>
    trackEvent('exit_intent_show', 'Engagement', 'Exit Intent'),
  
  closeExitIntent: () =>
    trackEvent('exit_intent_close', 'Engagement', 'Exit Intent'),
  
  subscribeNewsletter: (source: string) =>
    trackEvent('subscribe', 'Newsletter', source),
  
  // 第三方平台
  clickRetailPartner: (partner: string) =>
    trackEvent('click', 'Retail Partner', partner),
};
```

### 3.3 Feature Flags

**文件**: `src/lib/features.ts`

```typescript
/**
 * 功能开关配置
 */

export interface FeatureFlags {
  // CRO 功能
  stickyCTA: boolean;
  exitIntent: boolean;
  socialProof: boolean;
  stockIndicator: boolean;
  priceCalculator: boolean;
  faqWidget: boolean;
  
  // 分析功能
  googleAnalytics: boolean;
  hotjar: boolean;
  
  // Debug 功能
  debugMode: boolean;
}

/**
 * 默认功能开关
 */
const DEFAULT_FEATURES: FeatureFlags = {
  stickyCTA: true,
  exitIntent: true,
  socialProof: false,
  stockIndicator: false,
  priceCalculator: false,
  faqWidget: true,
  googleAnalytics: true,
  hotjar: false,
  debugMode: process.env.NODE_ENV === 'development',
};

/**
 * 从环境变量读取功能开关
 */
export function getFeatureFlags(): FeatureFlags {
  if (typeof window === 'undefined') {
    return DEFAULT_FEATURES;
  }
  
  return {
    stickyCTA: process.env.NEXT_PUBLIC_ENABLE_STICKY_CTA === 'true' ?? DEFAULT_FEATURES.stickyCTA,
    exitIntent: process.env.NEXT_PUBLIC_ENABLE_EXIT_INTENT === 'true' ?? DEFAULT_FEATURES.exitIntent,
    socialProof: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_PROOF === 'true' ?? DEFAULT_FEATURES.socialProof,
    stockIndicator: process.env.NEXT_PUBLIC_ENABLE_STOCK_INDICATOR === 'true' ?? DEFAULT_FEATURES.stockIndicator,
    priceCalculator: process.env.NEXT_PUBLIC_ENABLE_PRICE_CALCULATOR === 'true' ?? DEFAULT_FEATURES.priceCalculator,
    faqWidget: process.env.NEXT_PUBLIC_ENABLE_FAQ_WIDGET === 'true' ?? DEFAULT_FEATURES.faqWidget,
    googleAnalytics: Boolean(process.env.NEXT_PUBLIC_GA_ID),
    hotjar: Boolean(process.env.NEXT_PUBLIC_HOTJAR_ID),
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' || DEFAULT_FEATURES.debugMode,
  };
}

/**
 * 检查功能是否启用
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature];
}
```

---

## 四、TypeScript 类型定义

### 4.1 产品相关类型

**文件**: `src/types/product.ts`

```typescript
/**
 * 产品 SKU
 */
export interface ProductSKU {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  discountPercentage: number;
  featured: boolean;
  image: string;
  buyUrl: string;
  whatsIncluded: IncludedItem[];
  availableFrom: Date; // 商品上架时间（11/03）
}

export interface IncludedItem {
  title: string;
  items: string[];
  value?: string; // 如 "Value at $150"
}

/**
 * 第三方零售伙伴
 */
export interface RetailPartner {
  id: string;
  name: string;
  logo: string;
  url: string;
}
```

### 4.2 内容相关类型

**文件**: `src/types/content.ts`

```typescript
/**
 * 3D Tour 案例
 */
export interface TourCase {
  id: string;
  title: string;
  category: string;
  url: string;
  image: string;
  thumbnail?: string;
}

/**
 * 特性介绍
 */
export interface Feature {
  id: string;
  title: string;
  description: string;
  video: string;
  thumbnail?: string;
}

/**
 * KOL 视频
 */
export interface KOLVideo {
  id: string;
  youtubeId: string;
  title: string;
  creator: string;
  thumbnail?: string;
}

/**
 * 全球统计数据
 */
export interface GlobalStat {
  label: string;
  value: string;
  icon?: string;
}

/**
 * 分享场景
 */
export interface DistributionFeature {
  id: string;
  title: string;
  description: string;
  image: string;
}
```

### 4.3 UI 相关类型

**文件**: `src/types/ui.ts`

```typescript
/**
 * 导航 Tab
 */
export interface NavTab {
  id: string;
  label: string;
  href: string;
}

/**
 * 社交证明通知
 */
export interface SocialProofNotification {
  id: string;
  name: string;
  location: string;
  product: string;
  timestamp: number;
}

/**
 * 模态框 Props
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * 按钮变体
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/**
 * 加载状态
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
```

---

## 五、常量定义

**文件**: `src/lib/constants.ts`

```typescript
/**
 * 导航 Tabs
 */
export const NAV_TABS: NavTab[] = [
  { id: 'offers', label: 'Black Friday Offers', href: '#offers' },
  { id: 'showcases', label: '3D Tour Showcases', href: '#showcases' },
  { id: 'about', label: 'About Galois', href: '#about' },
  { id: 'testimonial', label: 'Testimonial', href: '#testimonial' },
  { id: 'contact', label: 'Contact Us', href: '#contact' },
];

/**
 * 产品 SKUs
 */
export const PRODUCTS: ProductSKU[] = [
  {
    id: 'premium-bundle',
    name: 'Galois Premium Bundle',
    subtitle: 'Complete Professional Kit',
    description: 'Everything you need for professional 3D scanning',
    originalPrice: 6424,
    discountedPrice: 4999,
    discount: 1425,
    discountPercentage: 22,
    featured: true,
    image: '/assets/products/galois-premium-bundle.jpg',
    buyUrl: 'https://home.realsee.ai/en/store-item/1643646673',
    availableFrom: new Date('2025-11-03T00:00:00-05:00'),
    whatsIncluded: [
      {
        title: 'Galois Standard Kit',
        items: ['Galois M2 3D LiDAR Camera', 'Battery', 'Backpack', 'Tripod', 'Lens protector', 'Quick Release', 'More Accessories'],
        value: '$5499',
      },
      {
        title: 'Extras',
        items: ['Extra Battery', 'Extra Charger'],
        value: '$250',
      },
      {
        title: '300 Credits',
        items: ['3D Tour Hosting', '16K Panorama Downloads', 'RAW Panorama Downloads', 'OBJ Downloads', 'E57 Downloads'],
        value: '$625',
      },
    ],
  },
  {
    id: 'standard-kit',
    name: 'Galois Standard Kit',
    subtitle: 'Essential Scanning Package',
    description: 'All the essentials for getting started',
    originalPrice: 5499,
    discountedPrice: 4599,
    discount: 900,
    discountPercentage: 16,
    featured: false,
    image: '/assets/products/galois-standard-kit.jpg',
    buyUrl: 'https://home.realsee.ai/en/store-item/1643646648',
    availableFrom: new Date('2025-11-03T00:00:00-05:00'),
    whatsIncluded: [
      {
        title: 'What's Included',
        items: ['Galois M2 3D LiDAR Camera', 'Battery', 'Backpack', 'Tripod', 'Lens protector', 'Quick Release', 'More Accessories'],
      },
    ],
  },
];

/**
 * 第三方零售伙伴
 */
export const RETAIL_PARTNERS: RetailPartner[] = [
  {
    id: 'bh',
    name: 'B&H',
    logo: '/assets/partners/bh-logo.png',
    url: 'https://www.bhphotovideo.com/c/product/1791796-REG/realsee_technology_rs41010_galois_m2_3d_lidar.html',
  },
  {
    id: 'adorama',
    name: 'Adorama',
    logo: '/assets/partners/adorama-logo.png',
    url: 'https://www.adorama.com/rlrs41025.html',
  },
  {
    id: 'robotshop',
    name: 'RobotShop',
    logo: '/assets/partners/robotshop-logo.png',
    url: 'https://www.robotshop.com/products/realsee-technology-galois-m2-3d-lidar-camera-kit-us',
  },
];

/**
 * 3D Tour 案例
 */
export const TOUR_CASES: TourCase[] = [
  { id: '1', title: 'Luxury Residential', category: 'Residential', url: 'https://realsee.ai/v4OOR4qm', image: '/assets/tours/luxury-residential.jpg' },
  { id: '2', title: 'Retail Space', category: 'Retail', url: 'https://realsee.ai/jmxxR7qV', image: '/assets/tours/retail.jpg' },
  { id: '3', title: 'Restaurant', category: 'Hospitality', url: 'https://realsee.ai/Ae44XBBg', image: '/assets/tours/restaurant.jpg' },
  { id: '4', title: 'Museum', category: 'Cultural', url: 'https://realsee.ai/8VRR9e8a', image: '/assets/tours/museum.jpg' },
  { id: '5', title: 'Aerial 3D', category: 'Outdoor', url: 'https://realsee.ai/GjVV2lEO', image: '/assets/tours/aerial.jpg' },
  { id: '6', title: 'Industrial', category: 'Industrial', url: 'https://realsee.ai/gL99yxrL', image: '/assets/tours/industrial.jpg' },
  { id: '7', title: 'Construction', category: 'Construction', url: 'https://realsee.ai/p8EEaW6z', image: '/assets/tours/construction.jpg' },
];

/**
 * KOL 视频
 */
export const KOL_VIDEOS: KOLVideo[] = [
  { id: '1', youtubeId: '2I4Xn85I2Co', title: 'Galois Review by Arthur', creator: 'Arthur' },
  { id: '2', youtubeId: 'tJyaBmGIvkY', title: 'Galois Review by Hugh', creator: 'Hugh' },
  { id: '3', youtubeId: 'ox0HgPfWDs8', title: 'Galois Review by Sparks', creator: 'Sparks' },
  { id: '4', youtubeId: 'IRWP9hYZsrA', title: 'Galois Review by 360 Guy', creator: '360 Guy' },
];

/**
 * 全球统计
 */
export const GLOBAL_STATS: GlobalStat[] = [
  { label: 'Countries', value: '50+' },
  { label: 'Spaces Scanned', value: '50 Million' },
  { label: 'Partnership Companies', value: '3000+' },
  { label: 'Patents', value: '600+' },
];
```

---

## 六、Hook 工具

**文件**: `src/lib/hooks.ts`

```typescript
import { useEffect, useState, useRef } from 'react';

/**
 * 检测元素是否在视口内
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [elementRef, options]);
  
  return isIntersecting;
}

/**
 * 媒体查询 Hook
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
}

/**
 * 检测是否是移动端
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

/**
 * 防抖 Hook
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

