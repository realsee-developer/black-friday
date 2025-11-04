# 架构设计文档 - Black Friday 网站

## 一、技术栈

### 核心框架
- **Next.js 16.0.1** - React 全栈框架，使用 App Router
- **React 19.2.0** - UI 库
- **TypeScript 5** - 类型安全

### 样式系统
- **Tailwind CSS v4** - 原子化 CSS 框架
- **daisyUI 5.1.14** - UI 组件库
- **赛博朋克设计系统** - 从 discover 项目复用

### 状态管理
- **Zustand** - 轻量级状态管理库
- **技术约束**：严格使用 zustand，避免其他状态管理方案

### 表单处理
- **Zod 4** - Schema 验证库
- **react-hook-form** (按需) - 表单状态管理

### UI 组件与图标
- **@iconify/react** - 图标库
- **Next.js Image** - 图片优化

### 开发工具
- **Biome 2.2.0** - 代码格式化与 Lint
- **PostCSS** - CSS 处理

## 二、技术约束与最佳实践

### 2.1 组件渲染策略
- **优先使用服务端组件 (Server Components)**
  - 默认所有组件都是服务端组件
  - 减少客户端 JavaScript 体积
  - 提升首屏加载性能

- **仅在必要时使用客户端组件 (Client Components)**
  - 需要使用 React hooks（useState, useEffect 等）
  - 需要浏览器 API（window, localStorage 等）
  - 需要事件处理器（onClick, onChange 等）
  - 需要使用 zustand store

- **客户端组件标识**
  ```tsx
  'use client';
  
  export function InteractiveComponent() {
    // 客户端逻辑
  }
  ```

### 2.2 状态管理规范
- **全局状态使用 zustand**
  ```tsx
  // src/store/useStore.ts
  import { create } from 'zustand';
  
  export const useStore = create((set) => ({
    // 状态定义
  }));
  ```

- **局部状态优先使用 Server Components + URL 参数**
  - 避免不必要的客户端状态
  - 利用 URL 作为状态源（如 searchParams）

### 2.3 数据获取策略
- **服务端数据获取**
  - 直接在 Server Components 中 fetch
  - 利用 Next.js 自动缓存机制

- **客户端数据获取**
  - 仅用于用户交互后的动态数据
  - 使用 fetch + zustand 管理

## 三、项目目录结构

```
apps/black-friday/
├── public/
│   └── assets/              # 静态资源
│       ├── hero/            # Hero 区块图片
│       ├── products/        # 产品图片
│       ├── partners/        # 第三方平台 logo
│       ├── tours/           # 3D Tours 轮播图
│       ├── 3d-tour-distribution/  # 分享场景配图
│       └── videos/          # 视频占位图
│
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # 根布局
│   │   ├── page.tsx         # 首页
│   │   ├── globals.css      # 全局样式
│   │   ├── robots.ts        # SEO robots
│   │   ├── sitemap.ts       # SEO sitemap
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts # Contact 表单 API
│   │
│   ├── components/
│   │   ├── ui/              # 基础 UI 组件（从 discover 复用）
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   │
│   │   └── custom/          # 业务组件
│   │       ├── SiteHeader.tsx        # 导航栏 (Client)
│   │       ├── SiteFooter.tsx        # 页尾 (Server)
│   │       ├── CountdownTimer.tsx    # 倒计时 (Client)
│   │       ├── HeroSection.tsx       # Hero 区块 (Mixed)
│   │       ├── ProductOffers.tsx     # 产品展示 (Client)
│   │       ├── ShippingInfo.tsx      # 收货说明 (Server)
│   │       ├── RetailPartners.tsx    # 第三方平台 (Server)
│   │       ├── ToursShowcase.tsx     # 轮播 (Client)
│   │       ├── DistributionSection.tsx  # 分享场景 (Server)
│   │       ├── FeaturesSection.tsx   # 特性展示 (Client)
│   │       ├── TestimonialSection.tsx  # 见证区块 (Mixed)
│   │       ├── Professionals.tsx     # 专业人士 (Server)
│   │       ├── GlobalStats.tsx       # 全球统计 (Client)
│   │       └── ContactForm.tsx       # 表单 (Client)
│   │
│   ├── store/               # Zustand 状态管理
│   │   ├── useUIStore.ts    # UI 状态（导航高亮、弹窗等）
│   │   ├── useFormStore.ts  # 表单状态
│   │   └── useDebugStore.ts # Debug 模式状态
│   │
│   ├── lib/                 # 工具函数
│   │   ├── utils.ts         # 通用工具
│   │   ├── time.ts          # 时间处理（美东时间转换）
│   │   ├── features.ts      # 功能开关
│   │   └── analytics.ts     # GA4 追踪
│   │
│   └── types/               # TypeScript 类型定义
│       ├── index.ts         # 导出所有类型
│       ├── product.ts       # 产品相关类型
│       ├── form.ts          # 表单相关类型
│       └── ui.ts            # UI 相关类型
│
├── docs/                    # 设计文档
│   ├── 01-architecture.md   # 本文档
│   ├── 02-components.md     # 组件设计
│   ├── 03-data-flow.md      # 数据流设计
│   ├── 04-styles.md         # 样式系统
│   ├── 05-utilities.md      # 工具函数
│   └── 06-conversion-optimization.md  # 转化优化
│
├── package.json
├── tsconfig.json
├── biome.json
├── postcss.config.mjs
└── next.config.ts
```

## 四、依赖清单

### 生产依赖
```json
{
  "dependencies": {
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "next": "16.0.1",
    "@iconify/react": "^6.0.2",
    "zustand": "^5.0.0",
    "zod": "^4.1.11",
    "react-hook-form": "^7.53.0",
    "react-phone-number-input": "^3.4.8",
    "@vercel/analytics": "^1.5.0",
    "@vercel/speed-insights": "^1.2.0"
  }
}
```

### 开发依赖
```json
{
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "daisyui": "^5.1.14",
    "@biomejs/biome": "2.2.0"
  }
}
```

## 五、环境变量

### 开发环境 (.env.local)
```bash
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google Analytics (可选)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Debug Mode (可选)
NEXT_PUBLIC_DEBUG_MODE=true

# Feature Flags
NEXT_PUBLIC_ENABLE_EXIT_INTENT=true
NEXT_PUBLIC_ENABLE_SOCIAL_PROOF=true
NEXT_PUBLIC_ENABLE_STICKY_CTA=true
```

### 生产环境
```bash
# Base URL
NEXT_PUBLIC_BASE_URL=https://black-friday.realsee.ai

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_EXIT_INTENT=true
NEXT_PUBLIC_ENABLE_SOCIAL_PROOF=false
NEXT_PUBLIC_ENABLE_STICKY_CTA=true
```

## 六、构建与部署

### 开发命令
```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 代码格式化
npm run format

# Lint 检查
npm run lint

# 类型检查
npx tsc --noEmit
```

### 生产构建
```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

### Vercel 部署配置
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "NEXT_PUBLIC_BASE_URL": "https://black-friday.realsee.ai"
  }
}
```

## 七、性能目标

### Lighthouse 指标
- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 95
- **SEO**: ≥ 95

### 核心指标
- **FCP (First Contentful Paint)**: < 1.8s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FID (First Input Delay)**: < 100ms
- **TTI (Time to Interactive)**: < 3.8s

### 资源优化
- 首屏 JavaScript: < 200KB (gzipped)
- 首屏 CSS: < 50KB (gzipped)
- 图片格式: WebP + AVIF fallback
- 字体加载: 使用 Next.js Font Optimization

## 八、浏览器支持

### 桌面端
- Chrome/Edge: 最新两个版本
- Firefox: 最新两个版本
- Safari: 最新两个版本

### 移动端
- iOS Safari: iOS 14+
- Chrome Android: 最新版本
- Samsung Internet: 最新版本

### 兼容性策略
- 使用 PostCSS autoprefixer
- 避免使用实验性 CSS 特性
- 提供降级方案（backdrop-filter 等）
- 遵循 Progressive Enhancement 原则

