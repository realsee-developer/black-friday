# 转化优化方案文档 (CRO) - Black Friday 网站

## 一、CRO 功能总览

### 1.1 功能清单

| 功能分类 | 功能名称 | 优先级 | 实施阶段 |
|---------|---------|-------|----------|
| 紧迫感 | Sticky CTA 按钮 | P0 | MVP |
| 紧迫感 | 库存提示 | P1 | Phase 2 |
| 紧迫感 | 最近购买通知 | P2 | Phase 2 |
| 留存 | Exit Intent Popup | P0 | MVP |
| 留存 | Newsletter 订阅 | P0 | MVP |
| 留存 | 返回用户欢迎 | P1 | Phase 2 |
| 社交 | 社交分享按钮 | P1 | Phase 2 |
| 社交 | 推荐链接生成 | P2 | Phase 3 |
| 信任 | 信任徽章 | P1 | MVP |
| 信任 | 评价星级 | P2 | Phase 2 |
| 信任 | 购买数量展示 | P1 | Phase 2 |
| 体验 | 价格对比计算器 | P2 | Phase 3 |
| 体验 | FAQ 悬浮按钮 | P1 | Phase 2 |
| 体验 | 快速联系方式 | P0 | MVP |
| 体验 | 返回顶部按钮 | P0 | MVP |
| 加载 | Skeleton Loading | P0 | MVP |
| 加载 | 加载进度条 | P1 | Phase 2 |
| 追踪 | Google Analytics 4 | P0 | MVP |
| 追踪 | 热图准备 | P1 | Phase 2 |

**优先级说明**:
- P0: MVP 必须，直接影响转化
- P1: 重要，提升用户体验
- P2: 锦上添花，A/B 测试候选

### 1.2 实施阶段

**MVP (Minimum Viable Product)**:
- Sticky CTA
- Exit Intent
- Newsletter
- 快速联系
- 返回顶部
- Skeleton Loading
- GA4 追踪

**Phase 2 (增强版)**:
- 库存提示
- 最近购买通知
- FAQ 悬浮
- 加载进度条
- 评价展示

**Phase 3 (完整版)**:
- 价格计算器
- 推荐链接
- 完整 A/B 测试

---

## 二、MVP 功能详细设计

### 2.1 Sticky CTA 按钮

**目标**: 始终可见的行动号召，降低跳出率

**设计**:
```typescript
// src/components/custom/StickyCTA.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';

export function StickyCTA() {
  const showStickyCTA = useUIStore(state => state.showStickyCTA);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // 滚动超过一屏后显示
      const shouldShow = window.scrollY > window.innerHeight;
      useUIStore.getState().setShowStickyCTA(shouldShow);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // 延迟显示动画
    if (showStickyCTA) {
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [showStickyCTA]);
  
  return (
    <div className={cn(
      "sticky-cta",
      "bg-gradient-to-r from-cyber-brand-500 to-cyber-neon-cyan",
      "shadow-lg shadow-cyber-brand-500/50",
      isVisible && "visible"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-white font-semibold text-sm sm:text-base">
              Black Friday Special - Save up to $1,425!
            </p>
            <p className="text-white/90 text-xs sm:text-sm">
              Limited time offer ends Dec 7th
            </p>
          </div>
          
          <a
            href="#offers"
            className="
              cyber-btn-primary
              px-4 py-2 sm:px-6 sm:py-3
              whitespace-nowrap
              flex items-center gap-2
            "
            onClick={() => {
              trackEvent('click', 'Sticky CTA', 'Buy Now');
            }}
          >
            <span>Shop Now</span>
            <Icon icon="heroicons:arrow-right" width={20} />
          </a>
        </div>
      </div>
    </div>
  );
}
```

**触发条件**:
- 用户滚动超过首屏（100vh）
- 自动显示在页面底部（移动端）或顶部（桌面端）

**追踪事件**:
- `sticky_cta_view` - CTA 显示
- `sticky_cta_click` - 点击按钮

---

### 2.2 Exit Intent Popup

**目标**: 挽留即将离开的用户

**设计**:
```typescript
// src/components/custom/ExitIntentPopup.tsx
'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useCROStore } from '@/store/useCROStore';
import { Icon } from '@iconify/react';

export function ExitIntentPopup() {
  const isOpen = useUIStore(state => state.isExitIntentOpen);
  const closeExitIntent = useUIStore(state => state.closeExitIntent);
  const hasClosedExitIntent = useCROStore(state => state.hasClosedExitIntent);
  const setHasClosedExitIntent = useCROStore(state => state.setHasClosedExitIntent);
  
  useEffect(() => {
    // 如果用户已经关闭过，不再显示
    if (hasClosedExitIntent) return;
    
    const handleMouseLeave = (e: MouseEvent) => {
      // 检测鼠标是否离开视口顶部
      if (e.clientY <= 0) {
        useUIStore.getState().openExitIntent();
        trackEvent('show', 'Exit Intent', 'Mouse Leave');
      }
    };
    
    // 添加延迟，避免误触发
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000); // 5秒后开始监听
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasClosedExitIntent]);
  
  const handleClose = () => {
    closeExitIntent();
    setHasClosedExitIntent(true);
    trackEvent('close', 'Exit Intent', 'User Action');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* 弹窗内容 */}
      <div className="exit-intent-modal relative z-10 max-w-md w-full mx-4">
        <div className="
          cyber-card-neon
          p-6 sm:p-8
          border-2 border-cyber-brand-500
          shadow-2xl shadow-cyber-brand-500/50
        ">
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-cyber-gray-400 hover:text-cyber-brand-500"
            aria-label="Close"
          >
            <Icon icon="mdi:close" width={24} />
          </button>
          
          {/* 内容 */}
          <div className="text-center">
            <Icon
              icon="heroicons:gift"
              width={64}
              className="mx-auto mb-4 text-cyber-brand-500"
            />
            
            <h3 className="text-2xl font-bold text-cyber-gray-100 mb-2">
              Wait! Don't Miss Out!
            </h3>
            
            <p className="text-cyber-gray-300 mb-6">
              Subscribe to our newsletter and get <strong className="text-cyber-brand-500">an extra 5% off</strong> your first order + exclusive updates.
            </p>
            
            {/* Newsletter 表单 */}
            <NewsletterForm source="exit-intent" onSuccess={handleClose} />
            
            <p className="text-xs text-cyber-gray-500 mt-4">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**触发条件**:
- 用户停留 ≥ 5秒
- 鼠标移出视口顶部
- 每个会话最多显示 1 次

**追踪事件**:
- `exit_intent_show`
- `exit_intent_close`
- `exit_intent_subscribe`

---

### 2.3 Newsletter 订阅表单

**设计**:
```typescript
// src/components/custom/NewsletterForm.tsx
'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Icon } from '@iconify/react';

interface NewsletterFormProps {
  source: 'exit-intent' | 'footer' | 'hero';
  onSuccess?: () => void;
}

const emailSchema = z.string().email('Invalid email address');

export function NewsletterForm({ source, onSuccess }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      
      if (!response.ok) throw new Error('Subscription failed');
      
      setStatus('success');
      trackEvent('subscribe', 'Newsletter', source);
      
      // 更新 CRO store
      useCROStore.getState().setHasSubscribedNewsletter(true);
      
      // 回调
      onSuccess?.();
      
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (status === 'success') {
    return (
      <div className="text-center py-4">
        <Icon
          icon="heroicons:check-circle"
          width={48}
          className="mx-auto mb-2 text-cyber-neon-green"
        />
        <p className="text-cyber-gray-200 font-semibold">
          Thank you for subscribing!
        </p>
        <p className="text-sm text-cyber-gray-400 mt-1">
          Check your inbox for exclusive offers.
        </p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="cyber-input flex-1"
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="cyber-btn-primary px-6 whitespace-nowrap"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      
      {errorMessage && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}
    </form>
  );
}
```

---

### 2.4 快速联系方式（移动端）

**设计**:
```typescript
// src/components/custom/QuickContactButtons.tsx
'use client';

import { Icon } from '@iconify/react';
import { useIsMobile } from '@/lib/hooks';

export function QuickContactButtons() {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  const phone = '+1-800-REALSEE'; // 示例号码
  const whatsapp = '+18001234567';
  
  return (
    <div className="fixed right-4 bottom-20 z-40 flex flex-col gap-3">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
          w-14 h-14 rounded-full
          bg-[#25D366] text-white
          flex items-center justify-center
          shadow-lg hover:scale-110
          transition-transform
        "
        onClick={() => trackEvent('click', 'Quick Contact', 'WhatsApp')}
        aria-label="Contact via WhatsApp"
      >
        <Icon icon="mdi:whatsapp" width={28} />
      </a>
      
      {/* Phone */}
      <a
        href={`tel:${phone.replace(/\D/g, '')}`}
        className="
          w-14 h-14 rounded-full
          bg-cyber-brand-500 text-white
          flex items-center justify-center
          shadow-lg hover:scale-110
          transition-transform
        "
        onClick={() => trackEvent('click', 'Quick Contact', 'Phone')}
        aria-label="Call us"
      >
        <Icon icon="heroicons:phone" width={24} />
      </a>
    </div>
  );
}
```

---

### 2.5 返回顶部按钮

**设计**:
```typescript
// src/components/custom/BackToTop.tsx
'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { cn, scrollToElement } from '@/lib/utils';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // 滚动超过两屏后显示
      setIsVisible(window.scrollY > window.innerHeight * 2);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('click', 'Navigation', 'Back to Top');
  };
  
  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed right-4 bottom-4 z-40",
        "w-12 h-12 rounded-full",
        "bg-cyber-brand-500 text-white",
        "flex items-center justify-center",
        "shadow-lg shadow-cyber-brand-500/50",
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-xl",
        !isVisible && "opacity-0 pointer-events-none scale-0"
      )}
      aria-label="Back to top"
    >
      <Icon icon="heroicons:arrow-up" width={24} />
    </button>
  );
}
```

---

### 2.6 Skeleton Loading

**设计**:
```typescript
// src/components/custom/ProductOffersSkeleton.tsx

export function ProductOffersSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {[1, 2].map((i) => (
        <div key={i} className="cyber-card p-6 sm:p-8">
          {/* 图片骨架 */}
          <div className="skeleton aspect-square mb-6 rounded-lg" />
          
          {/* 标题骨架 */}
          <div className="skeleton h-8 w-3/4 mb-2 rounded" />
          
          {/* 价格骨架 */}
          <div className="flex gap-3 mb-4">
            <div className="skeleton h-10 w-32 rounded" />
            <div className="skeleton h-10 w-24 rounded" />
          </div>
          
          {/* 按钮骨架 */}
          <div className="skeleton h-12 w-full mb-4 rounded-lg" />
          
          {/* What's included 骨架 */}
          <div className="skeleton h-12 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
```

**使用**:
```typescript
import dynamic from 'next/dynamic';

const ProductOffers = dynamic(
  () => import('@/components/custom/ProductOffers'),
  {
    loading: () => <ProductOffersSkeleton />,
    ssr: false,
  }
);
```

---

### 2.7 Google Analytics 4 集成

**文件**: `src/app/layout.tsx`

```typescript
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  
  return (
    <html lang="en" data-theme="cyberpunk">
      <body>
        {children}
        
        {/* Google Analytics 4 */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
```

**关键事件追踪**:
```typescript
// 在相关组件中
import { AnalyticsEvents } from '@/lib/analytics';

// 产品查看
AnalyticsEvents.viewProduct('Galois Premium Bundle');

// 点击购买
AnalyticsEvents.clickBuyNow('Galois Premium Bundle', 4999);

// 表单提交
AnalyticsEvents.submitForm('Residential Real Estate');

// 视频播放
AnalyticsEvents.playVideo('Arthur Review');
```

---

## 三、Phase 2 功能设计

### 3.1 库存提示

```typescript
// src/components/custom/StockIndicator.tsx
'use client';

import { Icon } from '@iconify/react';
import { useCROStore } from '@/store/useCROStore';

interface StockIndicatorProps {
  productId: string;
}

export function StockIndicator({ productId }: StockIndicatorProps) {
  const stockLevel = useCROStore(state => state.stockLevel);
  
  const messages = {
    high: null, // 不显示
    medium: {
      text: 'Limited Stock Available',
      icon: 'heroicons:exclamation-triangle',
      color: 'text-yellow-500',
    },
    low: {
      text: 'Only 5 units left!',
      icon: 'heroicons:fire',
      color: 'text-red-500',
    },
  };
  
  const message = messages[stockLevel];
  
  if (!message) return null;
  
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg",
      "bg-cyber-gray-800/50 border border-cyber-gray-600",
      "animate-pulse"
    )}>
      <Icon icon={message.icon} width={20} className={message.color} />
      <span className="text-sm font-semibold text-cyber-gray-200">
        {message.text}
      </span>
    </div>
  );
}
```

### 3.2 最近购买通知

```typescript
// src/components/custom/SocialProofNotifications.tsx
'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { generateId } from '@/lib/utils';

// Mock 数据
const mockPurchases = [
  { name: 'John D.', location: 'New York', product: 'Premium Bundle' },
  { name: 'Sarah M.', location: 'California', product: 'Standard Kit' },
  { name: 'Michael R.', location: 'Texas', product: 'Premium Bundle' },
];

export function SocialProofNotifications() {
  const notifications = useUIStore(state => state.socialProofQueue);
  const addNotification = useUIStore(state => state.addSocialProof);
  const removeNotification = useUIStore(state => state.removeSocialProof);
  
  useEffect(() => {
    // 每隔 10-20 秒随机显示一条通知
    const interval = setInterval(() => {
      const random = mockPurchases[Math.floor(Math.random() * mockPurchases.length)];
      
      addNotification({
        id: generateId(),
        ...random,
        timestamp: Date.now(),
      });
    }, Math.random() * 10000 + 10000);
    
    return () => clearInterval(interval);
  }, [addNotification]);
  
  return (
    <div className="fixed bottom-20 right-4 z-50 space-y-2">
      {notifications.slice(-3).map((notification) => (
        <SocialProofCard
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function SocialProofCard({ notification, onClose }) {
  useEffect(() => {
    // 5秒后自动关闭
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="social-proof-notification max-w-xs">
      <div className="
        cyber-card p-4
        border border-cyber-brand-500/30
        shadow-lg shadow-cyber-brand-500/20
      ">
        <div className="flex items-start gap-3">
          <Icon
            icon="heroicons:shopping-bag"
            width={24}
            className="text-cyber-brand-500 flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-cyber-gray-100">
              {notification.name} from {notification.location}
            </p>
            <p className="text-xs text-cyber-gray-400">
              just purchased {notification.product}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="text-cyber-gray-500 hover:text-cyber-gray-300 flex-shrink-0"
          >
            <Icon icon="mdi:close" width={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 四、数据追踪清单

### 4.1 页面级别追踪

```typescript
// 页面浏览
trackPageView('/');

// 滚动深度
trackEvent('scroll_depth', 'Engagement', '25%');
trackEvent('scroll_depth', 'Engagement', '50%');
trackEvent('scroll_depth', 'Engagement', '75%');
trackEvent('scroll_depth', 'Engagement', '100%');

// 停留时间
trackEvent('time_on_page', 'Engagement', '30s');
trackEvent('time_on_page', 'Engagement', '60s');
trackEvent('time_on_page', 'Engagement', '120s');
```

### 4.2 转化漏斗追踪

```typescript
// 漏斗步骤
1. 页面加载 → 'page_view'
2. 查看产品 → 'view_item'
3. 点击 Buy Now → 'add_to_cart'
4. 到达外部购买页 → 'begin_checkout'
5. 填写联系表单 → 'begin_checkout'
6. 提交表单 → 'generate_lead'
```

### 4.3 关键指标

```typescript
// 转化率指标
- CTR (Click-Through Rate): 点击购买 / 页面浏览
- Form Completion Rate: 表单提交 / 表单开始
- Bounce Rate: 跳出率
- Avg. Session Duration: 平均会话时长
- Exit Intent Conversion: Exit Intent 转化率

// 参与度指标
- Video Play Rate: 视频播放率
- Expand Details Rate: 展开详情率
- Social Share Rate: 社交分享率
- Newsletter Subscription Rate: Newsletter 订阅率
```

---

## 五、A/B 测试计划

### 5.1 测试假设

| 测试项 | 变体A | 变体B | 指标 |
|-------|------|------|-----|
| CTA 文案 | "Buy Now" | "Shop Now" | 点击率 |
| CTA 文案 | "Buy Now" | "Get Started" | 点击率 |
| 按钮颜色 | 品牌蓝 | 霓虹青 | 点击率 |
| Exit Intent Offer | 5% off | 免费配件 | 转化率 |
| 产品排序 | Premium first | Standard first | 选择比例 |
| 价格展示 | 折扣金额 | 折扣百分比 | 点击率 |

### 5.2 测试工具集成

```typescript
// 使用 Vercel Edge Config 或 Optimizely

// src/lib/ab-testing.ts
export function getVariant(testId: string): 'A' | 'B' {
  // 简单的基于用户 ID 的分桶
  const userId = getUserId(); // 从 cookie 或生成
  const hash = hashCode(userId + testId);
  return hash % 2 === 0 ? 'A' : 'B';
}

// 使用
const variant = getVariant('cta-color-test');

<button className={cn(
  "btn",
  variant === 'A' ? 'bg-cyber-brand-500' : 'bg-cyber-neon-cyan'
)}>
  Buy Now
</button>
```

---

## 六、性能监控

### 6.1 关键性能指标

```typescript
// 使用 @vercel/speed-insights
import { SpeedInsights } from '@vercel/speed-insights/next';

// 在 layout.tsx 中
<SpeedInsights />
```

### 6.2 自定义性能追踪

```typescript
// 追踪自定义性能指标
export function trackPerformance(name: string, value: number) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'timing_complete', {
      name: name,
      value: Math.round(value),
      event_category: 'Performance',
    });
  }
}

// 使用
const start = performance.now();
// ... 执行操作
const end = performance.now();
trackPerformance('form_submission_time', end - start);
```

---

## 七、隐私与合规

### 7.1 Cookie 同意

```typescript
// src/components/custom/CookieConsent.tsx
'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    const consent = storage.get('cookie-consent', null);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);
  
  const acceptCookies = () => {
    storage.set('cookie-consent', 'accepted');
    setShowBanner(false);
    // 启用追踪
    initAnalytics();
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-cyber-gray-900/95 backdrop-blur-md border-t border-cyber-brand-500/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cyber-gray-300">
            We use cookies to improve your experience. By continuing, you accept our{' '}
            <a href="/privacy" className="text-cyber-brand-500 hover:underline">
              Privacy Policy
            </a>.
          </p>
          
          <button
            onClick={acceptCookies}
            className="cyber-btn-primary px-6 py-2 whitespace-nowrap"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 八、验收清单

**MVP 功能**:
- [ ] Sticky CTA 在滚动时正确显示/隐藏
- [ ] Exit Intent 在鼠标离开时触发（仅一次）
- [ ] Newsletter 表单验证和提交正常
- [ ] 移动端快速联系按钮可点击
- [ ] 返回顶部按钮平滑滚动
- [ ] Skeleton Loading 与实际内容布局一致
- [ ] GA4 事件正确追踪

**Phase 2 功能**:
- [ ] 库存提示根据配置显示
- [ ] 最近购买通知随机出现
- [ ] FAQ 悬浮按钮可展开/收起
- [ ] 加载进度条跟随加载状态

**分析与追踪**:
- [ ] 所有关键事件都有追踪
- [ ] 转化漏斗数据正确
- [ ] 性能指标上报
- [ ] 无 PII 数据泄露

**隐私合规**:
- [ ] Cookie 同意横幅显示
- [ ] 隐私政策链接可访问
- [ ] 用户可以撤回同意

