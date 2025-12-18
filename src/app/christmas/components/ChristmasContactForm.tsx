"use client";

import { ContactFormCore } from "@/components/custom/ContactFormCore";
import { ContactFormSidebar } from "@/components/custom/ContactFormSidebar";
import { ResponsiveBackgroundImage } from "@/components/custom/ResponsiveBackgroundImage";

interface ChristmasContactFormProps {
  initialCountryCode?: string;
}

/**
 * 圣诞主题联系表单
 * 使用 headless 的 ContactFormCore 和 ContactFormSidebar 组件
 * 自定义圣诞背景和标题
 */
export function ChristmasContactForm({
  initialCountryCode,
}: ChristmasContactFormProps) {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-28"
    >
      {/* 圣诞主题背景 */}
      <div className="absolute inset-0 z-0">
        <ResponsiveBackgroundImage
          basePath="/assets/christmas/contact/contact-bg"
          alt="Christmas Contact Background"
          priority
        />
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
              title="Christmas Sale: Limited Time Offer"
              subtitle="Please leave your information, we will contact you within 48 hours. Discover our product, explore pricing options, schedule a demo, find solutions tailored to your needs, and more."
              showWhatsApp={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
