# 数据流与状态管理设计文档 - Black Friday 网站

## 一、状态管理架构

### 1.1 技术选型
- **Zustand** - 唯一的状态管理库
- **URL Search Params** - 作为部分状态源（debug 模式）
- **localStorage** - 持久化用户偏好和访问记录

### 1.2 状态分层

```
┌─────────────────────────────────────────┐
│         URL Parameters (读取)            │
│   ?stage=before&debug=true              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      Zustand Global Stores              │
│  - useUIStore (导航、弹窗)               │
│  - useDebugStore (debug 模式)           │
│  - useFormStore (表单状态)               │
│  - useCROStore (转化优化功能)            │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      Component Local State              │
│  - useState (临时UI状态)                 │
│  - useRef (DOM引用)                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      localStorage (持久化)               │
│  - visitCount                           │
│  - lastVisit                            │
│  - viewedSections                       │
└─────────────────────────────────────────┘
```

## 二、Zustand Stores 详细设计

### 2.1 useUIStore - UI 状态管理

**文件**: `src/store/useUIStore.ts`

```typescript
import { create } from 'zustand';

interface UIStore {
  // 导航相关
  activeSection: string;
  setActiveSection: (section: string) => void;
  
  // 移动端菜单
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  
  // Sticky CTA
  showStickyCTA: boolean;
  setShowStickyCTA: (show: boolean) => void;
  
  // FAQ 浮窗
  isFAQOpen: boolean;
  toggleFAQ: () => void;
  
  // Exit Intent Popup
  hasShownExitIntent: boolean;
  setHasShownExitIntent: (shown: boolean) => void;
  isExitIntentOpen: boolean;
  openExitIntent: () => void;
  closeExitIntent: () => void;
  
  // 加载进度
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
  
  // 社交证明通知
  socialProofQueue: SocialProofNotification[];
  addSocialProof: (notification: SocialProofNotification) => void;
  removeSocialProof: (id: string) => void;
}

interface SocialProofNotification {
  id: string;
  name: string;
  location: string;
  product: string;
  timestamp: number;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // 初始状态
  activeSection: '',
  isMobileMenuOpen: false,
  showStickyCTA: false,
  isFAQOpen: false,
  hasShownExitIntent: false,
  isExitIntentOpen: false,
  loadingProgress: 0,
  socialProofQueue: [],
  
  // Actions
  setActiveSection: (section) => set({ activeSection: section }),
  
  toggleMobileMenu: () => set((state) => ({ 
    isMobileMenuOpen: !state.isMobileMenuOpen 
  })),
  
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  
  setShowStickyCTA: (show) => set({ showStickyCTA: show }),
  
  toggleFAQ: () => set((state) => ({ isFAQOpen: !state.isFAQOpen })),
  
  setHasShownExitIntent: (shown) => set({ hasShownExitIntent: shown }),
  
  openExitIntent: () => {
    const { hasShownExitIntent } = get();
    if (!hasShownExitIntent) {
      set({ isExitIntentOpen: true, hasShownExitIntent: true });
    }
  },
  
  closeExitIntent: () => set({ isExitIntentOpen: false }),
  
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  
  addSocialProof: (notification) => set((state) => ({
    socialProofQueue: [...state.socialProofQueue, notification]
  })),
  
  removeSocialProof: (id) => set((state) => ({
    socialProofQueue: state.socialProofQueue.filter(n => n.id !== id)
  })),
}));
```

---

### 2.2 useDebugStore - Debug 模式管理

**文件**: `src/store/useDebugStore.ts`

```typescript
import { create } from 'zustand';

type CountdownStage = 'before' | 'active' | 'ending' | 'ended' | null;

interface DebugStore {
  // 强制倒计时阶段
  forcedStage: CountdownStage;
  setForcedStage: (stage: CountdownStage) => void;
  
  // Debug 模式开关
  isDebugMode: boolean;
  toggleDebugMode: () => void;
  
  // 功能开关（用于测试 CRO 功能）
  featureFlags: FeatureFlags;
  toggleFeature: (feature: keyof FeatureFlags) => void;
  
  // 从 URL 初始化
  initFromURL: (searchParams: URLSearchParams) => void;
}

interface FeatureFlags {
  stickyCTA: boolean;
  exitIntent: boolean;
  socialProof: boolean;
  stockIndicator: boolean;
  priceCalculator: boolean;
  faqWidget: boolean;
}

export const useDebugStore = create<DebugStore>((set, get) => ({
  forcedStage: null,
  isDebugMode: false,
  featureFlags: {
    stickyCTA: true,
    exitIntent: true,
    socialProof: false,
    stockIndicator: false,
    priceCalculator: false,
    faqWidget: true,
  },
  
  setForcedStage: (stage) => set({ forcedStage: stage }),
  
  toggleDebugMode: () => set((state) => ({ 
    isDebugMode: !state.isDebugMode 
  })),
  
  toggleFeature: (feature) => set((state) => ({
    featureFlags: {
      ...state.featureFlags,
      [feature]: !state.featureFlags[feature],
    }
  })),
  
  initFromURL: (searchParams) => {
    const stage = searchParams.get('stage') as CountdownStage;
    const debug = searchParams.get('debug') === 'true';
    
    set({
      forcedStage: stage,
      isDebugMode: debug,
    });
    
    // 解析功能开关
    const features = searchParams.get('features');
    if (features) {
      const enabledFeatures = features.split(',');
      const newFlags = { ...get().featureFlags };
      
      Object.keys(newFlags).forEach(key => {
        newFlags[key as keyof FeatureFlags] = enabledFeatures.includes(key);
      });
      
      set({ featureFlags: newFlags });
    }
  },
}));
```

**使用示例**:
```typescript
// 在客户端组件中初始化
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebugStore } from '@/store/useDebugStore';

export function DebugInitializer() {
  const searchParams = useSearchParams();
  const initFromURL = useDebugStore(state => state.initFromURL);
  
  useEffect(() => {
    initFromURL(searchParams);
  }, [searchParams, initFromURL]);
  
  return null;
}
```

**URL 参数示例**:
```
# 强制倒计时阶段为活动前
?stage=before

# 开启 debug 模式
?debug=true

# 开启特定功能
?features=stickyCTA,socialProof,exitIntent

# 组合使用
?stage=active&debug=true&features=stickyCTA,socialProof
```

---

### 2.3 useFormStore - 表单状态管理

**文件**: `src/store/useFormStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  country?: string;
  industry: string;
  inquiry: string;
  otherProducts?: string;
}

interface FormStore {
  // 表单数据
  formData: ContactFormData;
  
  // 表单状态
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  errorMessage?: string;
  
  // 验证错误
  errors: Partial<Record<keyof ContactFormData, string>>;
  
  // Actions
  updateField: (field: keyof ContactFormData, value: string) => void;
  setError: (field: keyof ContactFormData, error: string) => void;
  clearError: (field: keyof ContactFormData) => void;
  clearAllErrors: () => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  
  // 草稿保存（用于返回用户）
  saveDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  countryCode: '+1',
  country: '',
  industry: '',
  inquiry: '',
  otherProducts: '',
};

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      isSubmitting: false,
      submitStatus: 'idle',
      errors: {},
      
      updateField: (field, value) => {
        set((state) => ({
          formData: { ...state.formData, [field]: value }
        }));
        // 清除该字段的错误
        get().clearError(field);
      },
      
      setError: (field, error) => set((state) => ({
        errors: { ...state.errors, [field]: error }
      })),
      
      clearError: (field) => set((state) => {
        const { [field]: _, ...rest } = state.errors;
        return { errors: rest };
      }),
      
      clearAllErrors: () => set({ errors: {} }),
      
      submitForm: async () => {
        const { formData } = get();
        
        set({ isSubmitting: true, submitStatus: 'idle' });
        
        try {
          // 客户端验证
          const validation = await validateForm(formData);
          if (!validation.success) {
            set({ 
              errors: validation.errors,
              submitStatus: 'idle',
              isSubmitting: false,
            });
            return;
          }
          
          // 提交到 API
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          
          if (!response.ok) {
            throw new Error('Submission failed');
          }
          
          set({ 
            submitStatus: 'success',
            isSubmitting: false,
          });
          
          // 清除草稿
          get().clearDraft();
          
        } catch (error) {
          set({ 
            submitStatus: 'error',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
        }
      },
      
      resetForm: () => set({
        formData: initialFormData,
        submitStatus: 'idle',
        errors: {},
        errorMessage: undefined,
      }),
      
      saveDraft: () => {
        // persist middleware 会自动保存到 localStorage
      },
      
      loadDraft: () => {
        // persist middleware 会自动加载
      },
      
      clearDraft: () => {
        localStorage.removeItem('form-storage');
      },
    }),
    {
      name: 'form-storage',
      partialize: (state) => ({
        formData: state.formData, // 只持久化表单数据
      }),
    }
  )
);
```

---

### 2.4 useCROStore - 转化优化功能状态

**文件**: `src/store/useCROStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CROStore {
  // 访问统计
  visitCount: number;
  firstVisit: number;
  lastVisit: number;
  incrementVisit: () => void;
  
  // 已查看的区块
  viewedSections: Set<string>;
  markSectionViewed: (section: string) => void;
  
  // 库存提示
  stockLevel: 'high' | 'medium' | 'low';
  updateStockLevel: (level: 'high' | 'medium' | 'low') => void;
  
  // 社交证明配置
  socialProofEnabled: boolean;
  setSocialProofEnabled: (enabled: boolean) => void;
  
  // 用户偏好
  hasClosedExitIntent: boolean;
  setHasClosedExitIntent: (closed: boolean) => void;
  
  hasSubscribedNewsletter: boolean;
  setHasSubscribedNewsletter: (subscribed: boolean) => void;
  
  // 分析事件记录
  events: AnalyticsEvent[];
  trackEvent: (event: AnalyticsEvent) => void;
  
  // 重置所有数据（用于测试）
  resetAll: () => void;
}

interface AnalyticsEvent {
  name: string;
  timestamp: number;
  properties?: Record<string, any>;
}

export const useCROStore = create<CROStore>()(
  persist(
    (set, get) => ({
      visitCount: 0,
      firstVisit: Date.now(),
      lastVisit: Date.now(),
      viewedSections: new Set(),
      stockLevel: 'medium',
      socialProofEnabled: true,
      hasClosedExitIntent: false,
      hasSubscribedNewsletter: false,
      events: [],
      
      incrementVisit: () => set((state) => ({
        visitCount: state.visitCount + 1,
        lastVisit: Date.now(),
      })),
      
      markSectionViewed: (section) => set((state) => {
        const newSet = new Set(state.viewedSections);
        newSet.add(section);
        return { viewedSections: newSet };
      }),
      
      updateStockLevel: (level) => set({ stockLevel: level }),
      
      setSocialProofEnabled: (enabled) => set({ socialProofEnabled: enabled }),
      
      setHasClosedExitIntent: (closed) => set({ hasClosedExitIntent: closed }),
      
      setHasSubscribedNewsletter: (subscribed) => set({ 
        hasSubscribedNewsletter: subscribed 
      }),
      
      trackEvent: (event) => set((state) => ({
        events: [...state.events, event],
      })),
      
      resetAll: () => set({
        visitCount: 0,
        firstVisit: Date.now(),
        lastVisit: Date.now(),
        viewedSections: new Set(),
        stockLevel: 'medium',
        hasClosedExitIntent: false,
        hasSubscribedNewsletter: false,
        events: [],
      }),
    }),
    {
      name: 'cro-storage',
      serialize: (state) => {
        // 特殊处理 Set
        return JSON.stringify({
          ...state.state,
          viewedSections: Array.from(state.state.viewedSections),
        });
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          state: {
            ...parsed.state,
            viewedSections: new Set(parsed.state.viewedSections),
          },
        };
      },
    }
  )
);
```

---

## 三、API 路由设计

### 3.1 Contact Form API

**文件**: `src/app/api/contact/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 验证 Schema
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  countryCode: z.string(),
  country: z.string().optional(),
  industry: z.enum([
    'Photography Service',
    'Residential Real Estate',
    'Commercial Real Estate',
    'Architecture, Engineering, Construction',
    'Travel, Hospitality',
    'Retail, Restaurant',
    'Other',
  ]),
  inquiry: z.string().min(10, 'Please provide more details'),
  otherProducts: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证数据
    const result = contactFormSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          errors: result.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    // Mock: 记录到控制台
    console.log('Contact form submission:', result.data);
    
    // TODO: 集成实际后端 API
    // await fetch('https://your-backend-api.com/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(result.data),
    // });
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred. Please try again later.' 
      },
      { status: 500 }
    );
  }
}
```

---

### 3.2 Newsletter Subscription API

**文件**: `src/app/api/newsletter/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional(), // 订阅来源（exit-intent, footer等）
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = newsletterSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    console.log('Newsletter subscription:', result.data);
    
    // TODO: 集成邮件服务（Mailchimp, SendGrid等）
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
    });
    
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { success: false, message: 'Subscription failed' },
      { status: 500 }
    );
  }
}
```

---

## 四、localStorage 使用规范

### 4.1 存储键命名

```typescript
// src/lib/storage-keys.ts
export const STORAGE_KEYS = {
  // Zustand persist
  FORM_STORAGE: 'form-storage',
  CRO_STORAGE: 'cro-storage',
  
  // 自定义存储
  USER_PREFERENCES: 'bf-user-preferences',
  VISITED_SECTIONS: 'bf-visited-sections',
  LAST_VISIT: 'bf-last-visit',
} as const;
```

### 4.2 辅助函数

```typescript
// src/lib/storage.ts
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('localStorage.setItem error:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage.removeItem error:', error);
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('localStorage.clear error:', error);
    }
  },
};
```

---

## 五、数据流示意图

### 5.1 页面初始化流程

```
用户访问页面
    ↓
layout.tsx (Server Component)
    ↓
page.tsx (Server Component)
    ↓
渲染服务端组件（ShippingInfo, RetailPartners等）
    ↓
Hydration 客户端组件
    ↓
DebugInitializer 读取 URL 参数
    ↓
useDebugStore.initFromURL()
    ↓
useCROStore.incrementVisit()
    ↓
加载 localStorage 数据
    ↓
初始化完成，用户可交互
```

### 5.2 表单提交流程

```
用户填写表单
    ↓
onChange → useFormStore.updateField()
    ↓
实时验证（可选）
    ↓
用户点击提交
    ↓
useFormStore.submitForm()
    ↓
客户端验证（Zod）
    ↓ (验证失败)
显示错误提示
    ↓ (验证成功)
POST /api/contact
    ↓
服务端验证
    ↓ (成功)
返回成功响应
    ↓
显示成功消息
    ↓
清除表单 / 重定向
```

### 5.3 导航滚动联动流程

```
用户滚动页面
    ↓
Intersection Observer 触发
    ↓
检测当前可见区块
    ↓
useUIStore.setActiveSection(sectionId)
    ↓
SiteHeader 订阅 activeSection
    ↓
更新导航高亮样式
```

---

## 六、错误处理

### 6.1 API 错误处理

```typescript
// src/lib/api-client.ts
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }
    
    const data = await response.json();
    return { data };
    
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
```

### 6.2 Store 错误处理

```typescript
// 在 store action 中捕获错误
submitForm: async () => {
  try {
    // ... 提交逻辑
  } catch (error) {
    console.error('Form submission error:', error);
    set({ 
      submitStatus: 'error',
      errorMessage: 'An unexpected error occurred. Please try again.',
    });
    
    // 可选：上报到错误监控服务（Sentry等）
    // reportError(error);
  }
},
```

---

## 七、测试策略

### 7.1 Store 单元测试

```typescript
// src/store/__tests__/useUIStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useUIStore } from '../useUIStore';

describe('useUIStore', () => {
  beforeEach(() => {
    // 重置 store
    useUIStore.setState(useUIStore.getInitialState());
  });
  
  it('should toggle mobile menu', () => {
    const { result } = renderHook(() => useUIStore());
    
    expect(result.current.isMobileMenuOpen).toBe(false);
    
    act(() => {
      result.current.toggleMobileMenu();
    });
    
    expect(result.current.isMobileMenuOpen).toBe(true);
  });
  
  // 更多测试...
});
```

### 7.2 API 路由测试

```typescript
// src/app/api/contact/__tests__/route.test.ts
import { POST } from '../route';
import { NextRequest } from 'next/server';

describe('/api/contact', () => {
  it('should validate required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }), // 缺少必填字段
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.errors).toBeDefined();
  });
  
  // 更多测试...
});
```

---

## 八、性能优化

### 8.1 Store 选择器优化

```typescript
// ❌ 不推荐：每次都会重新渲染
const { activeSection, isMobileMenuOpen, showStickyCTA } = useUIStore();

// ✅ 推荐：只订阅需要的状态
const activeSection = useUIStore(state => state.activeSection);
const isMobileMenuOpen = useUIStore(state => state.isMobileMenuOpen);
```

### 8.2 避免不必要的状态更新

```typescript
// ❌ 不推荐：总是更新
setActiveSection: (section) => set({ activeSection: section }),

// ✅ 推荐：只在值改变时更新
setActiveSection: (section) => {
  if (get().activeSection !== section) {
    set({ activeSection: section });
  }
},
```

### 8.3 批量更新

```typescript
// ❌ 不推荐：多次更新
set({ isSubmitting: true });
set({ submitStatus: 'idle' });
set({ errors: {} });

// ✅ 推荐：一次性更新
set({ 
  isSubmitting: true,
  submitStatus: 'idle',
  errors: {},
});
```

