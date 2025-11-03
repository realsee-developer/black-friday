import { NextResponse } from "next/server";
import type {
  VideoExposureResponse,
  RecordExposureRequest,
  RecordExposureResponse,
} from "@/types/kol-exposure";
import {
  getVideosByExposure,
  incrementExposure,
  getEnvironment,
} from "@/lib/cloudflare-kv";

/**
 * GET /api/kol-exposure
 * 获取按曝光次数排序的视频列表（曝光少的在前）
 */
export async function GET() {
  try {
    const videos = await getVideosByExposure();
    const environment = getEnvironment();

    const response: VideoExposureResponse = {
      videos,
      lastUpdated: new Date().toISOString(),
      environment,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/kol-exposure:", error);
    
    return NextResponse.json(
      {
        error: "Failed to fetch exposure data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/kol-exposure
 * 批量记录视频曝光
 */
export async function POST(request: Request) {
  try {
    const body: RecordExposureRequest = await request.json();

    // 验证请求体
    if (!body.videoIds || !Array.isArray(body.videoIds)) {
      return NextResponse.json(
        { error: "Invalid request: videoIds must be an array" },
        { status: 400 }
      );
    }

    // 过滤掉无效的视频 ID
    const validVideoIds = body.videoIds.filter(
      (id) => typeof id === "string" && id.trim() !== ""
    );

    if (validVideoIds.length === 0) {
      return NextResponse.json(
        { error: "No valid video IDs provided" },
        { status: 400 }
      );
    }

    // 记录曝光
    await incrementExposure(validVideoIds);

    const response: RecordExposureResponse = {
      success: true,
      recorded: validVideoIds.length,
      message: `Successfully recorded ${validVideoIds.length} exposures`,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/kol-exposure:", error);

    // 即使出错也返回成功，避免影响用户体验
    // 错误已经记录在日志中
    const response: RecordExposureResponse = {
      success: false,
      recorded: 0,
      message: "Failed to record exposures, but request accepted",
    };

    return NextResponse.json(response, { status: 200 });
  }
}

