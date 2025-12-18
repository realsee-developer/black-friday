"use client";

import { Icon } from "@iconify/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PhoneInput } from "@/components/custom/PhoneInput";
import { useFormStore } from "@/store/useFormStore";
import {
  trackFormSubmit,
  trackFacebookLead,
} from "@/lib/analytics/gtm";
import {
  CURRENCY_USD,
  FACEBOOK_LEAD_CONTENT_NAME,
} from "@/lib/analytics-constants";
import type { ContactFormData } from "@/types";
import { getAllCountriesData } from "@/lib/phone";
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

interface ContactFormCoreProps {
  initialCountryCode?: string;
  /** 自定义表单卡片的 className */
  className?: string;
}

/**
 * Headless 联系表单核心组件
 * 只包含表单逻辑和 UI，不包含背景、标题、布局等
 * 可被不同主题的包装组件复用
 * 
 * 使用简化的表单设计：无进度条、无分段标题、placeholder 代替 label
 */
export function ContactFormCore({ 
  initialCountryCode,
  className = "",
}: ContactFormCoreProps) {
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
    phoneContact: true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});

  const [fieldStatus, setFieldStatus] = useState<
    Partial<Record<keyof ContactFormData, "valid" | "invalid" | "untouched">>
  >({});

  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactFormData, boolean>>
  >({});

  const [showGeoDetectedBadge, setShowGeoDetectedBadge] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  // 从 localStorage 恢复表单数据或使用 geo 默认值
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("contact-form-draft");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
          return;
        } catch (error) {
          console.error("Failed to parse saved form data:", error);
        }
      }

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
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [formData]);

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
        }
      }

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

      trackFormSubmit(
        formData.industry,
        formData.country,
        formData.devicesUsed,
        "yes",
        !!formData.companyName,
      );

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
      phoneContact: true,
    });
    setErrors({});
    setFieldStatus({});
    setTouched({});
    localStorage.removeItem("contact-form-draft");
  }, []);

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

  // 成功状态
  if (submitSuccess) {
    return (
      <div className={`cyber-card-solid p-6 sm:p-8 md:p-12 text-center ${className}`}>
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
          Your message has been sent successfully. We'll get back to you soon.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="cyber-btn-secondary px-6 py-3 min-h-[44px] touch-none"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`cyber-card-solid p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 ${className}`}
    >
      {/* Personal Information Section */}
      <div className="space-y-4">
        {/* Name Field */}
        <div className="group">
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
              placeholder="Name *"
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
              placeholder="Email *"
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
            <Icon icon="lucide:map-pin-check" className="w-4 h-4" />
            <span>Location detected automatically</span>
          </div>
        )}

        {/* Company Name Field (Optional) */}
        <div className="group">
          <input
            type="text"
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-all duration-300"
            placeholder="Company Name (Optional)"
          />
        </div>
      </div>

      {/* Business Information Section */}
      <div className="space-y-4">
        {/* Industry Field */}
        <div className="group">
          <label
            htmlFor="industry"
            className="block text-sm font-medium text-cyber-gray-200 mb-2"
          >
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
          <div className="relative">
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              onBlur={() => handleBlur("message")}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border ${getInputBorderClass(
                "message",
              )} text-cyber-gray-100 focus:outline-none focus:ring-2 transition-all duration-300 resize-none`}
              placeholder="Message * (Tell us about your project or inquiry...)"
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
          <input
            type="text"
            id="devicesUsed"
            value={formData.devicesUsed}
            onChange={(e) => handleChange("devicesUsed", e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-all duration-300"
            placeholder="3D Devices/Platforms (Optional)"
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
            <div
              className="absolute inset-0 -z-10 bg-[length:200%_100%] animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(to right, #b91c1c, #d4a853, #b91c1c)",
                backgroundSize: "200% 100%",
              }}
            />
          </>
        )}
      </button>
    </form>
  );
}
