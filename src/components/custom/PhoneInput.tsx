"use client";

import { Icon } from "@iconify/react";
import { useCallback, useEffect, useState } from "react";
import { CountrySelector } from "@/components/custom/CountrySelector";
import { CountryCodeSelector } from "@/components/custom/CountryCodeSelector";
import {
  getAllCountriesData,
  getDialingCode,
  type CountryData,
} from "@/lib/phone";
import { parsePhoneNumber } from "libphonenumber-js";

interface PhoneInputProps {
  value: string;
  countryCode: string;
  country: string;
  onChange: (phone: string, countryCode: string, country: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  showValidation?: boolean;
}

export function PhoneInput({
  value,
  countryCode,
  country,
  onChange,
  onBlur,
  error,
  touched,
  showValidation = true,
}: PhoneInputProps) {
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [showCodeSelector, setShowCodeSelector] = useState(false);
  const [countriesData, setCountriesData] = useState<CountryData[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // 加载国家数据
  useEffect(() => {
    const data = getAllCountriesData();
    setCountriesData(data);
  }, []);

  // 实时验证电话号码（基于区号而不是国家）
  useEffect(() => {
    if (!value || !countryCode) {
      setIsValid(null);
      return;
    }

    try {
      // 构建完整的电话号码
      const phoneWithCode = value.startsWith("+")
        ? value
        : `${countryCode}${value}`;
      
      // 尝试解析电话号码
      const parsed = parsePhoneNumber(phoneWithCode);
      if (parsed) {
        setIsValid(parsed.isValid());
      } else {
        setIsValid(false);
      }
    } catch (error) {
      setIsValid(false);
    }
  }, [value, countryCode]);

  // 处理国家选择（单向联动：国家 → 区号）
  const handleCountryChange = useCallback(
    (selectedCountry: string) => {
      const countryData = countriesData.find(
        (c) => c.country === selectedCountry,
      );
      if (countryData) {
        const newCountryCode = getDialingCode(countryData.countryCode);
        // 单向联动：更新区号，但区号可以后续独立修改
        onChange(value, newCountryCode, selectedCountry);
      } else {
        onChange(value, "", "");
      }
    },
    [countriesData, onChange, value],
  );

  // 处理区号选择（独立修改，不影响国家）
  const handleCountryCodeChange = useCallback(
    (selectedCode: string) => {
      // 只修改区号，不修改国家
      onChange(value, selectedCode, country);
    },
    [onChange, value, country],
  );

  // 处理电话号码输入
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue, countryCode, country);
    },
    [onChange, countryCode, country],
  );

  // 获取输入框边框样式
  const getInputBorderClass = useCallback(() => {
    if (error && touched) {
      return "border-red-500 focus:ring-red-500";
    }

    if (showValidation && isValid && touched && value) {
      return "border-green-500 focus:ring-green-500";
    }

    return "border-cyber-gray-600 focus:ring-cyber-brand-500";
  }, [error, touched, isValid, value, showValidation]);

  // 转换为选择器需要的格式
  const countryCodesForSelector = countriesData.map((item) => ({
    code: item.code,
    country: item.country,
    region: item.region,
  }));

  return (
    <>
      {/* 国家/地区选择 */}
      <div className="group mb-4">
        <label
          htmlFor="country"
          className="block text-sm font-medium text-cyber-gray-200 mb-2 transition-colors group-focus-within:text-cyber-brand-500"
        >
          <Icon icon="lucide:globe" className="inline-block w-4 h-4 mr-1" />
          Country/Region <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCountrySelector(true)}
            className="w-full px-4 py-3 pr-4 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500 transition-all duration-300 text-left flex items-center gap-3 hover:border-cyber-brand-500/50 data-[selected=true]:border-cyber-brand-500"
            data-selected={!!country}
          >
            <span className="flex-1 truncate text-left">
              {country || (
                <span className="text-cyber-gray-400">
                  Select your country or region...
                </span>
              )}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {country && (
                <Icon
                  icon="lucide:check-circle"
                  className="w-5 h-5 text-green-500"
                />
              )}
              <Icon
                icon="lucide:map-pin"
                className="w-5 h-5 text-cyber-gray-400"
              />
            </div>
          </button>
        </div>
      </div>

      {/* 国家选择器弹窗 */}
      <CountrySelector
        isOpen={showCountrySelector}
        onClose={() => setShowCountrySelector(false)}
        onSelect={(selectedCountry) => {
          handleCountryChange(selectedCountry);
        }}
        selectedCountry={country}
        countryCodes={countryCodesForSelector}
      />

      {/* 区号选择器弹窗 */}
      <CountryCodeSelector
        isOpen={showCodeSelector}
        onClose={() => setShowCodeSelector(false)}
        onSelect={(selectedCode) => {
          handleCountryCodeChange(selectedCode);
        }}
        selectedCode={countryCode}
        countryCodes={countryCodesForSelector}
      />

      {/* 电话号码输入 */}
      <div className="group">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-cyber-gray-200 mb-2 transition-colors group-focus-within:text-cyber-brand-500"
        >
          <Icon icon="lucide:phone" className="inline-block w-4 h-4 mr-1" />
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {/* 区号选择按钮（可独立修改） */}
          <button
            type="button"
            onClick={() => setShowCodeSelector(true)}
            className="relative px-4 py-3 rounded-lg bg-cyber-gray-800 border border-cyber-gray-600 text-cyber-gray-100 min-w-[100px] flex items-center justify-center gap-2 font-medium transition-all duration-300 hover:border-cyber-brand-500/50 focus:outline-none focus:ring-2 focus:ring-cyber-brand-500"
            title="Click to change country code"
          >
            {countryCode || (
              <span className="text-cyber-gray-500 text-sm">Code</span>
            )}
            <Icon
              icon="lucide:chevron-down"
              className="w-4 h-4 text-cyber-gray-400"
            />
          </button>

          {/* 电话号码输入框 */}
          <div className="relative flex-1">
            <input
              type="tel"
              id="phone"
              value={value}
              onChange={handlePhoneChange}
              onBlur={onBlur}
              disabled={!country}
              className={`w-full px-4 py-3 pr-10 rounded-lg bg-cyber-gray-800 border ${getInputBorderClass()} text-cyber-gray-100 focus:outline-none focus:ring-2 transition-all duration-300 transform focus:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder={country ? "123-456-7890" : "Select country first"}
            />
            {showValidation && isValid && touched && value && (
              <Icon
                icon="lucide:check-circle"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-in fade-in zoom-in duration-300"
              />
            )}
            {showValidation && isValid === false && touched && value && (
              <Icon
                icon="lucide:alert-circle"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 animate-in fade-in zoom-in duration-300"
              />
            )}
          </div>
        </div>
        {country && countryCode && (
          <p className="mt-1 text-xs text-cyber-gray-400 flex items-center gap-1">
            <Icon icon="lucide:info" className="w-3 h-3" />
            {country} ({countryCode}). You can change country or code
            independently.
          </p>
        )}
        {error && touched && (
          <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
        {showValidation &&
          isValid === false &&
          touched &&
          value &&
          !error && (
            <p className="mt-1 text-sm text-yellow-500 animate-in slide-in-from-top-1 duration-200 flex items-center gap-1">
              <Icon icon="lucide:info" className="w-4 h-4" />
              Please check the phone number format for {countryCode}
            </p>
          )}
      </div>
    </>
  );
}

