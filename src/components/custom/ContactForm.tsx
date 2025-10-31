"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useFormStore } from "@/store/useFormStore";
import type { ContactFormData } from "@/types";

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
    industry: "",
    message: "",
    otherProducts: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});

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
    { code: "+1", country: "United States / Canada" },
    { code: "+44", country: "United Kingdom" },
    { code: "+86", country: "China" },
    { code: "+852", country: "Hong Kong, China" },
    { code: "+853", country: "Macau, China" },
    { code: "+886", country: "Taiwan, China" },
    { code: "+81", country: "Japan" },
    { code: "+82", country: "Korea" },
    { code: "+65", country: "Singapore" },
    { code: "+61", country: "Australia" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
  ];

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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        countryCode: "+1",
        country: "",
        industry: "",
        message: "",
        otherProducts: "",
      });
    } catch (_error) {
      setSubmitError("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (submitSuccess) {
    return (
      <section
        id="contact"
        className="relative overflow-hidden bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-800 to-cyber-gray-900 py-20 sm:py-28"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="cyber-card-neon p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <Icon
                icon="lucide:check-circle"
                className="w-12 h-12 text-green-500"
              />
            </div>
            <h2 className="text-3xl font-bold text-cyber-gray-100 mb-4">
              Thank You!
            </h2>
            <p className="text-lg text-cyber-gray-300 mb-8">
              Your message has been sent successfully. We'll get back to you
              soon.
            </p>
            <button
              onClick={resetForm}
              className="cyber-btn-secondary px-6 py-3"
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
      className="relative overflow-hidden bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-800 to-cyber-gray-900 py-20 sm:py-28"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-5" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyber-brand-500/10 blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-gray-100 mb-4">
            Contact Us
          </h2>
          <p className="text-lg sm:text-xl text-cyber-gray-300">
            Have questions? We're here to help.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="cyber-card-neon p-6 sm:p-8 space-y-6"
        >
          {/* Name */}
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

          {/* Email */}
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

          {/* Phone with country code */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-cyber-gray-200 mb-2"
            >
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={formData.countryCode}
                onChange={(e) => handleChange("countryCode", e.target.value)}
                className="px-4 py-3 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-colors"
              >
                {countryCodes.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code} {item.country}
                  </option>
                ))}
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

          {/* Country (optional) */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-cyber-gray-200 mb-2"
            >
              Country/Region
            </label>
            <input
              type="text"
              id="country"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-colors"
              placeholder="Your country or region"
            />
          </div>

          {/* Industry */}
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

          {/* Message */}
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
              placeholder="Tell us about your needs..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          {/* Other Products (optional) */}
          <div>
            <label
              htmlFor="otherProducts"
              className="block text-sm font-medium text-cyber-gray-200 mb-2"
            >
              Other 3D Tour Products Used
            </label>
            <input
              type="text"
              id="otherProducts"
              value={formData.otherProducts}
              onChange={(e) => handleChange("otherProducts", e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-colors"
              placeholder="e.g., Matterport, iGuide, etc."
            />
          </div>

          {/* Error message */}
          {submitError && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 flex items-start gap-3">
              <Icon
                icon="lucide:alert-circle"
                className="w-5 h-5 flex-shrink-0 mt-0.5"
              />
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cyber-btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
