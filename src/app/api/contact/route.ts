import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/gateway-auth";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendLeadNotification } from "@/lib/wechat-webhook";
import type { ContactFormData } from "@/types";
import type {
  ContactFormRequest,
  ContactFormResponse,
} from "@/types/contact-us";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data: ContactFormData = body.formData;
    const recaptchaToken: string | undefined = body.recaptchaToken;

    // 1. 验证必填字段
    if (
      !data.name ||
      !data.email ||
      !data.phone ||
      !data.industry ||
      !data.message
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 2. 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // 3. 验证 reCAPTCHA
    let recaptchaScore = 0;
    if (recaptchaToken) {
      const recaptchaResult = await verifyRecaptcha(recaptchaToken, 0.5);
      if (!recaptchaResult.success) {
        console.error("reCAPTCHA verification failed:", recaptchaResult.error);
        return NextResponse.json(
          { error: "Verification failed, please try again" },
          { status: 400 },
        );
      }
      recaptchaScore = recaptchaResult.score;
    }

    // 4. 检查是否为生产环境
    const isProduction = process.env.NODE_ENV === "production";
    console.log(`=== Environment: ${process.env.NODE_ENV} ===`);
    console.log(`Production mode: ${isProduction}`);

    // 5. 构建请求体
    const requestBody: ContactFormRequest = {
      form: "contact-form",
      content: {
        name: data.name,
        mobile: `${data.countryCode}${data.phone}`,
        email: data.email,
        country: data.country || "",
        company: data.companyName,
        more_words: data.message,
        industry: data.industry,
        phone_contact: data.phoneContact,
        device_words: data.devicesUsed,
        message: body.pageUrl || "",
        referrer: body.referrer || "",
        valid: recaptchaScore.toString(),
      },
    };

    let gatewaySuccess = false;

    if (isProduction) {
      // 生产环境：真实提交到 Gateway
      console.log("=== [PRODUCTION] Submitting to Gateway API ===");

      // 获取 Gateway access token
      let accessToken: string;
      try {
        accessToken = await getAccessToken();
      } catch (error) {
        console.error("Failed to get access token:", error);
        return NextResponse.json(
          { error: "Service temporarily unavailable" },
          { status: 503 },
        );
      }

      // 调用 Gateway API
      console.log("=== Gateway API Request ===");
      console.log("URL: https://app-gateway.realsee.ai/leads/create");
      console.log("Method: POST");
      console.log("Headers:", {
        "Content-Type": "application/json",
        Authorization: `${accessToken.substring(0, 20)}...`,
      });
      console.log("Request Body:", JSON.stringify(requestBody, null, 2));

      const gatewayResponse = await fetch(
        "https://app-gateway.realsee.ai/leads/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
          body: JSON.stringify(requestBody),
        },
      );

      console.log("=== Gateway API Response ===");
      console.log(
        "Status:",
        gatewayResponse.status,
        gatewayResponse.statusText,
      );
      console.log(
        "Response Headers:",
        Object.fromEntries(gatewayResponse.headers.entries()),
      );

      if (!gatewayResponse.ok) {
        const errorText = await gatewayResponse.text();
        console.error("Gateway API Error Body:", errorText);
        console.error("=== End Gateway API Error ===");
        return NextResponse.json(
          { error: "Failed to submit form" },
          { status: 500 },
        );
      }

      const gatewayData: ContactFormResponse = await gatewayResponse.json();
      console.log("Response Body:", JSON.stringify(gatewayData, null, 2));
      console.log("=== End Gateway API Response ===");

      // 检查 Gateway 响应
      if (gatewayData.code !== 0 || gatewayData.status !== "success") {
        console.error("Gateway business error:", gatewayData);
        return NextResponse.json(
          { error: "Failed to submit form" },
          { status: 500 },
        );
      }

      gatewaySuccess = true;
    } else {
      // 非生产环境：跳过 Gateway，仅记录日志
      console.log("=== [DEV/TEST] Skipping Gateway API submission ===");
      console.log(
        "Request Body (not sent):",
        JSON.stringify(requestBody, null, 2),
      );
      console.log("=== Mock Gateway Success ===");
      gatewaySuccess = true;
    }

    // 6. 发送企业微信通知（异步，不阻塞响应）
    // 注意：无论是否为生产环境，都会发送企微通知（如果配置了 WECHAT_WEBHOOK_URL）
    if (gatewaySuccess) {
      sendLeadNotification(data, body.pageUrl, body.referrer).catch((error) => {
        console.error("WeChat notification failed (non-blocking):", error);
      });
    }

    // 7. 返回成功响应
    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message. We will get back to you soon.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
