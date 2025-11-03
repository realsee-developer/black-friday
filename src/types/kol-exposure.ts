/**
 * KOL 视频曝光追踪相关类型
 */

/**
 * 单个 KOL 视频的曝光计数
 */
export interface ExposureCount {
  videoId: string;
  count: number;
}

/**
 * 所有视频的曝光计数映射
 */
export interface ExposureCounts {
  [videoId: string]: number;
}

/**
 * 按曝光次数排序的视频列表响应
 */
export interface VideoExposureResponse {
  videos: ExposureCount[];
  lastUpdated: string;
  environment?: string;
}

/**
 * 记录曝光的请求体
 */
export interface RecordExposureRequest {
  videoIds: string[];
}

/**
 * 记录曝光的响应
 */
export interface RecordExposureResponse {
  success: boolean;
  recorded: number;
  message?: string;
}

/**
 * KOL 统计信息（用于管理页面）
 */
export interface KOLStats {
  videoId: string;
  youtubeId: string;
  title: string;
  creator: string;
  exposureCount: number;
}

