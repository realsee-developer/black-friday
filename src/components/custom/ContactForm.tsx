"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ResponsiveBackgroundImage } from "@/components/custom/ResponsiveBackgroundImage";
import { useFormStore } from "@/store/useFormStore";
import type { ContactFormData } from "@/types";

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

export function ContactForm() {
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
    countryCode: "+1",
    country: "",
    companyName: "",
    industry: "",
    message: "",
    devicesUsed: "",
    phoneContact: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});

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

  const countryCodes = [
    { code: "+1", country: "United States", region: "Americas" },
    { code: "+1", country: "Canada", region: "Americas" },
    { code: "+44", country: "United Kingdom", region: "Europe" },
    { code: "+49", country: "Germany", region: "Europe" },
    { code: "+33", country: "France", region: "Europe" },
    { code: "+39", country: "Italy", region: "Europe" },
    { code: "+34", country: "Spain", region: "Europe" },
    { code: "+31", country: "Netherlands", region: "Europe" },
    { code: "+32", country: "Belgium", region: "Europe" },
    { code: "+41", country: "Switzerland", region: "Europe" },
    { code: "+43", country: "Austria", region: "Europe" },
    { code: "+46", country: "Sweden", region: "Europe" },
    { code: "+47", country: "Norway", region: "Europe" },
    { code: "+45", country: "Denmark", region: "Europe" },
    { code: "+48", country: "Poland", region: "Europe" },
    { code: "+7", country: "Russia", region: "Europe" },
    { code: "+86", country: "China", region: "Asia" },
    { code: "+852", country: "Hong Kong", region: "Asia" },
    { code: "+853", country: "Macau", region: "Asia" },
    { code: "+886", country: "Taiwan", region: "Asia" },
    { code: "+81", country: "Japan", region: "Asia" },
    { code: "+82", country: "South Korea", region: "Asia" },
    { code: "+65", country: "Singapore", region: "Asia" },
    { code: "+60", country: "Malaysia", region: "Asia" },
    { code: "+66", country: "Thailand", region: "Asia" },
    { code: "+84", country: "Vietnam", region: "Asia" },
    { code: "+63", country: "Philippines", region: "Asia" },
    { code: "+62", country: "Indonesia", region: "Asia" },
    { code: "+91", country: "India", region: "Asia" },
    { code: "+61", country: "Australia", region: "Oceania" },
    { code: "+64", country: "New Zealand", region: "Oceania" },
    { code: "+971", country: "United Arab Emirates", region: "Middle East" },
    { code: "+966", country: "Saudi Arabia", region: "Middle East" },
    { code: "+974", country: "Qatar", region: "Middle East" },
    { code: "+965", country: "Kuwait", region: "Middle East" },
    { code: "+972", country: "Israel", region: "Middle East" },
    { code: "+90", country: "Turkey", region: "Middle East" },
    { code: "+55", country: "Brazil", region: "Americas" },
    { code: "+54", country: "Argentina", region: "Americas" },
    { code: "+56", country: "Chile", region: "Americas" },
    { code: "+57", country: "Colombia", region: "Americas" },
    { code: "+52", country: "Mexico", region: "Americas" },
    { code: "+27", country: "South Africa", region: "Africa" },
    { code: "+20", country: "Egypt", region: "Africa" },
    { code: "+234", country: "Nigeria", region: "Africa" },
    { code: "+254", country: "Kenya", region: "Africa" },
  ];

  const countries = Array.from(
    new Set(countryCodes.map((c) => c.country)),
  ).sort();

  const handleCountryChange = (selectedCountry: string) => {
    const countryData = countryCodes.find((c) => c.country === selectedCountry);
    if (countryData) {
      setFormData({
        ...formData,
        country: selectedCountry,
        countryCode: countryData.code,
      });
    }
  };

  const handleCountryCodeChange = (selectedCode: string) => {
    const countryData = countryCodes.find((c) => c.code === selectedCode);
    setFormData({
      ...formData,
      countryCode: selectedCode,
      country: countryData?.country || "",
    });
  };

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

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        countryCode: "+1",
        country: "",
        companyName: "",
        industry: "",
        message: "",
        devicesUsed: "",
        phoneContact: false,
      });
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

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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
              onSubmit={handleSubmit}
              className="cyber-card-neon p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-cyber-gray-200 mb-2"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border ${
                    errors.name ? "border-red-500" : "border-cyber-gray-600"
                  } text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-colors`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-cyber-gray-200 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border ${
                    errors.email ? "border-red-500" : "border-cyber-gray-600"
                  } text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-colors`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-cyber-gray-200 mb-2"
                >
                  Country/Region & Phone <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <select
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-colors"
                  >
                    <option value="">Select your country or region</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => handleCountryCodeChange(e.target.value)}
                    className="px-4 py-3 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-colors min-w-[120px]"
                  >
                    {Array.from(new Set(countryCodes.map((c) => c.code))).map(
                      (code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ),
                    )}
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={`flex-1 px-4 py-3 rounded-lg bg-cyber-gray-800 border ${
                      errors.phone ? "border-red-500" : "border-cyber-gray-600"
                    } text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-colors`}
                    placeholder="123-456-7890"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-cyber-gray-200 mb-2"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-colors"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-cyber-gray-200 mb-2"
                >
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border ${
                    errors.industry ? "border-red-500" : "border-cyber-gray-600"
                  } text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-colors`}
                >
                  <option value="">Select your industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-500">{errors.industry}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-cyber-gray-200 mb-2"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border ${
                    errors.message ? "border-red-500" : "border-cyber-gray-600"
                  } text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-colors resize-none`}
                  placeholder="Please provide more details about your questions so we can help you better."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="devicesUsed"
                  className="block text-sm font-medium text-cyber-gray-200 mb-2"
                >
                  What devices or platforms do you use for 3D tours?
                </label>
                <input
                  type="text"
                  id="devicesUsed"
                  value={formData.devicesUsed}
                  onChange={(e) => handleChange("devicesUsed", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-colors"
                  placeholder="e.g., Matterport, iGuide, etc."
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="phoneContact"
                  checked={formData.phoneContact}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      phoneContact: e.target.checked,
                    }));
                  }}
                  className="mt-1 w-4 h-4 rounded border-cyber-gray-600 bg-cyber-gray-800 text-cyber-brand-500 focus:ring-2 focus:ring-cyber-brand-500 transition-colors cursor-pointer"
                />
                <label
                  htmlFor="phoneContact"
                  className="text-sm text-cyber-gray-300 cursor-pointer"
                >
                  I agree to be contacted by phone to discuss my inquiry
                </label>
              </div>

              {submitError && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 flex items-start gap-3">
                  <Icon
                    icon="lucide:alert-circle"
                    className="w-5 h-5 shrink-0 mt-0.5"
                  />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cyber-btn-primary py-3 sm:py-4 text-base sm:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-none"
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
                  "Submit"
                )}
              </button>
            </form>
          </div>

          {/* 右侧：标题+下载卡片 (PC在右，Mobile在上) */}
          <div className="w-full md:w-1/2 space-y-6 sm:space-y-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyber-gray-100 mb-3 sm:mb-4">
                Contact us
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
                className="inline-flex items-center gap-2 cyber-btn-secondary px-6 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 min-h-[44px] touch-none"
              >
                <Icon icon="lucide:download" className="w-5 h-5" />
                Download
              </a>
            </div>

            {/* WhatsApp Contact Section */}
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
                className="inline-flex items-center gap-2 w-full justify-center bg-[#25D366] hover:bg-[#22c55e] px-6 py-3 rounded-xl text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 shadow-lg min-h-[44px] touch-none"
              >
                <Icon icon="mdi:whatsapp" className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
