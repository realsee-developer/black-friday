import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/gateway-auth";
import { verifyRecaptcha } from "@/lib/recaptcha";
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
        { status: 400 }
      );
    }

    // 2. 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
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
          { status: 400 }
        );
      }
      recaptchaScore = recaptchaResult.score;
    }

    // 4. 获取 Gateway access token
    let accessToken: string;
    try {
      accessToken = await getAccessToken();
    } catch (error) {
      console.error("Failed to get access token:", error);
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

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

    // 6. 调用 Gateway API
    console.log("=== Gateway API Request ===");
    console.log("URL: https://app-gateway.realsee.ai/leads/create");
    console.log("Method: POST");
    console.log("Headers:", {
      "Content-Type": "application/json",
      Authorization: `${accessToken.substring(0, 20)}...`, // 只显示前20个字符
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
      }
    );

    console.log("=== Gateway API Response ===");
    console.log("Status:", gatewayResponse.status, gatewayResponse.statusText);
    console.log(
      "Response Headers:",
      Object.fromEntries(gatewayResponse.headers.entries())
    );

    if (!gatewayResponse.ok) {
      const errorText = await gatewayResponse.text();
      console.error("Gateway API Error Body:", errorText);
      console.error("=== End Gateway API Error ===");
      return NextResponse.json(
        { error: "Failed to submit form" },
        { status: 500 }
      );
    }

    const gatewayData: ContactFormResponse = await gatewayResponse.json();
    console.log("Response Body:", JSON.stringify(gatewayData, null, 2));
    console.log("=== End Gateway API Response ===");

    // 7. 检查 Gateway 响应
    if (gatewayData.code !== 0 || gatewayData.status !== "success") {
      console.error("Gateway business error:", gatewayData);
      return NextResponse.json(
        { error: "Failed to submit form" },
        { status: 500 }
      );
    }

    // 8. 返回成功响应
    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message. We will get back to you soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
