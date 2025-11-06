/**
 * Realsee Gateway 认证服务
 * 负责获取和管理 access_token
 */

interface AccessTokenResponse {
  request_id: string;
  trace_id: string;
  business_code: string;
  osi_request_id: string;
  code: number;
  status: string;
  data: {
    access_token: string;
    expire_at: number; // Unix timestamp in seconds
  };
  cost: number;
}

interface TokenCache {
  token: string;
  expireAt: number; // Unix timestamp in seconds
}

// 内存缓存
let tokenCache: TokenCache | null = null;

/**
 * 获取 Access Token
 * 自动处理缓存和刷新逻辑
 */
export async function getAccessToken(): Promise<string> {
  // 检查缓存是否有效
  if (tokenCache) {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    // 如果 token 还有至少 60 秒有效期，使用缓存
    if (tokenCache.expireAt - now > 60) {
      return tokenCache.token;
    }
  }

  // 获取环境变量
  const appKey = process.env.REALSEE_APP_KEY;
  const appSecret = process.env.REALSEE_APP_SECRET;

  if (!appKey || !appSecret) {
    throw new Error("Missing REALSEE_APP_KEY or REALSEE_APP_SECRET");
  }

  try {
    // 构建 form-urlencoded 请求体
    const params = new URLSearchParams();
    params.append("app_key", appKey);
    params.append("app_secret", appSecret);

    // 请求新的 token
    const response = await fetch(
      "https://app-gateway.realsee.ai/auth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );

    if (!response.ok) {
      throw new Error(`Gateway auth failed: ${response.status}`);
    }

    const data: AccessTokenResponse = await response.json();

    // 检查响应状态
    if (data.code !== 0 || data.status !== "success") {
      throw new Error(`Gateway auth error: ${data.status}`);
    }

    // 更新缓存
    tokenCache = {
      token: data.data.access_token,
      expireAt: data.data.expire_at,
    };

    return tokenCache.token;
  } catch (error) {
    console.error("Failed to get access token:", error);
    throw new Error("Authentication service unavailable");
  }
}

/**
 * 清除 token 缓存（用于测试或强制刷新）
 */
export function clearTokenCache(): void {
  tokenCache = null;
}
