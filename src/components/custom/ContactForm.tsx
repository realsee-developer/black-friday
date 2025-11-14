"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ResponsiveBackgroundImage } from "@/components/custom/ResponsiveBackgroundImage";
import { PhoneInput } from "@/components/custom/PhoneInput";
import { useFormStore } from "@/store/useFormStore";
import {
  trackFormSubmit,
  trackWhatsAppClick,
  trackDownloadAppClick,
  trackFacebookLead,
} from "@/lib/analytics/gtm";
import {
  CURRENCY_USD,
  FACEBOOK_LEAD_CONTENT_NAME,
} from "@/lib/analytics-constants";
import type { ContactFormData } from "@/types";
import { getAllCountriesData, getDialingCode } from "@/lib/phone";
import type { CountryCode } from "libphonenumber-js";

// 声明全局 grecaptcha 对象
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

interface ContactFormProps {
  initialCountryCode?: string;
  hideWhatsApp?: boolean;
}

export function ContactForm({ initialCountryCode, hideWhatsApp = false }: ContactFormProps = {}) {
  const {
    isSubmitting,
    submitSuccess,
    submitError,
    setSubmitting,
    setSubmitSuccess,
    setSubmitError,
    resetForm,
  } = useFormStore();

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    countryCode: "",
    country: "",
    companyName: "",
    industry: "",
    message: "",
    devicesUsed: "",
    phoneContact: true, // 输入手机号即认为同意联系
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});

  // 字段验证状态：valid, invalid, untouched
  const [fieldStatus, setFieldStatus] = useState<
    Partial<Record<keyof ContactFormData, "valid" | "invalid" | "untouched">>
  >({});

  // 字段是否被触碰过
  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactFormData, boolean>>
  >({});

  // Geo 检测提示状态
  const [showGeoDetectedBadge, setShowGeoDetectedBadge] = useState(false);

  // 表单是否在视口中（用于浮动工具栏）
  const formRef = useRef<HTMLFormElement>(null);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);

  // 计算表单完成度（必填字段）- 需要在 useEffect 之前定义
  const formProgress = useMemo(() => {
    const requiredFields: (keyof ContactFormData)[] = [
      "name",
      "email",
      "phone",
      "industry",
      "message",
    ];
    const filledFields = requiredFields.filter((field) => {
      const value = formData[field];
      return typeof value === "string" && value.trim() !== "";
    });
    return Math.round((filledFields.length / requiredFields.length) * 100);
  }, [formData]);

  // 从 localStorage 恢复表单数据或使用 geo 默认值
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("contact-form-draft");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
          return; // 如果有保存的数据，优先使用
        } catch (error) {
          console.error("Failed to parse saved form data:", error);
        }
      }

      // 如果没有保存的数据，使用 geo 信息默认填充
      if (initialCountryCode) {
        const allCountries = getAllCountriesData();
        const countryData = allCountries.find(
          (c) => c.countryCode === (initialCountryCode as CountryCode),
        );
        if (countryData) {
          setFormData((prev) => ({
            ...prev,
            country: countryData.country,
            countryCode: countryData.code,
          }));
          // 显示地理位置检测提示，5秒后自动隐藏
          setShowGeoDetectedBadge(true);
          setTimeout(() => {
            setShowGeoDetectedBadge(false);
          }, 5000);
        }
      }
    }
  }, [initialCountryCode]);

  // 自动保存表单数据到 localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const timeoutId = setTimeout(() => {
        localStorage.setItem("contact-form-draft", JSON.stringify(formData));
      }, 1000); // 防抖 1 秒

      return () => clearTimeout(timeoutId);
    }
  }, [formData]);

  // 监听滚动，控制浮动工具栏显示（仅移动端）
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        setShowFloatingToolbar(false);
        return;
      }

      if (formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        // 当表单不在视口中时显示浮动工具栏
        const isFormVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setShowFloatingToolbar(!isFormVisible && formProgress > 0);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [formProgress]);

  // 加载 reCAPTCHA v3 脚本
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      console.warn("reCAPTCHA site key not configured");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // 清理脚本
      const existingScript = document.querySelector(
        `script[src^="https://www.google.com/recaptcha/api.js"]`,
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const industries = [
    "Photography Service",
    "Residential Real Estate",
    "Commercial Real Estate",
    "Architecture, Engineering, Construction",
    "Travel, Hospitality",
    "Retail, Restaurant",
    "Other",
  ];

  // 行业图标映射
  const industryIcons: Record<string, string> = {
    "Photography Service": "lucide:camera",
    "Residential Real Estate": "lucide:home",
    "Commercial Real Estate": "lucide:building-2",
    "Architecture, Engineering, Construction": "lucide:hammer",
    "Travel, Hospitality": "lucide:plane",
    "Retail, Restaurant": "lucide:shopping-bag",
    Other: "lucide:more-horizontal",
  };

  // 实时验证单个字段
  const validateField = useCallback(
    (field: keyof ContactFormData, value: string | boolean): string => {
      if (field === "name" && typeof value === "string") {
        return value.trim() ? "" : "Name is required";
      }

      if (field === "email" && typeof value === "string") {
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return "";
      }

      if (field === "phone" && typeof value === "string") {
        return value.trim() ? "" : "Phone number is required";
      }

      if (field === "industry" && typeof value === "string") {
        return value ? "" : "Industry is required";
      }

      if (field === "message" && typeof value === "string") {
        return value.trim() ? "" : "Message is required";
      }

      return "";
    },
    [],
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // 获取 reCAPTCHA token
      let recaptchaToken: string | undefined;
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

      if (siteKey && typeof window !== "undefined" && window.grecaptcha) {
        try {
          await new Promise<void>((resolve) => {
            window.grecaptcha.ready(() => resolve());
          });
          recaptchaToken = await window.grecaptcha.execute(siteKey, {
            action: "submit",
          });
        } catch (error) {
          console.error("reCAPTCHA execution failed:", error);
          // 继续提交，后端会处理缺少 token 的情况
        }
      }

      // 提交表单
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          recaptchaToken,
          pageUrl: window.location.href,
          referrer: document.referrer,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form");
      }

      // Track form submission in GTM
      // 输入手机号即认为同意联系
      trackFormSubmit(
        formData.industry,
        formData.country,
        formData.devicesUsed,
        "yes", // 输入手机号即认为同意联系
        !!formData.companyName,
      );

      // Track Facebook Pixel Lead event
      trackFacebookLead(
        FACEBOOK_LEAD_CONTENT_NAME,
        formData.industry,
        undefined,
        CURRENCY_USD,
      );

      setSubmitSuccess(true);
      clearForm();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = useCallback(
    (field: keyof ContactFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setTouched((prev) => ({ ...prev, [field]: true }));

      // 实时验证
      if (typeof value === "string") {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error || undefined }));
        setFieldStatus((prev) => ({
          ...prev,
          [field]: error ? "invalid" : "valid",
        }));
      }
    },
    [validateField],
  );

  const handleBlur = useCallback(
    (field: keyof ContactFormData) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const value = formData[field];
      if (typeof value === "string") {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error || undefined }));
        setFieldStatus((prev) => ({
          ...prev,
          [field]: error ? "invalid" : "valid",
        }));
      }
    },
    [formData, validateField],
  );

  const clearForm = useCallback(() => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      countryCode: "",
      country: "",
      companyName: "",
      industry: "",
      message: "",
      devicesUsed: "",
      phoneContact: true, // 输入手机号即认为同意联系
    });
    setErrors({});
    setFieldStatus({});
    setTouched({});
    localStorage.removeItem("contact-form-draft");
  }, []);

  // 获取输入框的边框样式类
  const getInputBorderClass = useCallback(
    (field: keyof ContactFormData) => {
      const status = fieldStatus[field];
      const isTouched = touched[field];
      const hasError = errors[field];

      if (hasError && isTouched) {
        return "border-red-500 focus:ring-red-500";
      }

      if (status === "valid" && isTouched) {
        return "border-green-500 focus:ring-green-500";
      }

      return "border-cyber-gray-600 focus:ring-cyber-brand-500";
    },
    [fieldStatus, touched, errors],
  );

  if (submitSuccess) {
    return (
      <section
        id="contact"
        className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-28"
      >
        <div className="absolute inset-0 z-0">
          <ResponsiveBackgroundImage
            basePath="/assets/contact/contact-bg"
            alt="Contact Background"
            priority
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-3xl relative z-10">
          <div className="cyber-card-neon p-6 sm:p-8 md:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <Icon
                icon="lucide:check-circle"
                className="w-10 h-10 sm:w-12 sm:h-12 text-green-500"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-cyber-gray-100 mb-3 sm:mb-4">
              Thank You!
            </h2>
            <p className="text-base sm:text-lg text-cyber-gray-300 mb-6 sm:mb-8">
              Your message has been sent successfully. We'll get back to you
              soon.
            </p>
            <button
              type="button"
              onClick={resetForm}
              className="cyber-btn-secondary px-6 py-3 min-h-[44px] touch-none"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-28"
    >
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

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-12 lg:gap-16 items-start">
          {/* 左侧：表单 (PC在左，Mobile在下) */}
          <div className="w-full md:w-1/2">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="cyber-card-neon p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6"
            >
              {/* 进度条 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-cyber-gray-300">
                    Form Progress
                  </span>
                  <span className="text-sm font-bold text-cyber-brand-500">
                    {formProgress}%
                  </span>
                </div>
                <div className="relative h-2 bg-cyber-gray-700 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${formProgress}%`,
                      background:
                        "linear-gradient(90deg, #3366ff 0%, #00ffff 100%)",
                      boxShadow:
                        formProgress > 0
                          ? "0 0 10px rgba(51, 102, 255, 0.5)"
                          : "none",
                    }}
                  />
                </div>
              </div>
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-brand-500 to-transparent opacity-50" />
                  <span className="text-xs font-semibold text-cyber-gray-400 uppercase tracking-wider">
                    Personal Information
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-brand-500 to-transparent opacity-50" />
                </div>

                {/* Name Field */}
                <div className="group">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-cyber-gray-200 mb-2 transition-colors group-focus-within:text-cyber-brand-500"
                  >
                    <Icon
                      icon="lucide:user"
                      className="inline-block w-4 h-4 mr-1"
                    />
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      className={`w-full px-4 py-3 pr-10 rounded-lg bg-cyber-gray-800 border ${getInputBorderClass(
                        "name",
                      )} text-cyber-gray-100 focus:outline-none focus:ring-2 transition-all duration-300 transform focus:scale-[1.01]`}
                      placeholder="John Doe"
                    />
                    {fieldStatus.name === "valid" && touched.name && (
                      <Icon
                        icon="lucide:check-circle"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-in fade-in zoom-in duration-300"
                      />
                    )}
                  </div>
                  {errors.name && touched.name && (
                    <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="group">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-cyber-gray-200 mb-2 transition-colors group-focus-within:text-cyber-brand-500"
                  >
                    <Icon
                      icon="lucide:mail"
                      className="inline-block w-4 h-4 mr-1"
                    />
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={`w-full px-4 py-3 pr-10 rounded-lg bg-cyber-gray-800 border ${getInputBorderClass(
                        "email",
                      )} text-cyber-gray-100 focus:outline-none focus:ring-2 transition-all duration-300 transform focus:scale-[1.01]`}
                      placeholder="john.doe@company.com"
                    />
                    {fieldStatus.email === "valid" && touched.email && (
                      <Icon
                        icon="lucide:check-circle"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-in fade-in zoom-in duration-300"
                      />
                    )}
                  </div>
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-brand-500 to-transparent opacity-50" />
                  <span className="text-xs font-semibold text-cyber-gray-400 uppercase tracking-wider">
                    Contact Information
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-brand-500 to-transparent opacity-50" />
                </div>

                {/* Phone Input with Country Selector */}
                <PhoneInput
                  value={formData.phone}
                  countryCode={formData.countryCode}
                  country={formData.country}
                  onChange={(phone, countryCode, country) => {
                    setFormData((prev) => ({
                      ...prev,
                      phone,
                      countryCode,
                      country,
                    }));
                    setTouched((prev) => ({
                      ...prev,
                      phone: true,
                      country: true,
                    }));
                  }}
                  onBlur={() => handleBlur("phone")}
                  error={errors.phone}
                  touched={touched.phone}
                />

                {/* Geo Detection Badge */}
                {showGeoDetectedBadge && formData.country && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-cyber-brand-400 animate-in slide-in-from-top-2 fade-in duration-300">
                    <Icon
                      icon="lucide:map-pin-check"
                      className="w-4 h-4"
                    />
                    <span>Location detected automatically</span>
                  </div>
                )}

                {/* Company Name Field (Optional) */}
                <div className="group">
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-cyber-gray-400 mb-2"
                  >
                    <Icon
                      icon="lucide:building"
                      className="inline-block w-4 h-4 mr-1"
                    />
                    Company Name{" "}
                    <span className="text-xs text-cyber-gray-500">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-all duration-300"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              {/* Business Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-brand-500 to-transparent opacity-50" />
                  <span className="text-xs font-semibold text-cyber-gray-400 uppercase tracking-wider">
                    Business Information
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-brand-500 to-transparent opacity-50" />
                </div>

                {/* Industry Field */}
                <div className="group">
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium text-cyber-gray-200 mb-2 transition-colors group-focus-within:text-cyber-brand-500"
                  >
                    <Icon
                      icon="lucide:briefcase"
                      className="inline-block w-4 h-4 mr-1"
                    />
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => handleChange("industry", e.target.value)}
                      onBlur={() => handleBlur("industry")}
                      className={`w-full px-4 py-3 pr-10 rounded-lg bg-cyber-gray-800 border ${getInputBorderClass(
                        "industry",
                      )} text-cyber-gray-100 focus:outline-none focus:ring-2 transition-all duration-300 appearance-none cursor-pointer`}
                    >
                      <option value="">Select your industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    <Icon
                      icon="lucide:chevron-down"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-gray-400 pointer-events-none"
                    />
                  </div>
                  {errors.industry && touched.industry && (
                    <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
                      {errors.industry}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="group">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-cyber-gray-200 mb-2 transition-colors group-focus-within:text-cyber-brand-500"
                  >
                    <Icon
                      icon="lucide:message-square"
                      className="inline-block w-4 h-4 mr-1"
                    />
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      onBlur={() => handleBlur("message")}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border ${getInputBorderClass(
                        "message",
                      )} text-cyber-gray-100 focus:outline-none focus:ring-2 transition-all duration-300 resize-none`}
                      placeholder="Tell us about your project or inquiry..."
                    />
                    {fieldStatus.message === "valid" && touched.message && (
                      <Icon
                        icon="lucide:check-circle"
                        className="absolute right-3 top-3 w-5 h-5 text-green-500 animate-in fade-in zoom-in duration-300"
                      />
                    )}
                  </div>
                  {errors.message && touched.message && (
                    <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Devices Used Field (Optional) */}
                <div className="group">
                  <label
                    htmlFor="devicesUsed"
                    className="block text-sm font-medium text-cyber-gray-400 mb-2"
                  >
                    <Icon
                      icon="lucide:camera"
                      className="inline-block w-4 h-4 mr-1"
                    />
                    Devices or Platforms for 3D Tours{" "}
                    <span className="text-xs text-cyber-gray-500">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="devicesUsed"
                    value={formData.devicesUsed}
                    onChange={(e) => handleChange("devicesUsed", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-all duration-300"
                    placeholder="e.g., Matterport, iGuide, Ricoh Theta"
                  />
                </div>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                  <Icon
                    icon="lucide:alert-circle"
                    className="w-5 h-5 shrink-0 mt-0.5 animate-pulse"
                  />
                  <span>{submitError}</span>
                </div>
              )}

              {/* reCAPTCHA 隐私政策说明 */}
              <p className="text-xs text-center text-cyber-gray-400">
                This form is protected by reCAPTCHA and the Google{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyber-brand-500 hover:text-cyber-brand-400 underline"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyber-brand-500 hover:text-cyber-brand-400 underline"
                >
                  Terms of Service
                </a>
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full cyber-btn-primary py-3 sm:py-4 text-base sm:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-none overflow-hidden"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon
                      icon="lucide:loader-2"
                      className="w-5 h-5 animate-spin"
                    />
                    Sending...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Icon icon="lucide:send" className="w-5 h-5" />
                      Submit
                    </span>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyber-brand-500 via-cyber-neon-cyan to-cyber-brand-500 bg-[length:200%_100%] animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>
                )}
              </button>

              {/* Auto-save indicator */}
              {formProgress > 0 && formProgress < 100 && (
                <p className="text-xs text-center text-cyber-gray-400 flex items-center justify-center gap-1">
                  <Icon
                    icon="lucide:save"
                    className="w-3 h-3 animate-pulse"
                  />
                  Your progress is automatically saved
                </p>
              )}
            </form>

            {/* Floating Toolbar (Mobile Only) */}
            {showFloatingToolbar && (
              <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-cyber-gray-900/95 backdrop-blur-lg border-t border-cyber-brand-500/30 shadow-[0_-4px_20px_rgba(51,102,255,0.3)] animate-in slide-in-from-bottom duration-300">
                <div className="container mx-auto px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-cyber-gray-300">
                          Progress
                        </span>
                        <span className="text-xs font-bold text-cyber-brand-500">
                          {formProgress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-cyber-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${formProgress}%`,
                            background:
                              "linear-gradient(90deg, #3366ff 0%, #00ffff 100%)",
                            boxShadow: "0 0 8px rgba(51, 102, 255, 0.5)",
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={clearForm}
                        className="px-4 py-2 rounded-lg bg-cyber-gray-800 text-cyber-gray-300 text-sm font-medium hover:bg-cyber-gray-700 transition-colors flex items-center gap-1"
                      >
                        <Icon icon="lucide:trash-2" className="w-4 h-4" />
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          formRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }}
                        className="px-4 py-2 rounded-lg bg-cyber-brand-500 text-white text-sm font-medium hover:bg-cyber-brand-600 transition-colors flex items-center gap-1 shadow-lg"
                      >
                        <Icon icon="lucide:arrow-up" className="w-4 h-4" />
                        Back to Form
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右侧：标题+下载卡片 (PC在右，Mobile在上) */}
          <div className="w-full md:w-1/2 space-y-6 sm:space-y-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyber-gray-100 mb-3 sm:mb-4">
                {hideWhatsApp ? "Black Friday: The Deal Event of the Year" : "Contact us"}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-cyber-gray-300">
                Please leave your information, we will contact you within 48
                hours.
                <br className="hidden sm:block" />
                Discover our product, explore pricing options, schedule a demo,
                find solutions tailored to your needs, and more.
              </p>
            </div>

            <div className="cyber-card-neon p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
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
                onClick={() => trackDownloadAppClick("contact_form")}
                className="inline-flex items-center gap-2 cyber-btn-secondary px-6 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 min-h-[44px] touch-none"
              >
                <Icon icon="lucide:download" className="w-5 h-5" />
                Download
              </a>
            </div>

            {/* WhatsApp Contact Section - Only show if hideWhatsApp is false */}
            {!hideWhatsApp && (
              <div className="cyber-card-neon p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
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
          </div>
        </div>
      </div>
    </section>
  );
}
