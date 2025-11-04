/**
 * Cloudflare KV 客户端
 * 用于 KOL 视频曝光计数的读写操作
 */

import type { ExposureCount, ExposureCounts } from "@/types/kol-exposure";
import { KOL_VIDEOS } from "./constants";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const NAMESPACE_ID = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
const KV_API_TOKEN = process.env.CLOUDFLARE_KV_API_TOKEN;
const EXPOSURE_KEY = "exposure_counts";

/**
 * 验证环境变量配置
 */
function validateConfig(): void {
  if (!ACCOUNT_ID || !NAMESPACE_ID || !KV_API_TOKEN) {
    throw new Error(
      "Missing Cloudflare KV configuration. Please check environment variables: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_NAMESPACE_ID, CLOUDFLARE_KV_API_TOKEN",
    );
  }
}

/**
 * 构建 KV API 的基础 URL
 */
function getKVApiUrl(key?: string): string {
  const base = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}`;
  return key ? `${base}/values/${key}` : base;
}

/**
 * 获取所有视频的曝光计数
 * @returns 曝光计数映射对象
 */
export async function getExposureCounts(): Promise<ExposureCounts> {
  try {
    validateConfig();

    const url = getKVApiUrl(EXPOSURE_KEY);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${KV_API_TOKEN}`,
      },
    });

    if (response.status === 404) {
      // Key 不存在，返回初始化的计数（所有视频为 0）
      return initializeExposureCounts();
    }

    if (!response.ok) {
      throw new Error(
        `KV API error: ${response.status} ${response.statusText}`,
      );
    }

    const counts: ExposureCounts = await response.json();

    // 确保所有视频都有计数（处理新增视频的情况）
    return ensureAllVideosHaveCount(counts);
  } catch (error) {
    console.error("Error fetching exposure counts:", error);
    // 返回初始计数而不是抛出错误
    return initializeExposureCounts();
  }
}

/**
 * 批量增加视频曝光计数
 * @param videoIds 要增加曝光的视频 ID 列表
 */
export async function incrementExposure(videoIds: string[]): Promise<void> {
  try {
    validateConfig();

    // 获取当前计数
    const currentCounts = await getExposureCounts();

    // 增加曝光计数
    for (const videoId of videoIds) {
      currentCounts[videoId] = (currentCounts[videoId] || 0) + 1;
    }

    // 写回 KV
    const url = getKVApiUrl(EXPOSURE_KEY);
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${KV_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentCounts),
    });

    if (!response.ok) {
      throw new Error(
        `KV API error: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error("Error incrementing exposure:", error);
    // 记录错误但不抛出，避免影响用户体验
  }
}

/**
 * 按曝光次数排序返回视频列表
 * @returns 按曝光次数升序排列的视频列表（曝光少的在前）
 */
export async function getVideosByExposure(): Promise<ExposureCount[]> {
  const counts = await getExposureCounts();

  // 转换为数组并排序
  const videos = Object.entries(counts).map(([videoId, count]) => ({
    videoId,
    count,
  }));

  // 按曝光次数升序排序（曝光少的排在前面）
  videos.sort((a, b) => a.count - b.count);

  return videos;
}

/**
 * 初始化所有视频的曝光计数为 0
 */
function initializeExposureCounts(): ExposureCounts {
  const counts: ExposureCounts = {};
  for (const video of KOL_VIDEOS) {
    counts[video.id] = 0;
  }
  return counts;
}

/**
 * 确保所有视频都有计数记录
 * 处理新增视频的情况
 */
function ensureAllVideosHaveCount(counts: ExposureCounts): ExposureCounts {
  const result = { ...counts };
  for (const video of KOL_VIDEOS) {
    if (!(video.id in result)) {
      result[video.id] = 0;
    }
  }
  return result;
}

/**
 * 获取当前环境标识
 */
export function getEnvironment(): string {
  return process.env.NODE_ENV === "production" ? "production" : "development";
}
