# 样式系统设计文档 - Black Friday 网站

## 一、样式架构

### 1.1 技术栈
- **Tailwind CSS v4** - 原子化 CSS 框架
- **daisyUI 5.1.14** - UI 组件库
- **赛博朋克设计系统** - 从 discover 项目复用

### 1.2 样式文件结构

```
src/app/
└── globals.css                 # 全局样式文件
    ├── @import "tailwindcss"   # Tailwind v4
    ├── @plugin "daisyui"        # daisyUI 插件
    ├── @theme { }               # 设计令牌
    ├── [data-theme] { }         # daisyUI 主题变量
    ├── @layer base { }          # 基础样式重置
    ├── @layer components { }    # 可复用组件样式
    └── @layer utilities { }     # 工具类

src/components/
└── [component]/
    └── styles.module.css (可选，特殊情况使用)
```

## 二、从 discover 复用的样式

### 2.1 完整复用 globals.css

**源文件**: `apps/discover/frontend/src/app/globals.css`

**复用内容**:

```css
/* 1. 基础配置 */
@import "tailwindcss";
@plugin "daisyui";

/* 2. 设计令牌（完全复用）*/
@theme {
  /* 字体 */
  --font-family-sans: var(--font-inter), system-ui, -apple-system, sans-serif;
  --font-family-mono: var(--font-jetbrains-mono), 'Fira Code', 'Consolas', monospace;
  --font-family-display: var(--font-orbitron), system-ui, sans-serif;
  
  /* 品牌色阶 */
  --color-cyber-brand-50: #0a0f1a;
  --color-cyber-brand-100: #0f1929; 
  --color-cyber-brand-200: #1a2844;
  --color-cyber-brand-300: #2d4a7a;
  --color-cyber-brand-400: #4d73cc;
  --color-cyber-brand-500: #3366FF; /* 主品牌色 */
  --color-cyber-brand-600: #5577ff;
  --color-cyber-brand-700: #7799ff;
  --color-cyber-brand-800: #99bbff;
  --color-cyber-brand-900: #bbddff;
  
  /* 霓虹色系 */
  --color-cyber-neon-cyan: #00FFFF;
  --color-cyber-neon-magenta: #FF00FF;
  --color-cyber-neon-green: #00FF41;
  --color-cyber-electric-blue: #0099FF;
  --color-cyber-plasma-purple: #8A2BE2;
  
  /* 灰度系统 */
  --color-cyber-gray-900: #0a0a0a;
  --color-cyber-gray-800: #1a1a1a;
  --color-cyber-gray-700: #2a2a2a;
  --color-cyber-gray-600: #404040;
  --color-cyber-gray-500: #666666;
  --color-cyber-gray-400: #999999;
  --color-cyber-gray-300: #cccccc;
  --color-cyber-gray-200: #e6e6e6;
  --color-cyber-gray-100: #f5f5f5;
}

/* 3. daisyUI 赛博朋克主题（完全复用）*/
[data-theme="cyberpunk"], :root {
  --p: 216 100% 50%;     /* primary: #3366FF */
  --pc: 0 0% 100%;       /* primary-content: white */
  --s: 180 100% 50%;     /* secondary: #00FFFF (cyan) */
  --sc: 0 0% 4%;         /* secondary-content: dark */
  --a: 300 100% 50%;     /* accent: #FF00FF (magenta) */
  --ac: 0 0% 100%;       /* accent-content: white */
  --n: 0 0% 4%;          /* neutral: #0a0a0a */
  --nc: 0 0% 95%;        /* neutral-content: #f2f2f2 */
  --b1: 0 0% 10%;        /* base-100: #1a1a1a */
  --b2: 0 0% 16%;        /* base-200: #2a2a2a */
  --b3: 0 0% 25%;        /* base-300: #404040 */
  --bc: 0 0% 95%;        /* base-content: #f2f2f2 */
  /* ... 其他颜色 */
}

/* 4. 基础样式（完全复用）*/
@layer base {
  body {
    @apply bg-cyber-gray-900 text-cyber-gray-200 antialiased;
  }
  /* ... */
}

/* 5. 赛博朋克组件样式（完全复用）*/
@layer components {
  .cyber-btn-primary { /* ... */ }
  .cyber-input { /* ... */ }
  .cyber-card { /* ... */ }
  .cyber-card-neon { /* ... */ }
}

/* 6. 工具类（完全复用）*/
@layer utilities {
  .cyber-nav-link { /* ... */ }
  .cyber-neon-text { /* ... */ }
  .cyber-glow-box { /* ... */ }
  .cyber-gradient-bg { /* ... */ }
  .cyber-grid { /* ... */ }
  .cyber-divider { /* ... */ }
  .cyber-focus { /* ... */ }
}

/* 7. 动画关键帧（完全复用）*/
@keyframes cyber-glow { /* ... */ }
@keyframes neon-flicker { /* ... */ }
@keyframes marquee { /* ... */ }
```

### 2.2 新增的黑五特定样式

在 discover 样式基础上，新增以下样式：

```css
/* 倒计时数字翻转动画 */
@keyframes countdown-flip {
  0% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(-180deg);
  }
}

.countdown-digit {
  animation: countdown-flip 0.6s ease-in-out;
}

/* 倒计时发光效果 */
.countdown-glow {
  text-shadow:
    0 0 10px var(--color-cyber-brand-500),
    0 0 20px var(--color-cyber-brand-500),
    0 0 30px var(--color-cyber-brand-500),
    0 0 40px var(--color-cyber-brand-600);
  animation: countdown-pulse 2s ease-in-out infinite alternate;
}

@keyframes countdown-pulse {
  0% {
    text-shadow:
      0 0 10px var(--color-cyber-brand-500),
      0 0 20px var(--color-cyber-brand-500);
  }
  100% {
    text-shadow:
      0 0 20px var(--color-cyber-brand-500),
      0 0 30px var(--color-cyber-brand-500),
      0 0 40px var(--color-cyber-brand-600);
  }
}

/* 产品卡片特殊效果 */
.product-card-featured {
  position: relative;
  border: 2px solid var(--color-cyber-brand-500);
  box-shadow: 
    0 0 20px rgba(51, 102, 255, 0.3),
    0 0 40px rgba(51, 102, 255, 0.2),
    inset 0 0 20px rgba(51, 102, 255, 0.1);
}

.product-card-featured::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(
    45deg,
    var(--color-cyber-brand-500),
    var(--color-cyber-neon-cyan),
    var(--color-cyber-brand-500)
  );
  background-size: 400% 400%;
  animation: gradient-border 3s ease infinite;
  z-index: -1;
  border-radius: inherit;
  opacity: 0.5;
}

@keyframes gradient-border {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Sticky CTA 按钮动画 */
.sticky-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
}

.sticky-cta.visible {
  transform: translateY(0);
}

/* Exit Intent Modal 动画 */
.exit-intent-modal {
  animation: modal-slide-up 0.3s ease-out;
}

@keyframes modal-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 社交证明通知动画 */
.social-proof-notification {
  animation: notification-slide-in 0.4s ease-out;
}

@keyframes notification-slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.social-proof-notification.exit {
  animation: notification-slide-out 0.4s ease-in forwards;
}

@keyframes notification-slide-out {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* 加载进度条 */
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--color-cyber-brand-500),
    var(--color-cyber-neon-cyan)
  );
  transition: width 0.3s ease-out;
  z-index: 9999;
  box-shadow: 0 0 10px var(--color-cyber-brand-500);
}

/* FAQ 悬浮按钮 */
.faq-float-button {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-cyber-brand-500);
  box-shadow: 
    0 4px 20px rgba(51, 102, 255, 0.4),
    0 0 30px rgba(51, 102, 255, 0.3);
  transition: all 0.3s ease;
  z-index: 40;
}

.faq-float-button:hover {
  transform: scale(1.1);
  box-shadow: 
    0 6px 25px rgba(51, 102, 255, 0.5),
    0 0 40px rgba(51, 102, 255, 0.4);
}

/* 骨架屏加载动画 */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-cyber-gray-800) 25%,
    var(--color-cyber-gray-700) 50%,
    var(--color-cyber-gray-800) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 世界地图动画 */
.world-map-region {
  opacity: 0;
  animation: region-fade-in 0.5s ease-out forwards;
}

.world-map-region:nth-child(1) { animation-delay: 0.1s; }
.world-map-region:nth-child(2) { animation-delay: 0.2s; }
.world-map-region:nth-child(3) { animation-delay: 0.3s; }
.world-map-region:nth-child(4) { animation-delay: 0.4s; }
.world-map-region:nth-child(5) { animation-delay: 0.5s; }
.world-map-region:nth-child(6) { animation-delay: 0.6s; }
.world-map-region:nth-child(7) { animation-delay: 0.7s; }
.world-map-region:nth-child(8) { animation-delay: 0.8s; }

@keyframes region-fade-in {
  from {
    opacity: 0;
    fill: var(--color-cyber-gray-700);
  }
  to {
    opacity: 1;
    fill: var(--color-cyber-brand-500);
  }
}
```

## 三、响应式设计策略

### 3.1 断点系统

```css
/* Tailwind 默认断点 */
sm: 640px   /* 小屏手机（横屏）及以上 */
md: 768px   /* 平板及以上 */
lg: 1024px  /* 桌面及以上 */
xl: 1280px  /* 大桌面及以上 */
2xl: 1536px /* 超大桌面 */
```

### 3.2 容器宽度

```typescript
// 主内容容器
<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
  {/* 内容 */}
</div>

// 窄内容容器（表单等）
<div className="container mx-auto px-4 max-w-3xl">
  {/* 内容 */}
</div>

// 全宽容器
<div className="w-full px-4 sm:px-6">
  {/* 内容 */}
</div>
```

### 3.3 响应式文本

```typescript
// 主标题
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">

// 副标题
<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">

// 正文
<p className="text-base sm:text-lg leading-relaxed">

// 小字
<span className="text-sm sm:text-base">
```

### 3.4 响应式间距

```typescript
// 区块间距
<section className="py-12 sm:py-16 md:py-20 lg:py-28">

// 内容间距
<div className="space-y-4 sm:space-y-6 md:space-y-8">

// 网格间距
<div className="grid gap-4 sm:gap-6 md:gap-8">
```

## 四、组件样式设计

### 4.1 SiteHeader 样式

```typescript
// 固定顶部导航
<header className="
  fixed top-0 left-0 right-0 z-50
  bg-cyber-gray-900/80 backdrop-blur-md
  border-b border-cyber-gray-700/50
  transition-all duration-300
">
  <nav className="container mx-auto px-4 sm:px-6">
    {/* Desktop 导航 */}
    <div className="hidden md:flex items-center justify-between h-16">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Realsee" />
      </div>
      
      {/* 导航 tabs */}
      <ul className="flex items-center gap-8">
        {tabs.map(tab => (
          <li key={tab.id}>
            <a
              href={`#${tab.id}`}
              className={cn(
                "cyber-nav-link text-sm font-medium",
                activeSection === tab.id && "text-cyber-brand-500"
              )}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
    
    {/* Mobile 汉堡菜单 */}
    <div className="md:hidden flex items-center justify-between h-14">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Realsee" />
      </div>
      
      {/* 汉堡按钮 */}
      <button
        onClick={toggleMobileMenu}
        className="p-2 text-cyber-gray-200 hover:text-cyber-brand-500"
        aria-label="Toggle menu"
      >
        <Icon icon={isMobileMenuOpen ? "mdi:close" : "mdi:menu"} width={24} />
      </button>
    </div>
  </nav>
  
  {/* Mobile 菜单抽屉 */}
  <div className={cn(
    "md:hidden absolute top-full left-0 right-0",
    "bg-cyber-gray-900 border-b border-cyber-gray-700",
    "transition-all duration-300",
    isMobileMenuOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
  )}>
    <ul className="py-4">
      {tabs.map(tab => (
        <li key={tab.id}>
          <a
            href={`#${tab.id}`}
            onClick={closeMobileMenu}
            className={cn(
              "block px-6 py-3 text-base font-medium",
              "hover:bg-cyber-gray-800 hover:text-cyber-brand-500",
              activeSection === tab.id && "text-cyber-brand-500 bg-cyber-gray-800/50"
            )}
          >
            {tab.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</header>
```

### 4.2 CountdownTimer 样式

```typescript
<div className="flex flex-col items-center gap-6">
  {/* 标题 */}
  <div className="text-center">
    <p className="text-lg sm:text-xl text-cyber-brand-500 font-semibold uppercase tracking-wider">
      {stage === 'before' && '距活动开始'}
      {stage === 'active' && '活动进行中'}
      {stage === 'ending' && '距活动结束'}
      {stage === 'ended' && '活动已结束'}
    </p>
  </div>
  
  {/* 倒计时数字 */}
  <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
    {/* 天 */}
    <div className="flex flex-col items-center">
      <div className="
        countdown-digit countdown-glow
        relative bg-cyber-gray-800 rounded-lg
        px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6
        border-2 border-cyber-brand-500/50
        shadow-lg shadow-cyber-brand-500/30
      ">
        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cyber-gray-100">
          {days.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-xs sm:text-sm text-cyber-gray-400 uppercase">Days</span>
    </div>
    
    {/* 分隔符 */}
    <span className="text-3xl sm:text-4xl md:text-5xl text-cyber-brand-500 countdown-glow">:</span>
    
    {/* 小时 */}
    <div className="flex flex-col items-center">
      {/* ... 同上 */}
    </div>
    
    <span className="text-3xl sm:text-4xl md:text-5xl text-cyber-brand-500 countdown-glow">:</span>
    
    {/* 分钟 */}
    <div className="flex flex-col items-center">
      {/* ... 同上 */}
    </div>
  </div>
</div>
```

### 4.3 ProductOffers 样式

```typescript
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
  {/* Standard Kit */}
  <div className="
    cyber-card-neon
    flex flex-col
    p-6 sm:p-8
    transition-transform duration-300
    hover:scale-105
  ">
    {/* 产品图片 */}
    <div className="relative aspect-square mb-6 rounded-lg overflow-hidden">
      <Image
        src="/assets/products/galois-standard-kit.jpg"
        alt="Galois Standard Kit"
        fill
        className="object-cover"
      />
    </div>
    
    {/* 产品信息 */}
    <h3 className="text-2xl font-bold text-cyber-gray-100 mb-2">
      Galois Standard Kit
    </h3>
    
    {/* 价格 */}
    <div className="flex items-baseline gap-3 mb-4">
      <span className="text-3xl font-bold text-cyber-brand-500">
        ${discountedPrice}
      </span>
      <span className="text-xl text-cyber-gray-500 line-through">
        ${originalPrice}
      </span>
      <span className="text-sm text-cyber-neon-green font-semibold">
        Save ${discount} ({discountPercentage}% off)
      </span>
    </div>
    
    {/* 按钮 */}
    <button className="cyber-btn-primary w-full mb-4">
      {isBeforeNov03 ? 'Contact Us' : 'Buy Now'}
    </button>
    
    {/* What's included */}
    <button
      onClick={() => toggleExpanded(product.id)}
      className="
        flex items-center justify-between
        p-3 rounded-lg
        border border-cyber-gray-600
        hover:border-cyber-brand-500
        transition-colors
      "
    >
      <span className="text-sm font-medium text-cyber-gray-200">
        What's included
      </span>
      <Icon
        icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
        width={20}
      />
    </button>
    
    {/* 展开内容（Desktop: inline, Mobile: modal）*/}
    {expanded && (
      <div className="mt-4 p-4 bg-cyber-gray-800/50 rounded-lg">
        {/* 内容列表 */}
      </div>
    )}
  </div>
  
  {/* Premium Bundle（特殊样式）*/}
  <div className="
    product-card-featured
    flex flex-col
    p-6 sm:p-8
    transition-transform duration-300
    hover:scale-105
    lg:scale-105
  ">
    {/* 推荐徽章 */}
    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
      <span className="
        px-4 py-1 rounded-full
        bg-gradient-to-r from-cyber-brand-500 to-cyber-neon-cyan
        text-sm font-bold text-white
        shadow-lg shadow-cyber-brand-500/50
      ">
        MOST POPULAR
      </span>
    </div>
    
    {/* ... 其余内容同上，但样式更突出 */}
  </div>
</div>
```

## 五、动画性能优化

### 5.1 使用 CSS Transform

```css
/* ✅ 推荐：使用 transform */
.animated-element {
  transition: transform 0.3s ease;
}

.animated-element:hover {
  transform: translateY(-4px);
}

/* ❌ 避免：使用 top/left */
.animated-element {
  transition: top 0.3s ease; /* 会触发 layout */
}
```

### 5.2 启用 GPU 加速

```css
.gpu-accelerated {
  transform: translateZ(0); /* 启用 GPU 加速 */
  will-change: transform, opacity; /* 提示浏览器优化 */
}
```

### 5.3 遵循用户偏好

```css
/* 为减少动画偏好的用户禁用动画 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .countdown-digit {
    animation: none;
  }
  
  .product-card-featured::before {
    animation: none;
  }
}
```

## 六、WCAG 2.2 AA 合规性

### 6.1 文本对比度

```typescript
// 所有文本必须满足对比度要求
const textColors = {
  // ✅ 合规：白字 on 深灰背景 = 14.5:1
  primary: 'text-cyber-gray-100 bg-cyber-gray-900',
  
  // ✅ 合规：浅灰字 on 深灰背景 = 7.2:1
  secondary: 'text-cyber-gray-300 bg-cyber-gray-900',
  
  // ✅ 合规：品牌蓝 on 深灰背景 = 5.8:1
  accent: 'text-cyber-brand-500 bg-cyber-gray-900',
  
  // ❌ 不合规：品牌蓝 on 白背景 = 3.5:1（小于4.5:1）
  // 解决方案：使用更深的蓝色变体
  fixedAccent: 'text-cyber-brand-300 bg-white', // 4.6:1
};
```

### 6.2 焦点样式

```css
/* 统一的焦点样式 */
.cyber-focus:focus-visible {
  outline: 2px solid var(--color-cyber-brand-500);
  outline-offset: 2px;
  border-radius: 4px;
}

/* 所有交互元素必须有焦点样式 */
button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  @apply cyber-focus;
}
```

### 6.3 触摸目标大小

```css
/* 移动端按钮最小尺寸 44x44px */
@media (max-width: 768px) {
  button,
  a[role="button"] {
    min-width: 44px;
    min-height: 44px;
    padding: 12px 16px;
  }
}
```

## 七、Dark Mode 策略

本站点**仅支持暗色模式**（赛博朋克主题）：

```typescript
// layout.tsx
<html lang="en" data-theme="cyberpunk" className="dark">
  <body className="bg-cyber-gray-900 text-cyber-gray-200">
    {children}
  </body>
</html>
```

不提供亮色模式切换。

## 八、打印样式（可选）

```css
@media print {
  /* 隐藏不需要打印的元素 */
  .no-print,
  header,
  footer,
  .sticky-cta,
  .faq-float-button {
    display: none !important;
  }
  
  /* 调整为打印友好的颜色 */
  body {
    background: white;
    color: black;
  }
  
  /* 移除发光效果 */
  .countdown-glow,
  .cyber-neon-text {
    text-shadow: none;
  }
}
```

## 九、样式测试清单

- [ ] 所有颜色使用 CSS 变量，无硬编码
- [ ] 文本对比度符合 WCAG 2.2 AA
- [ ] 所有动画遵循 `prefers-reduced-motion`
- [ ] 焦点样式清晰可见
- [ ] 移动端触摸目标 ≥ 44x44px
- [ ] 响应式布局在所有断点正常
- [ ] 无水平滚动条
- [ ] 骨架屏与实际内容布局一致
- [ ] 加载状态不会导致布局跳动（CLS < 0.1）

