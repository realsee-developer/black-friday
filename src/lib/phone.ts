import {
  parsePhoneNumber,
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";

export interface CountryData {
  code: string; // 拨号区号，如 "+1"
  country: string; // 国家名称
  countryCode: CountryCode; // ISO 国家代码，如 "US"
  region: string; // 大洲/地区
}

// 国家代码到国家名称的映射（英文）
const countryNames: Record<CountryCode, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  BE: "Belgium",
  CH: "Switzerland",
  AT: "Austria",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  IE: "Ireland",
  PT: "Portugal",
  GR: "Greece",
  PL: "Poland",
  CZ: "Czech Republic",
  HU: "Hungary",
  RO: "Romania",
  RU: "Russia",
  CN: "China",
  HK: "Hong Kong, China",
  MO: "Macao, China",
  TW: "Taiwan, China",
  JP: "Japan",
  KR: "South Korea",
  SG: "Singapore",
  MY: "Malaysia",
  TH: "Thailand",
  VN: "Vietnam",
  PH: "Philippines",
  ID: "Indonesia",
  IN: "India",
  PK: "Pakistan",
  BD: "Bangladesh",
  LK: "Sri Lanka",
  AU: "Australia",
  NZ: "New Zealand",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  QA: "Qatar",
  KW: "Kuwait",
  IL: "Israel",
  TR: "Turkey",
  EG: "Egypt",
  ZA: "South Africa",
  BR: "Brazil",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  MX: "Mexico",
  PE: "Peru",
  VE: "Venezuela",
  NG: "Nigeria",
  KE: "Kenya",
  ET: "Ethiopia",
  GH: "Ghana",
  UG: "Uganda",
  TZ: "Tanzania",
  MA: "Morocco",
  DZ: "Algeria",
  TN: "Tunisia",
  LB: "Lebanon",
  JO: "Jordan",
  IQ: "Iraq",
  IR: "Iran",
  AF: "Afghanistan",
  UZ: "Uzbekistan",
  KZ: "Kazakhstan",
  UA: "Ukraine",
  BY: "Belarus",
  GE: "Georgia",
  AM: "Armenia",
  AZ: "Azerbaijan",
  LT: "Lithuania",
  LV: "Latvia",
  EE: "Estonia",
  SK: "Slovakia",
  SI: "Slovenia",
  HR: "Croatia",
  BA: "Bosnia and Herzegovina",
  RS: "Serbia",
  ME: "Montenegro",
  MK: "North Macedonia",
  AL: "Albania",
  BG: "Bulgaria",
  MD: "Moldova",
  IS: "Iceland",
  LU: "Luxembourg",
  MT: "Malta",
  CY: "Cyprus",
  AD: "Andorra",
  MC: "Monaco",
  SM: "San Marino",
  VA: "Vatican City",
  LI: "Liechtenstein",
  JM: "Jamaica",
  TT: "Trinidad and Tobago",
  BS: "Bahamas",
  BB: "Barbados",
  LC: "Saint Lucia",
  GD: "Grenada",
  VC: "Saint Vincent and the Grenadines",
  AG: "Antigua and Barbuda",
  DM: "Dominica",
  KN: "Saint Kitts and Nevis",
  BZ: "Belize",
  GT: "Guatemala",
  HN: "Honduras",
  SV: "El Salvador",
  NI: "Nicaragua",
  CR: "Costa Rica",
  PA: "Panama",
  CU: "Cuba",
  DO: "Dominican Republic",
  HT: "Haiti",
  PY: "Paraguay",
  UY: "Uruguay",
  BO: "Bolivia",
  EC: "Ecuador",
  GY: "Guyana",
  SR: "Suriname",
  FJ: "Fiji",
  PG: "Papua New Guinea",
  NC: "New Caledonia",
  PF: "French Polynesia",
  WS: "Samoa",
  TO: "Tonga",
  VU: "Vanuatu",
  SB: "Solomon Islands",
  KI: "Kiribati",
  FM: "Micronesia",
  MH: "Marshall Islands",
  PW: "Palau",
  NR: "Nauru",
  TV: "Tuvalu",
  BN: "Brunei",
  KH: "Cambodia",
  LA: "Laos",
  MM: "Myanmar",
  NP: "Nepal",
  BT: "Bhutan",
  MV: "Maldives",
  MN: "Mongolia",
  KG: "Kyrgyzstan",
  TJ: "Tajikistan",
  TM: "Turkmenistan",
  OM: "Oman",
  BH: "Bahrain",
  YE: "Yemen",
  SY: "Syria",
  PS: "Palestine",
  LY: "Libya",
  SD: "Sudan",
  SS: "South Sudan",
  SO: "Somalia",
  DJ: "Djibouti",
  ER: "Eritrea",
  RW: "Rwanda",
  BI: "Burundi",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  MW: "Malawi",
  MZ: "Mozambique",
  BW: "Botswana",
  NA: "Namibia",
  LS: "Lesotho",
  SZ: "Eswatini",
  AO: "Angola",
  CM: "Cameroon",
  CD: "Congo (DRC)",
  CG: "Congo (Republic)",
  GA: "Gabon",
  GQ: "Equatorial Guinea",
  ST: "São Tomé and Príncipe",
  TD: "Chad",
  CF: "Central African Republic",
  BJ: "Benin",
  TG: "Togo",
  BF: "Burkina Faso",
  CI: "Côte d'Ivoire",
  SN: "Senegal",
  ML: "Mali",
  NE: "Niger",
  GM: "Gambia",
  GW: "Guinea-Bissau",
  GN: "Guinea",
  SL: "Sierra Leone",
  LR: "Liberia",
  MR: "Mauritania",
  MU: "Mauritius",
  SC: "Seychelles",
  KM: "Comoros",
  MG: "Madagascar",
  RE: "Réunion",
  YT: "Mayotte",
  CV: "Cape Verde",
};

// 国家代码到地区的映射
const countryRegions: Record<string, string> = {
  // Americas
  US: "Americas",
  CA: "Americas",
  MX: "Americas",
  BR: "Americas",
  AR: "Americas",
  CL: "Americas",
  CO: "Americas",
  PE: "Americas",
  VE: "Americas",
  EC: "Americas",
  GT: "Americas",
  CU: "Americas",
  BO: "Americas",
  HT: "Americas",
  DO: "Americas",
  HN: "Americas",
  PY: "Americas",
  NI: "Americas",
  SV: "Americas",
  CR: "Americas",
  PA: "Americas",
  UY: "Americas",
  JM: "Americas",
  TT: "Americas",
  GY: "Americas",
  SR: "Americas",
  BZ: "Americas",
  BS: "Americas",
  BB: "Americas",
  LC: "Americas",
  GD: "Americas",
  VC: "Americas",
  AG: "Americas",
  DM: "Americas",
  KN: "Americas",

  // Europe
  GB: "Europe",
  DE: "Europe",
  FR: "Europe",
  IT: "Europe",
  ES: "Europe",
  NL: "Europe",
  BE: "Europe",
  CH: "Europe",
  AT: "Europe",
  SE: "Europe",
  NO: "Europe",
  DK: "Europe",
  FI: "Europe",
  IE: "Europe",
  PT: "Europe",
  GR: "Europe",
  PL: "Europe",
  CZ: "Europe",
  HU: "Europe",
  RO: "Europe",
  RU: "Europe",
  UA: "Europe",
  BY: "Europe",
  LT: "Europe",
  LV: "Europe",
  EE: "Europe",
  SK: "Europe",
  SI: "Europe",
  HR: "Europe",
  BA: "Europe",
  RS: "Europe",
  ME: "Europe",
  MK: "Europe",
  AL: "Europe",
  BG: "Europe",
  MD: "Europe",
  IS: "Europe",
  LU: "Europe",
  MT: "Europe",
  CY: "Europe",
  AD: "Europe",
  MC: "Europe",
  SM: "Europe",
  VA: "Europe",
  LI: "Europe",
  GE: "Europe",
  AM: "Europe",
  AZ: "Europe",

  // Asia
  CN: "Asia",
  HK: "Asia",
  MO: "Asia",
  TW: "Asia",
  JP: "Asia",
  KR: "Asia",
  SG: "Asia",
  MY: "Asia",
  TH: "Asia",
  VN: "Asia",
  PH: "Asia",
  ID: "Asia",
  IN: "Asia",
  PK: "Asia",
  BD: "Asia",
  LK: "Asia",
  MM: "Asia",
  KH: "Asia",
  LA: "Asia",
  BN: "Asia",
  NP: "Asia",
  BT: "Asia",
  MV: "Asia",
  MN: "Asia",
  KZ: "Asia",
  UZ: "Asia",
  KG: "Asia",
  TJ: "Asia",
  TM: "Asia",
  AF: "Asia",

  // Oceania
  AU: "Oceania",
  NZ: "Oceania",
  FJ: "Oceania",
  PG: "Oceania",
  NC: "Oceania",
  PF: "Oceania",
  WS: "Oceania",
  TO: "Oceania",
  VU: "Oceania",
  SB: "Oceania",
  KI: "Oceania",
  FM: "Oceania",
  MH: "Oceania",
  PW: "Oceania",
  NR: "Oceania",
  TV: "Oceania",

  // Middle East
  AE: "Middle East",
  SA: "Middle East",
  QA: "Middle East",
  KW: "Middle East",
  IL: "Middle East",
  TR: "Middle East",
  OM: "Middle East",
  BH: "Middle East",
  YE: "Middle East",
  SY: "Middle East",
  LB: "Middle East",
  JO: "Middle East",
  IQ: "Middle East",
  IR: "Middle East",
  PS: "Middle East",

  // Africa
  EG: "Africa",
  ZA: "Africa",
  NG: "Africa",
  KE: "Africa",
  ET: "Africa",
  GH: "Africa",
  UG: "Africa",
  TZ: "Africa",
  MA: "Africa",
  DZ: "Africa",
  TN: "Africa",
  LY: "Africa",
  SD: "Africa",
  SS: "Africa",
  SO: "Africa",
  DJ: "Africa",
  ER: "Africa",
  RW: "Africa",
  BI: "Africa",
  ZM: "Africa",
  ZW: "Africa",
  MW: "Africa",
  MZ: "Africa",
  BW: "Africa",
  NA: "Africa",
  LS: "Africa",
  SZ: "Africa",
  AO: "Africa",
  CM: "Africa",
  CD: "Africa",
  CG: "Africa",
  GA: "Africa",
  GQ: "Africa",
  ST: "Africa",
  TD: "Africa",
  CF: "Africa",
  BJ: "Africa",
  TG: "Africa",
  BF: "Africa",
  CI: "Africa",
  SN: "Africa",
  ML: "Africa",
  NE: "Africa",
  GM: "Africa",
  GW: "Africa",
  GN: "Africa",
  SL: "Africa",
  LR: "Africa",
  MR: "Africa",
  MU: "Africa",
  SC: "Africa",
  KM: "Africa",
  MG: "Africa",
  RE: "Africa",
  YT: "Africa",
  CV: "Africa",
};

/**
 * 获取所有国家的完整数据
 * @returns 包含区号、国家名称、ISO代码和地区的数组
 */
export function getAllCountriesData(): CountryData[] {
  const countries = getCountries();

  return countries
    .map((countryCode) => {
      try {
        const callingCode = getCountryCallingCode(countryCode);
        const country = countryNames[countryCode] || countryCode;
        const region = countryRegions[countryCode] || "Other";

        return {
          code: `+${callingCode}`,
          country,
          countryCode,
          region,
        };
      } catch (error) {
        // 某些国家代码可能没有拨号区号，跳过
        return null;
      }
    })
    .filter((item): item is CountryData => item !== null)
    .sort((a, b) => a.country.localeCompare(b.country));
}

/**
 * 格式化电话号码为国际格式
 * @param phoneNumber 电话号码
 * @param countryCode ISO 国家代码
 * @returns 格式化后的电话号码，如果无法解析则返回原始输入
 */
export function formatPhoneNumber(
  phoneNumber: string,
  countryCode: CountryCode,
): string {
  try {
    const parsed = parsePhoneNumber(phoneNumber, countryCode);
    if (parsed) {
      // 返回国际格式，如 +1 234 567 8900
      return parsed.formatInternational();
    }
  } catch (error) {
    // 解析失败，返回原始输入
  }
  return phoneNumber;
}

/**
 * 验证电话号码是否有效
 * @param phoneNumber 电话号码（可以包含区号）
 * @param countryCode ISO 国家代码
 * @returns 是否有效
 */
export function isValidPhoneNumber(
  phoneNumber: string,
  countryCode: CountryCode,
): boolean {
  try {
    const parsed = parsePhoneNumber(phoneNumber, countryCode);
    return parsed ? parsed.isValid() : false;
  } catch (error) {
    return false;
  }
}

/**
 * 根据 ISO 国家代码获取拨号区号
 * @param countryCode ISO 国家代码
 * @returns 拨号区号，如 "+1"
 */
export function getDialingCode(countryCode: CountryCode): string {
  try {
    const callingCode = getCountryCallingCode(countryCode);
    return `+${callingCode}`;
  } catch (error) {
    return ""; // 默认返回空字符串
  }
}

/**
 * 从电话号码中解析出国家代码
 * @param phoneNumber 完整的电话号码（带区号）
 * @returns ISO 国家代码，如果无法解析则返回 undefined
 */
export function getCountryCodeFromPhone(
  phoneNumber: string,
): CountryCode | undefined {
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    return parsed?.country;
  } catch (error) {
    return undefined;
  }
}

/**
 * 获取国家的本地化名称
 * @param countryCode ISO 国家代码
 * @returns 国家名称
 */
export function getCountryName(countryCode: CountryCode): string {
  return countryNames[countryCode] || countryCode;
}

