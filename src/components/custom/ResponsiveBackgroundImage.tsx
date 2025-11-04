import Image from "next/image";

interface ResponsiveBackgroundImageProps {
  basePath: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

/**
 * 响应式背景图组件
 * 根据屏幕尺寸自动加载不同分辨率的图片
 * 
 * @param basePath - 图片基础路径（不含尺寸后缀），如 '/assets/hero/galois-hero'
 * @param alt - 图片 alt 文本
 * @param priority - 是否优先加载（默认 false）
 * @param className - 额外的 CSS 类名
 */
export function ResponsiveBackgroundImage({
  basePath,
  alt,
  priority = false,
  className = "",
}: ResponsiveBackgroundImageProps) {
  return (
    <>
      {/* 小屏幕 (< 768px) */}
      <Image
        src={`${basePath}-s.jpg`}
        alt={alt}
        fill
        priority={priority}
        quality={95}
        sizes="100vw"
        className={`object-cover object-center block md:hidden ${className}`}
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%231a2332'/%3E%3C/svg%3E"
      />
      
      {/* 中等屏幕 (768px - 1536px) */}
      <Image
        src={`${basePath}-m.jpg`}
        alt={alt}
        fill
        priority={priority}
        quality={95}
        sizes="100vw"
        className={`object-cover object-center hidden md:block 2xl:hidden ${className}`}
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%231a2332'/%3E%3C/svg%3E"
      />
      
      {/* 大屏幕 (>= 1536px) */}
      <Image
        src={`${basePath}-l.jpg`}
        alt={alt}
        fill
        priority={priority}
        quality={95}
        sizes="100vw"
        className={`object-cover object-center hidden 2xl:block ${className}`}
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%231a2332'/%3E%3C/svg%3E"
      />
    </>
  );
}

