/**
 * 企业微信机器人 Webhook 推送服务
 */

import type { ContactFormData } from "@/types";

interface WechatMarkdownMessage {
  msgtype: "markdown";
  markdown: {
    content: string;
  };
}

/**
 * 向企业微信机器人发送线索通知
 * @param data 联系表单数据
 * @param pageUrl 当前页面 URL
 * @param referrer 来源页面 URL
 */
export async function sendLeadNotification(
  data: ContactFormData,
  pageUrl?: string,
  referrer?: string,
): Promise<void> {
  const webhookUrl = process.env.WECHAT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("WECHAT_WEBHOOK_URL not configured, skipping notification");
    return;
  }

  try {
    // 构建 Markdown 格式的消息
    const message = buildMarkdownMessage(data, pageUrl, referrer);

    console.log("=== WeChat Webhook Request ===");
    console.log("URL:", webhookUrl);
    console.log("Message:", JSON.stringify(message, null, 2));

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    console.log("=== WeChat Webhook Response ===");
    console.log("Status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("WeChat webhook error:", errorText);
      console.error("=== End WeChat Webhook Error ===");
      return;
    }

    const result = await response.json();
    console.log("Response Body:", JSON.stringify(result, null, 2));
    console.log("=== End WeChat Webhook Response ===");

    if (result.errcode !== 0) {
      console.error("WeChat webhook business error:", result);
    }
  } catch (error) {
    // 企业微信推送失败不应该影响主流程，只记录错误
    console.error("Failed to send WeChat notification:", error);
  }
}

/**
 * 随机选择一个表情
 */
function randomEmoji(emojiArray: string[]): string {
  return emojiArray[Math.floor(Math.random() * emojiArray.length)];
}

/**
 * 构建 Markdown 格式的消息
 */
function buildMarkdownMessage(
  data: ContactFormData,
  _pageUrl?: string,
  _referrer?: string,
): WechatMarkdownMessage {
  const now = new Date();
  const timestamp = now.toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // 随机表情库
  const excitementEmojis = ["🔥", "💰", "🎉", "⚡", "✨", "🌟", "💎", "🎯"];
  const phoneEmojis = ["☎️", "📞", "📱"];
  const emailEmojis = ["📧", "✉️", "💌"];
  const customerEmojis = ["👤", "🎯", "💎", "⭐"];
  const companyEmojis = ["🏢", "🏆", "💼"];
  const ctaEmojis = ["💡", "👉", "📊", "💼"];

  // 构建精简的 Markdown 内容 - 随机表情版
  // 只保留最核心的识别信息，详细内容查看 Zoho CRM
  const titleEmoji = randomEmoji(excitementEmojis);
  // 根据法务要求：输入手机号即认为同意联系，所以始终使用电话表情
  const contactEmoji = randomEmoji(phoneEmojis);

  let content = `# ${titleEmoji} 您有新的商机请跟进 ${contactEmoji}\n\n`;
  content += `> ⏰ <font color="warning">**${timestamp}**</font>\n\n`;

  // 客户核心信息
  const customerEmoji = randomEmoji(customerEmojis);
  content += `## ${customerEmoji} <font color="info">**${data.name}**</font>\n\n`;

  // 国家和公司
  if (data.country) {
    content += `🌍 ${data.country}`;
    if (data.companyName) {
      const companyEmoji = randomEmoji(companyEmojis);
      content += ` | ${companyEmoji} ${data.companyName}`;
    }
    content += `\n`;
  } else if (data.companyName) {
    const companyEmoji = randomEmoji(companyEmojis);
    content += `${companyEmoji} ${data.companyName}\n`;
  }

  content += `🏭 ${data.industry}\n\n`;

  // 根据法务要求：输入手机号即认为同意联系
  const phoneHighlight = randomEmoji(phoneEmojis);
  content += `> ${phoneHighlight} <font color="warning">**可直接致电！**</font> ✅\n\n`;

  // CTA
  const ctaEmoji = randomEmoji(ctaEmojis);
  content += `${ctaEmoji} <font color="info">详情见 Zoho CRM</font>`;

  return {
    msgtype: "markdown",
    markdown: {
      content,
    },
  };
}
