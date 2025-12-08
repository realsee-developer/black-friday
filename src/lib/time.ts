/**
 * 获取美东时间（EST/EDT）
 * EST: UTC-5 (11月第一个周日 - 3月第二个周日)
 * EDT: UTC-4 (3月第二个周日 - 11月第一个周日)
 */
export function getEasternTime(date: Date = new Date()): Date {
  // 使用 Intl.DateTimeFormat 自动处理夏令时
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const values: Record<string, string> = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }

  return new Date(
    `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`,
  );
}

/**
 * 创建美东时间
 */
export function createEasternDate(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
): Date {
  // 创建一个美东时间的日期字符串
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;

  // 使用 Date 构造函数并指定时区
  return new Date(`${dateStr}-05:00`); // EST 固定偏移（简化版）
}

/**
 * 倒计时阶段定义
 */
export type CountdownStage = "before" | "active" | "ending" | "ended";

/**
 * 活动时间配置
 */
export const EVENT_DATES = {
  // 开始倒计时显示时间
  COUNTDOWN_START: createEasternDate(2025, 11, 10, 0, 0, 0),

  // 活动开始时间
  EVENT_START: createEasternDate(2025, 11, 17, 0, 0, 0),

  // 结束倒计时显示时间
  COUNTDOWN_ENDING: createEasternDate(2025, 12, 1, 0, 0, 0),

  // 活动结束时间
  EVENT_END: createEasternDate(2025, 12, 7, 23, 59, 59),

  // 活动下线时间（北京时间 2025-12-08 16:00 = UTC 2025-12-08 08:00）
  EVENT_OFFLINE: new Date("2025-12-08T08:00:00Z"), // UTC 时间
} as const;

/**
 * 获取当前倒计时阶段
 */
export function getCountdownStage(
  currentTime: Date = new Date(),
): CountdownStage {
  const now = getEasternTime(currentTime);

  if (now < EVENT_DATES.EVENT_START) {
    return "before";
  }

  if (now >= EVENT_DATES.EVENT_START && now < EVENT_DATES.COUNTDOWN_ENDING) {
    return "active";
  }

  if (now >= EVENT_DATES.COUNTDOWN_ENDING && now < EVENT_DATES.EVENT_END) {
    return "ending";
  }

  return "ended";
}

/**
 * 计算倒计时数据
 */
export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  stage: CountdownStage;
  targetDate: Date;
}

export function calculateCountdown(
  currentTime: Date = new Date(),
  forcedStage?: CountdownStage | null,
): CountdownData {
  const stage = forcedStage || getCountdownStage(currentTime);
  const now = getEasternTime(currentTime);

  // 根据阶段确定目标时间
  let targetDate: Date;

  switch (stage) {
    case "before":
      targetDate = EVENT_DATES.EVENT_START;
      break;
    case "active":
      // 活动进行中，倒计时到结束倒计时阶段
      targetDate = EVENT_DATES.COUNTDOWN_ENDING;
      break;
    case "ending":
      targetDate = EVENT_DATES.EVENT_END;
      break;
    default:
      // 活动已结束，返回零值
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        stage: "ended",
        targetDate: EVENT_DATES.EVENT_END,
      };
  }

  // 计算时间差（毫秒）
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      stage,
      targetDate,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    stage,
    targetDate,
  };
}

/**
 * 获取倒计时阶段文案
 */
export function getCountdownMessage(stage: CountdownStage): string {
  switch (stage) {
    case "before":
      return "Event Start In";
    case "active":
      return "Event Live Now";
    case "ending":
      return "Event End In";
    case "ended":
      return "Event Has Ended";
    default:
      return "";
  }
}

/**
 * 格式化倒计时数字（补零）
 */
export function formatCountdownNumber(num: number): string {
  return num.toString().padStart(2, "0");
}

/**
 * 获取活动阶段（用于 CountdownTimer）
 */
export function getEventPhase(
  currentTime: Date = new Date(),
): "before" | "active" | "ending" | "ended" {
  return getCountdownStage(currentTime);
}

/**
 * 获取剩余时间（用于 CountdownTimer）
 */
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function getTimeRemaining(
  currentTime: Date = new Date(),
): TimeRemaining {
  const countdown = calculateCountdown(currentTime);
  return {
    days: countdown.days,
    hours: countdown.hours,
    minutes: countdown.minutes,
    seconds: countdown.seconds,
    total: countdown.totalSeconds * 1000, // 返回毫秒
  };
}

/**
 * 获取按钮文本（用于 ProductOffers）
 * 根据商品上架时间决定显示"Buy Now"还是"Contact Us"
 */
export function getButtonText(availableFrom: Date): string {
  const now = new Date();
  if (now >= availableFrom) {
    return "Buy Now";
  }
  return "Contact Us";
}

/**
 * 检查是否已到达下线时间
 * @param currentTime 当前时间，默认为 new Date()
 * @returns 如果已到达下线时间返回 true
 */
export function isEventOffline(currentTime: Date = new Date()): boolean {
  // 测试模式：可以通过环境变量 FORCE_OFFLINE=true 强制显示下线状态
  if (typeof window !== "undefined" && window.location.search.includes("offline=true")) {
    return true;
  }
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_FORCE_OFFLINE === "true") {
    return true;
  }
  return currentTime >= EVENT_DATES.EVENT_OFFLINE;
}

/**
 * 获取距离下线时间的剩余毫秒数
 * @param currentTime 当前时间，默认为 new Date()
 * @returns 剩余毫秒数，如果已过期则返回 0
 */
export function getTimeUntilOffline(currentTime: Date = new Date()): number {
  const diff = EVENT_DATES.EVENT_OFFLINE.getTime() - currentTime.getTime();
  return Math.max(0, diff);
}
