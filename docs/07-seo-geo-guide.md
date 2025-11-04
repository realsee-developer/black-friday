# SEO/GEO 优化指南

## 概述

本指南介绍 black-friday.realsee.ai 项目的 SEO 和 GEO 优化实践，确保网站能够被全球搜索引擎和 AI 大模型正确索引和理解。

## 核心组件

### 1. Robots.txt 配置

动态 robots.txt 通过 `src/app/robots.ts` 生成，支持：

- **传统搜索引擎**：Google, Bing, Baidu, Yandex, DuckDuckGo
- **AI 搜索引擎**：GPTBot, Claude-Web, PerplexityBot, Google-Extended, Amazonbot, Meta AI, Apple Intelligence

**关键配置：**

```typescript
// 高优先级爬虫（Google, Bing）: crawlDelay: 0
// AI 爬虫和其他引擎: crawlDelay: 1
// 禁止访问: /api/, /admin/
```

### 2. Hreflang 标签

通过 `src/lib/seo-utils.ts` 的 `generateGlobalAlternates()` 函数生成全球市场的 hreflang 标签。

**支持的市场：**

- 北美：en-US, en-CA
- 欧洲：en-GB, de-DE, fr-FR, es-ES, it-IT, nl-NL, pl-PL, pt-PT
- 亚太：en-AU, en-SG, en-NZ, ja-JP, zh-CN, zh-TW, zh-HK, ko-KR
- 中东：en-AE, ar-AE, en-SA
- 拉美：es-MX, pt-BR, es-AR, es-CL
- 其他：en-IN, en-ZA, ru-RU

**注意：** 目前所有市场都指向同一个英文版本，但为未来多语言扩展预留了结构。

### 3. 结构化数据 (Schema.org)

通过 `src/lib/structured-data.ts` 实现，包含：

#### Organization Schema

- 公司基本信息
- 社交媒体链接
- 联系方式

#### Event Schema

- 黑五活动详情
- 活动时间：2025-11-17 至 2025-12-07
- 优惠信息和产品列表

#### Product Schema

- Premium Bundle 和 Standard Kit
- 价格、库存、配送信息
- 评分和评论统计

#### FAQ Schema

- 常见问题解答
- 帮助 AI 理解产品特性

#### HowTo Schema

- Galois 相机使用指南
- 分步骤说明
- 帮助用户和 AI 理解产品用法

#### WebSite Schema

- 网站基本信息
- 搜索功能（如有）

#### Breadcrumb Schema

- 网站导航结构
- 帮助搜索引擎理解页面层级

### 4. Sitemap

动态生成的 sitemap (`src/app/sitemap.ts`) 包含：

- **优先级**：1.0（主页）
- **更新频率**：活动期间为 hourly，其他时间为 daily
- **最后修改时间**：活动期间使用当前时间，其他时间使用活动开始日期

### 5. 搜索引擎验证

在 `layout.tsx` 的 `metadata.verification` 中配置：

```typescript
verification: {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION,
  other: {
    "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    "baidu-site-verification": process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION || "",
  },
}
```

**需要的环境变量：**

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxx
NEXT_PUBLIC_BING_SITE_VERIFICATION=xxx
NEXT_PUBLIC_BAIDU_SITE_VERIFICATION=xxx
NEXT_PUBLIC_YANDEX_SITE_VERIFICATION=xxx
```

### 6. AI 搜索引擎优化

在 `layout.tsx` 的 `metadata.other` 中配置特殊标签：

```typescript
other: {
  // AI 内容声明
  "ai-content-declaration": "ai-assisted",
  "content-language": "en",
  "geo.region": "US",
  "geo.position": "global",
  // 允许 AI 爬虫使用内容
  "X-Robots-Tag": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  // 商业内容标签
  "article:tag": "e-commerce, technology, 3d-scanning, black-friday, lidar",
  "product:availability": "in stock",
  "product:condition": "new",
  "product:price:currency": "USD",
}
```

## 新增页面 SEO 检查清单

创建新页面时，确保包含以下 SEO 元素：

### Metadata

- [ ] `title`：清晰描述性标题（50-60 字符）
- [ ] `description`：吸引人的描述（150-160 字符）
- [ ] `keywords`：相关关键词列表（10-20 个）
- [ ] `alternates.canonical`：规范 URL
- [ ] `alternates.languages`：使用 `generateGlobalAlternates()`
- [ ] `openGraph`：完整的 OG 标签（title, description, images, url）
- [ ] `twitter`：Twitter Card 标签

### 结构化数据

- [ ] 添加相关的 Schema.org 结构化数据
- [ ] 使用 JSON-LD 格式
- [ ] 在页面中通过 `<script type="application/ld+json">` 输出

### 图片优化

- [ ] 使用 Next.js Image 组件
- [ ] 提供 alt 文本
- [ ] 使用适当的图片格式（WebP, AVIF）
- [ ] 提供多个尺寸（responsive images）

### 链接

- [ ] 内部链接使用相对路径
- [ ] 外部链接添加 `rel="noopener noreferrer"`
- [ ] 重要链接添加描述性文本

## 最佳实践

### 1. 内容质量

- 使用清晰、描述性的标题和副标题
- 提供有价值的、原创的内容
- 保持内容更新和相关性
- 避免关键词堆砌

### 2. 技术优化

- 使用语义化 HTML 标签
- 保持页面加载速度快（< 3 秒）
- 确保移动端友好
- 实现渐进式增强

### 3. 国际化准备

- 虽然目前只有英文版，但已配置多语言结构
- 使用 hreflang 标签指示语言和地区
- 考虑文化差异（日期、货币、度量单位）

### 4. AI 友好

- 提供清晰的内容结构
- 使用结构化数据帮助 AI 理解
- 避免过度依赖 JavaScript 渲染关键内容
- 在 robots.txt 中明确允许 AI 爬虫

## 监控和测试

### 工具

1. **Google Search Console**
   - 监控索引状态
   - 查看搜索性能
   - 检查移动端可用性

2. **Bing Webmaster Tools**
   - 提交 sitemap
   - 监控爬取错误

3. **Schema.org Validator**
   - 验证结构化数据
   - 确保 Schema 正确性

4. **Google Rich Results Test**
   - 测试富媒体搜索结果
   - 验证结构化数据

### 定期检查

- [ ] 每周检查 Search Console 错误
- [ ] 每月审查关键词排名
- [ ] 活动期间每日监控爬取状态
- [ ] 测试所有 hreflang 标签正确性

## 常见问题

### Q: 为什么所有语言都指向同一个 URL？

A: 目前网站只有英文版本，但我们配置了完整的 hreflang 结构，为未来多语言扩展做准备。搜索引擎会根据用户位置显示相同内容，但知道这是面向多个市场的。

### Q: 如何测试 AI 爬虫是否能访问？

A: 查看 robots.txt 文件（访问 `/robots.txt`），确认 AI 爬虫（GPTBot, Claude-Web 等）有 Allow 权限。

### Q: 结构化数据更新后需要多久生效？

A: 通常需要几天到几周时间让搜索引擎重新爬取和更新。可以通过 Google Search Console 请求重新索引加快进程。

### Q: 如何添加新的目标市场？

A: 在 `src/lib/seo-utils.ts` 的 `generateGlobalAlternates()` 函数中添加新的语言代码和 URL。

## 相关资源

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a)
- [Baidu Webmaster Tools](https://ziyuan.baidu.com/)
- [OpenAI GPTBot](https://platform.openai.com/docs/gptbot)
- [Anthropic Claude Web](https://www.anthropic.com/bot-policy)

## 更新日志

- **2025-11**: 初始 SEO/GEO 优化实施
  - 添加全球市场 hreflang 支持
  - 实现完整的结构化数据
  - 配置 AI 爬虫支持
  - 添加多搜索引擎验证
