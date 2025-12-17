"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { trackDownloadAppClick, trackWhatsAppClick } from "@/lib/analytics/gtm";
import type { ReactNode } from "react";

interface ContactFormSidebarProps {
  /** 标题，可以是字符串或 ReactNode */
  title?: ReactNode;
  /** 副标题/描述，可以是字符串或 ReactNode */
  subtitle?: ReactNode;
  /** 是否显示 WhatsApp 联系卡片 */
  showWhatsApp?: boolean;
  /** 是否显示下载 App 卡片 */
  showDownloadCard?: boolean;
  /** 额外的子元素，会在卡片之后渲染 */
  children?: ReactNode;
  /** 自定义 className */
  className?: string;
}

/**
 * 联系表单侧边栏组件
 * 包含标题、下载卡片、WhatsApp 联系等内容
 * 可被不同主题的包装组件复用
 */
export function ContactFormSidebar({
  title = "Contact us",
  subtitle = (
    <>
      Please leave your information, we will contact you within 48 hours.
      <br className="hidden sm:block" />
      Discover our product, explore pricing options, schedule a demo,
      find solutions tailored to your needs, and more.
    </>
  ),
  showWhatsApp = true,
  showDownloadCard = true,
  children,
  className = "",
}: ContactFormSidebarProps) {
  return (
    <div className={`space-y-6 sm:space-y-8 ${className}`}>
      {/* 标题区域 */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyber-gray-100 mb-3 sm:mb-4">
          {title}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-cyber-gray-300">
          {subtitle}
        </p>
      </div>

      {/* 下载卡片 */}
      {showDownloadCard && (
        <div className="cyber-card-solid p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
              <Image
                src="/assets/brand/realsee-logo.jpeg"
                alt="Realsee Logo"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-cyber-gray-100">
                New User Free trial
              </h3>
            </div>
          </div>

          <p className="text-cyber-gray-300">
            Download Realsee App now and start the new user free trial
          </p>

          <a
            href="https://home.realsee.ai/en/download-realsee-vr"
            target="_blank"
            rel="noopener noreferrer"
            title="Download Realsee App - Free Trial Available"
            onClick={() => trackDownloadAppClick("contact_form")}
            className="inline-flex items-center gap-2 cyber-btn-secondary px-6 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 min-h-[44px] touch-none"
          >
            <Icon icon="lucide:download" className="w-5 h-5" />
            Download
          </a>
        </div>
      )}

      {/* WhatsApp 联系卡片 */}
      {showWhatsApp && (
        <div className="cyber-card-solid p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-[#25D366] rounded-2xl shadow-lg">
              <Icon icon="mdi:whatsapp" className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-cyber-gray-100">
                Quick Contact
              </h3>
              <p className="text-sm text-cyber-gray-300">
                Contact us directly via WhatsApp
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/message/CGR6XJOODRABC1"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("contact_form")}
            className="inline-flex items-center gap-2 w-full justify-center bg-[#25D366] hover:bg-[#22c55e] px-6 py-3 rounded-xl text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 shadow-lg min-h-[44px] touch-none"
          >
            <Icon icon="mdi:whatsapp" className="w-5 h-5" />
            Chat on WhatsApp
          </a>
        </div>
      )}

      {/* 额外的子元素 */}
      {children}
    </div>
  );
}
