/**
 * reCAPTCHA v3 验证服务
 */

interface RecaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  score?: number; // 0.0 - 1.0
  action?: string;
  "error-codes"?: string[];
}

export interface RecaptchaResult {
  success: boolean;
  score: number;
  error?: string;
}

/**
 * 验证 reCAPTCHA token
 * @param token - 前端通过 grecaptcha.execute() 获取的 token
 * @param minScore - 最低接受分数，默认 0.5
 * @returns 验证结果
 */
export async function verifyRecaptcha(
  token: string,
  minScore = 0.5,
): Promise<RecaptchaResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("Missing RECAPTCHA_SECRET_KEY");
    return {
      success: false,
      score: 0,
      error: "reCAPTCHA configuration error",
    };
  }

  try {
    // 构建请求参数
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", token);

    // 调用 Google reCAPTCHA API
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );

    if (!response.ok) {
      throw new Error(`reCAPTCHA API error: ${response.status}`);
    }

    const data: RecaptchaVerifyResponse = await response.json();

    // 检查验证是否成功
    if (!data.success) {
      return {
        success: false,
        score: 0,
        error: `reCAPTCHA verification failed: ${data["error-codes"]?.join(", ") || "unknown error"}`,
      };
    }

    const score = data.score ?? 0;

    // 检查分数是否达到阈值
    if (score < minScore) {
      return {
        success: false,
        score,
        error: `reCAPTCHA score too low: ${score}`,
      };
    }

    return {
      success: true,
      score,
    };
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return {
      success: false,
      score: 0,
      error: error instanceof Error ? error.message : "Verification failed",
    };
  }
}
