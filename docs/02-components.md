# 组件设计文档 - Black Friday 网站

## 一、组件分类

### 1.1 服务端组件 (Server Components)
优先使用，无需客户端 JavaScript，性能最优：
- SiteFooter
- ShippingInfo
- RetailPartners
- DistributionSection

### 1.2 客户端组件 (Client Components)
包含交互逻辑，需要 `'use client'`：
- SiteHeader（导航高亮）
- CountdownTimer（实时倒计时）
- ProductOffers（折叠展开）
- ToursShowcase（轮播）
- FeaturesSection（手风琴）
- GlobalStats（动画）
- ContactForm（表单交互）

### 1.3 混合组件 (Mixed)
部分子组件为客户端组件：
- HeroSection（包含 CountdownTimer）
- TestimonialSection（包含多个子组件）

## 二、核心组件设计

### 2.1 SiteHeader (导航栏)

**文件**: `src/components/custom/SiteHeader.tsx`

**类型**: Client Component

**Props 接口**:
```typescript
interface SiteHeaderProps {
  className?: string;
}
```

**状态管理**:
```typescript
// 使用 zustand store
interface UIStore {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}
```

**功能需求**:
- 5个导航 tab，点击平滑滚动到对应区块
- 使用 Intersection Observer 监听滚动，自动高亮当前区块
- 移动端汉堡菜单（< 768px）
- 滚动时添加背景模糊和阴影效果
- 固定在页面顶部

**响应式策略**:
- Desktop (≥ 1024px): 横向导航栏，所有 tab 可见
- Tablet (768px - 1023px): 横向导航栏，可能需要缩小字体
- Mobile (< 768px): 汉堡菜单，侧边抽屉或全屏菜单

**可访问性**:
- `<nav>` 语义化标签
- `aria-current="page"` 标识当前激活项
- 键盘导航支持（Tab、Enter）
- 焦点样式使用 `cyber-focus`

---

### 2.2 CountdownTimer (倒计时)

**文件**: `src/components/custom/CountdownTimer.tsx`

**类型**: Client Component

**Props 接口**:
```typescript
interface CountdownTimerProps {
  className?: string;
  // 可选：外部控制的目标时间
  targetDate?: Date;
}

// 倒计时阶段
type CountdownStage = 'before' | 'active' | 'ending' | 'ended';

// 倒计时数据
interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  stage: CountdownStage;
  message: string;
}
```

**状态管理**:
```typescript
// 使用 zustand store（用于 debug）
interface DebugStore {
  forcedStage: CountdownStage | null;
  setForcedStage: (stage: CountdownStage | null) => void;
}
```

**功能需求**:
- 实时倒计时，每秒更新
- 美东时间计算（EST/EDT）
- 根据当前时间判断阶段：
  - before: 2025/11/10-2025/11/17 → "距活动开始"
  - active: 2025/11/17-2025/12/01 → "活动进行中"
  - ending: 2025/12/01-2025/12/07 → "距活动结束"
  - ended: 2025/12/07之后 → "活动已结束"
- Debug 模式：通过 URL `?stage=before|active|ending|ended` 强制阶段
- 数字翻转动画（flip animation）
- 赛博朋克发光效果

**响应式策略**:
- Desktop: 横向排列，大数字 (text-6xl)
- Mobile: 可能需要缩小或竖向排列

**动画细节**:
```css
/* 数字翻转动画 */
@keyframes flip {
  from { transform: rotateX(0deg); }
  to { transform: rotateX(-180deg); }
}

/* 霓虹发光 */
.countdown-digit {
  text-shadow: 
    0 0 10px var(--cyber-brand-500),
    0 0 20px var(--cyber-brand-500),
    0 0 30px var(--cyber-brand-500);
}
```

---

### 2.3 ProductOffers (产品展示)

**文件**: `src/components/custom/ProductOffers.tsx`

**类型**: Client Component

**Props 接口**:
```typescript
interface ProductSKU {
  id: string;
  name: string;
  subtitle: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  discountPercentage: number;
  featured: boolean; // Premium Bundle 为 true
  image: string;
  buyUrl: string;
  whatsIncluded: IncludedItem[];
}

interface IncludedItem {
  title: string;
  items: string[];
  value?: string;
}

interface ProductOffersProps {
  className?: string;
}
```

**状态管理**:
```typescript
// 组件内部状态
const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
const [showMobileModal, setShowMobileModal] = useState(false);
```

**功能需求**:
- 展示 2 个 SKU：Premium Bundle（突出显示）和 Standard Kit
- 价格对比：原价删除线 + 折扣价高亮
- 折扣信息徽章
- "What's included" 折叠/展开：
  - Desktop: 手风琴（inline expansion）
  - Mobile: 底部浮层（modal/drawer）
- 时间控制按钮文案：
  - 11/03 前: "Contact Us"
  - 11/03 后: "Buy Now"

**响应式策略**:
- Desktop: 2列并排，Premium Bundle 略大或有特殊边框
- Tablet: 2列并排，可能缩小
- Mobile: 单列堆叠

**视觉差异化**:
```typescript
// Premium Bundle 特殊样式
const premiumStyles = {
  border: '2px solid var(--cyber-brand-500)',
  boxShadow: '0 0 30px rgba(51, 102, 255, 0.3)',
  transform: 'scale(1.05)', // Desktop only
};
```

---

### 2.4 ToursShowcase (案例轮播)

**文件**: `src/components/custom/ToursShowcase.tsx`

**类型**: Client Component

**Props 接口**:
```typescript
interface TourCase {
  id: string;
  title: string;
  url: string;
  image: string; // 占位图路径
}

interface ToursShowcaseProps {
  className?: string;
  autoPlayInterval?: number; // 默认 5000ms
}
```

**状态管理**:
```typescript
const [currentIndex, setCurrentIndex] = useState(0);
const [isPlaying, setIsPlaying] = useState(true);
const [isHovered, setIsHovered] = useState(false);
```

**功能需求**:
- 7个案例轮播
- 自动播放（可配置间隔）
- 鼠标悬停暂停
- 左右切换按钮
- 底部指示器（dots）
- Ken Burns 呼吸效果：图片缓慢放大 + 淡入淡出
- 点击图片打开新标签页访问 3D Tour

**响应式策略**:
- Desktop: 16:9 大图
- Mobile: 可能是 4:3 或全宽

**动画细节**:
```css
/* Ken Burns 效果 */
@keyframes kenburns {
  0% { 
    transform: scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% { 
    transform: scale(1.1);
    opacity: 0;
  }
}
```

---

### 2.5 FeaturesSection (特性展示)

**文件**: `src/components/custom/FeaturesSection.tsx`

**类型**: Client Component

**Props 接口**:
```typescript
interface Feature {
  id: string;
  title: string;
  description: string;
  video: string; // 视频占位图或视频URL
}

interface FeaturesSectionProps {
  className?: string;
}
```

**状态管理**:
```typescript
const [activeFeature, setActiveFeature] = useState(0);
```

**功能需求**:
- 4个特性内容
- Desktop: 左侧视频，右侧手风琴（点击切换）
- Mobile: 视频在上，内容在下，tab 切换
- 视频区域随着特性切换更新
- 平滑过渡动画

**响应式策略**:
- Desktop (≥ 1024px): 左右布局，6:4 或 1:1 比例
- Mobile (< 1024px): 上下堆叠，tab 切换

**交互设计**:
```typescript
// 手风琴项
const AccordionItem = ({ feature, isActive, onClick }) => (
  <div 
    onClick={onClick}
    className={cn(
      "cursor-pointer transition-all",
      isActive && "border-l-4 border-cyber-brand-500"
    )}
  >
    {/* content */}
  </div>
);
```

---

### 2.6 ContactForm (联系表单)

**文件**: `src/components/custom/ContactForm.tsx`

**类型**: Client Component

**Props 接口**:
```typescript
interface ContactFormProps {
  className?: string;
  onSuccess?: () => void;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  country?: string;
  industry: Industry;
  inquiry: string;
  otherProducts?: string;
}

enum Industry {
  Photography = 'Photography Service',
  Residential = 'Residential Real Estate',
  Commercial = 'Commercial Real Estate',
  AEC = 'Architecture, Engineering, Construction',
  Travel = 'Travel, Hospitality',
  Retail = 'Retail, Restaurant',
  Other = 'Other',
}
```

**状态管理**:
```typescript
// 使用 zustand store
interface FormStore {
  formData: ContactFormData;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  updateField: (field: keyof ContactFormData, value: any) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}
```

**表单验证 (Zod Schema)**:
```typescript
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  countryCode: z.string(),
  country: z.string().optional(),
  industry: z.nativeEnum(Industry),
  inquiry: z.string().min(10, 'Please provide more details'),
  otherProducts: z.string().optional(),
});
```

**功能需求**:
- 所有必填字段验证
- 手机号区号选择（react-phone-number-input）
- 国家/地区选择，与区号联动
- 特别注意：
  - 中国台湾省 (Taiwan, Province of China)
  - 中国香港特别行政区 (Hong Kong SAR, China)
  - 中国澳门特别行政区 (Macao SAR, China)
- 实时验证反馈
- 提交状态显示（loading、success、error）
- 提交到 `/api/contact`

**响应式策略**:
- Desktop: 2列表单布局
- Mobile: 单列堆叠

**可访问性**:
- 每个字段有 `<label>`
- 错误提示与字段关联 (`aria-describedby`)
- 提交按钮禁用状态清晰
- 焦点管理

---

### 2.7 GlobalStats (全球统计)

**文件**: `src/components/custom/GlobalStats.tsx`

**类型**: Client Component

**Props 接口**:
```typescript
interface Stat {
  label: string;
  value: string;
  icon?: string;
}

interface GlobalStatsProps {
  className?: string;
}
```

**状态管理**:
```typescript
const [isVisible, setIsVisible] = useState(false);
const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0]);
```

**功能需求**:
- 左侧：世界地图 SVG，动画绘制覆盖区域
- 右侧：4个统计指标卡片
  - 50+ Countries
  - 50 Million Spaces Scanned
  - 3000+ Partnership Companies
  - 600+ Patents
- 滚动到视野时触发数字递增动画
- 地图区域逐个点亮

**响应式策略**:
- Desktop: 左右布局（6:6 或 5:7）
- Mobile: 地图在上，统计在下

**动画实现**:
```typescript
// 数字递增动画
const animateNumber = (target: number, duration: number) => {
  const start = 0;
  const startTime = performance.now();
  
  const step = (currentTime: number) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const current = Math.floor(progress * target);
    setAnimatedValues(prev => [...prev, current]);
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  
  requestAnimationFrame(step);
};
```

---

## 三、复用组件

### 3.1 SiteFooter

**来源**: `apps/discover/frontend/src/components/custom/SiteFooter.tsx`

**修改**:
- 可能需要调整链接
- 保持视觉风格一致

### 3.2 Professionals

**来源**: `apps/discover/frontend/src/components/custom/home/Professionals.tsx`

**修改**:
- 标题改为 "Realsee Galois Professionals"
- 其余完全复用

---

## 四、服务端组件

### 4.1 ShippingInfo

**文件**: `src/components/custom/ShippingInfo.tsx`

**类型**: Server Component

**Props 接口**:
```typescript
interface ShippingPoint {
  title: string;
  description: string;
  icon: string; // CDN URL
}

interface ShippingInfoProps {
  className?: string;
}
```

**数据**:
```typescript
const shippingPoints: ShippingPoint[] = [
  {
    title: 'Data Security',
    icon: 'https://global-public.realsee-cdn.com/release/pagepress/MThhVIKC/uploads/ef809007-4259-43af-ade6-fb15af6e10a4.jpg',
    description: 'Your data is securely stored on AWS...',
  },
  // ... 其他3个
];
```

**布局**:
- Desktop: 4列网格 `grid-cols-4`
- Tablet: 2列 `md:grid-cols-2`
- Mobile: 1列 `grid-cols-1`

---

### 4.2 RetailPartners

**文件**: `src/components/custom/RetailPartners.tsx`

**类型**: Server Component

**Props 接口**:
```typescript
interface Partner {
  name: string;
  logo: string; // 占位或从官网获取
  url: string;
}

interface RetailPartnersProps {
  className?: string;
}
```

**数据**:
```typescript
const partners: Partner[] = [
  {
    name: 'B&H Photo Video',
    logo: '/assets/partners/bh-logo.png',
    url: 'https://www.bhphotovideo.com/c/product/1791796-REG/...',
  },
  // Adorama, Robotshop
];
```

**布局**:
- Desktop: 3列并排
- Mobile: 单列堆叠或 2列

---

### 4.3 DistributionSection

**文件**: `src/components/custom/DistributionSection.tsx`

**类型**: Server Component

**Props 接口**:
```typescript
interface DistributionFeature {
  title: string;
  description: string;
  image: string;
}

interface DistributionSectionProps {
  className?: string;
}
```

**数据**:
```typescript
const features: DistributionFeature[] = [
  {
    title: 'One Click Sharing',
    description: 'Facebook, X, GSV and more',
    image: '/assets/3d-tour-distribution/one-click-sharing.jpg',
  },
  // ... 其他3个
];
```

**布局**:
- Desktop: 图文左右交替布局
- Mobile: 图在上，文在下堆叠

---

## 五、组件通信与状态流

### 5.1 Zustand Stores

```typescript
// src/store/useUIStore.ts
export const useUIStore = create<UIStore>((set) => ({
  activeSection: '',
  setActiveSection: (section) => set({ activeSection: section }),
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ 
    isMobileMenuOpen: !state.isMobileMenuOpen 
  })),
}));

// src/store/useDebugStore.ts
export const useDebugStore = create<DebugStore>((set) => ({
  forcedStage: null,
  setForcedStage: (stage) => set({ forcedStage: stage }),
}));

// src/store/useFormStore.ts
export const useFormStore = create<FormStore>((set, get) => ({
  formData: initialFormData,
  isSubmitting: false,
  submitStatus: 'idle',
  updateField: (field, value) => set((state) => ({
    formData: { ...state.formData, [field]: value }
  })),
  submitForm: async () => {
    set({ isSubmitting: true });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(get().formData),
      });
      set({ submitStatus: response.ok ? 'success' : 'error' });
    } catch {
      set({ submitStatus: 'error' });
    } finally {
      set({ isSubmitting: false });
    }
  },
  resetForm: () => set({ formData: initialFormData, submitStatus: 'idle' }),
}));
```

### 5.2 组件间通信

```typescript
// SiteHeader 监听滚动，更新 activeSection
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          useUIStore.getState().setActiveSection(entry.target.id);
        }
      });
    },
    { threshold: 0.5 }
  );
  
  // 观察所有区块
  sections.forEach(section => observer.observe(section));
  
  return () => observer.disconnect();
}, []);
```

---

## 六、性能优化策略

### 6.1 代码分割
```typescript
// 懒加载非首屏组件
const GlobalStats = dynamic(() => import('@/components/custom/GlobalStats'), {
  loading: () => <GlobalStatsSkeleton />,
  ssr: false,
});
```

### 6.2 图片优化
```typescript
<Image
  src="/assets/tours/luxury-residential.jpg"
  alt="Luxury Residential Tour"
  width={1920}
  height={1080}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  priority={false} // 仅首屏图片设为 true
/>
```

### 6.3 动画性能
```css
/* 使用 transform 和 opacity，避免 layout 重绘 */
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0); /* 启用 GPU 加速 */
}
```

---

## 七、测试清单

### 7.1 单元测试（可选）
- 工具函数测试（时间转换、表单验证）
- Zustand store 测试

### 7.2 集成测试
- 导航滚动联动
- 表单提交流程
- 倒计时 debug 模式

### 7.3 视觉回归测试
- Storybook stories（可选）
- 截图对比

### 7.4 可访问性测试
- Lighthouse Accessibility 得分 ≥ 95
- 键盘导航完整路径
- 屏幕阅读器测试（VoiceOver/NVDA）

