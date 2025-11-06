# GTM & GA4 集成指南

本文档描述了 Black Friday 应用中 Google Tag Manager (GTM) 和 Google Analytics 4 (GA4) 的集成方式。

## 环境变量配置

在 `.env.local` 文件中配置以下环境变量：

```bash
# Google Tag Manager ID
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Analytics 4 Measurement ID (在 GTM 中配置)
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

参考 `.env.example` 文件查看所有可用的环境变量。

## 技术实现

### 1. GTM 集成

使用 Next.js 官方的 `@next/third-parties` 包集成 GTM：

- **组件**: `GoogleTagManager` 组件已在 `src/app/layout.tsx` 中集成
- **加载方式**: 自动优化的脚本加载，不影响页面性能
- **条件加载**: 仅在配置了有效的 GTM ID 时加载

### 2. 事件追踪

所有追踪函数都定义在 `src/lib/analytics/gtm.ts` 中，提供类型安全的事件推送。

#### 追踪的事件类型

**表单提交事件** (`form_submit`)

- 位置: `ContactForm.tsx`
- 参数: 行业、国家、设备数量、公司名称等
- 触发时机: 表单成功提交后

**Hero CTA 点击** (`hero_cta_click`)

- 位置: `HeroSection.tsx`
- 参数: CTA 文本、目标链接
- 触发时机: 点击主要 CTA 按钮

**产品按钮点击**

- `product_contact_click`: 点击 "Contact Us" 按钮
- `product_buy_click`: 点击 "Buy Now" 按钮
- 位置: `ProductOffers.tsx`
- 参数: 产品 ID、名称、价格、购买链接

**产品详情展开** (`product_details_view`)

- 位置: `ProductOffers.tsx`
- 参数: 产品 ID、名称、操作类型（expand/collapse）
- 触发时机: 点击 "What's Included" 按钮

**虚拟导览点击** (`tour_launch_click`)

- 位置: `ToursShowcase.tsx`
- 参数: 导览标题、URL、类别
- 触发时机: 点击 "Launch Tour" 按钮

**零售合作伙伴点击** (`retail_shop_click`)

- 位置: `RetailPartners.tsx`
- 参数: 合作伙伴名称、URL
- 触发时机: 点击 "Shop Now" 按钮

**WhatsApp 联系** (`whatsapp_click`)

- 位置: `ContactForm.tsx`
- 参数: 来源位置
- 触发时机: 点击 WhatsApp 按钮

**App 下载** (`download_app_click`)

- 位置: `ContactForm.tsx`
- 参数: 来源位置
- 触发时机: 点击下载按钮

## GTM 配置建议

### 在 GTM 中需要配置的标签

1. **Google Analytics 4 Configuration Tag**
   - 标签类型: GA4 Configuration
   - Measurement ID: 使用环境变量 `{{GA4 Measurement ID}}`
   - 触发器: All Pages

2. **GA4 Event Tags**
   为每个自定义事件创建 GA4 Event 标签：
   - `form_submit`
   - `hero_cta_click`
   - `product_contact_click`
   - `product_buy_click`
   - `product_details_view`
   - `tour_launch_click`
   - `retail_shop_click`
   - `whatsapp_click`
   - `download_app_click`

3. **触发器配置**
   - 触发器类型: Custom Event
   - 事件名称: 对应上述事件名称
   - 触发条件: All Custom Events

4. **变量配置**
   创建 Data Layer Variables 来捕获事件参数：
   - 产品相关: `product_id`, `product_name`, `product_price`
   - 表单相关: `industry`, `country`, `has_company`
   - CTA 相关: `cta_text`, `cta_destination`
   - 等等...

### 推荐的 GA4 转化事件

在 GA4 中将以下事件标记为转化事件：

1. `form_submit` - 主要转化目标
2. `product_buy_click` - 购买意图
3. `product_contact_click` - 联系意图
4. `whatsapp_click` - 直接沟通

## 开发与调试

### 开发模式

在开发环境中：

- 如果未配置 GTM ID 或 ID 为 `GTM-XXXXXXX`，事件会在控制台打印而不会发送
- 可以在浏览器控制台查看所有追踪事件的详细信息

### GTM Preview 模式

1. 在 GTM 中启用 Preview 模式
2. 访问应用 URL
3. 在 GTM Preview 窗口中查看实时事件
4. 验证所有事件和参数是否正确触发

### 浏览器控制台调试

所有事件在发送时都会在控制台打印日志：

```
[Analytics - Sent] { event: 'form_submit', industry: '...', ... }
```

## 类型定义

所有事件类型都定义在 `src/types/analytics.ts` 中，确保：

- 类型安全的事件参数
- IDE 自动完成支持
- 编译时错误检查

## 最佳实践

1. **事件命名**: 使用 snake_case 格式，符合 GA4 规范
2. **参数命名**: 保持一致性，便于后续分析
3. **必要参数**: 每个事件只包含有意义的参数
4. **隐私保护**: 不发送任何 PII（个人身份信息）
5. **性能考虑**: 事件发送不会阻塞用户交互

## 数据分析建议

### 关键指标

1. **表单提交率**: `form_submit` / 页面浏览量
2. **产品交互率**: (`product_contact_click` + `product_buy_click`) / 页面浏览量
3. **导览启动率**: `tour_launch_click` / 页面浏览量
4. **按钮点击热图**: 各 CTA 按钮的点击分布

### 用户行为分析

通过事件序列分析用户转化路径：

1. 页面浏览 → Hero CTA 点击
2. 产品详情展开 → 产品按钮点击
3. 导览启动 → 表单提交

### A/B 测试支持

所有事件都包含足够的上下文信息，支持：

- 不同产品套餐的转化率对比
- 不同 CTA 文案的效果测试
- 不同页面区域的互动率分析

## 故障排查

### 常见问题

**问题**: 事件没有在 GTM 中显示

- 检查 GTM ID 是否正确配置
- 验证环境变量是否在客户端可用（`NEXT_PUBLIC_` 前缀）
- 使用 GTM Preview 模式调试

**问题**: 事件参数缺失

- 检查组件中传递的参数是否完整
- 在控制台查看事件日志
- 验证 TypeScript 类型定义

**问题**: 重复事件

- 检查是否有多次调用追踪函数
- 验证 React 组件是否有重复渲染问题

## 更新日志

- **2024-11**: 初始集成 GTM + GA4
  - 使用 @next/third-parties 包
  - 实现所有关键转化点追踪
  - 添加完整的 TypeScript 类型支持
