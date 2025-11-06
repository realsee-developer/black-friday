/**
 * 联系表单请求体结构
 */
export type ContactFormRequest = {
  /** 表单内容 */
  content: ContactFormContent;
  /** 表单标识，固定为 'contact-form' */
  form: "contact-form";
  /** 人机验证信息 */
  captcha: {
    /** reCAPTCHA token */
    recaptcha: string;
    /** 验证类型，固定为 RecaptchaV3 */
    recaptchaType: 3; // CaptchaType.RecaptchaV3
  } | null;
  /** OTP 验证（海外表单不使用，固定为 null） */
  otpValidate: null;
};

/**
 * 联系表单内容
 */
export type ContactFormContent = {
  /** 姓名，必填，最大长度 100 */
  name: string;
  /** 手机号，必填 */
  mobile: string;
  /** 邮箱，必填，最大长度 100 */
  email: string;
  /** 国家，必填 */
  country: string;
  /** 公司，可选，最大长度 100 */
  company?: string;
  /** 更多内容，必填，最大长度 500 */
  more_words: string;
  /** 行业，必填 */
  industry: string;
  /** 是否电话联系，固定为 true */
  phone_contact: boolean;
  /** 设备相关描述，可选，最大长度 100 */
  device_words?: string;
  /** 当前页面 URL */
  message: string;
  /** 来源页面 URL */
  referrer: string;
  /** 人机验证分数（仅海外），由 reCAPTCHA 生成 */
  valid: string | boolean;
};

/**
 * 海外联系表单的响应体类型
 * 使用 GatewayResponse 包装，实际返回的是 data 字段的内容
 */
export type ContactFormResponse = GatewayResponse<any>; // data 字段的具体结构需查看后端文档

/**
 * 网关响应体结构
 */
export type GatewayResponse<T> = {
  request_id: string;
  business_code: string;
  code: number;
  status: string;
  data: T;
};
