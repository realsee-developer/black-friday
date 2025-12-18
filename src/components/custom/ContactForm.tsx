"use client";

import { ResponsiveBackgroundImage } from "@/components/custom/ResponsiveBackgroundImage";
import { ContactFormCore } from "@/components/custom/ContactFormCore";
import { ContactFormSidebar } from "@/components/custom/ContactFormSidebar";

interface ContactFormProps {
  initialCountryCode?: string;
  hideWhatsApp?: boolean;
}

/**
 * 完整的联系表单 Section 组件
 * 包含背景、布局、表单和侧边栏
 * 
 * 对于自定义主题，建议直接使用 ContactFormCore 和 ContactFormSidebar 组合
 */
export function ContactForm({ 
  initialCountryCode, 
  hideWhatsApp = false,
}: ContactFormProps = {}) {
  // 根据 hideWhatsApp 决定标题
  const title = hideWhatsApp 
    ? "Black Friday: The Deal Event of the Year" 
    : "Contact us";

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-28"
    >
      {/* 背景 */}
      <div className="absolute inset-0 z-0">
        <ResponsiveBackgroundImage
          basePath="/assets/contact/contact-bg"
          alt="Contact Background"
          priority
        />
      </div>

      <div className="absolute inset-0 z-0">
        <div className="cyber-grid absolute inset-0 opacity-5" />
      </div>

      {/* 内容 */}
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-12 lg:gap-16 items-start">
          {/* 左侧：表单 (PC在左，Mobile在下) */}
          <div className="w-full md:w-1/2">
            <ContactFormCore initialCountryCode={initialCountryCode} />
          </div>

          {/* 右侧：标题+下载卡片 (PC在右，Mobile在上) */}
          <div className="w-full md:w-1/2">
            <ContactFormSidebar
              title={title}
              showWhatsApp={!hideWhatsApp}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// 导出子组件供外部使用
export { ContactFormCore } from "@/components/custom/ContactFormCore";
export { ContactFormSidebar } from "@/components/custom/ContactFormSidebar";
