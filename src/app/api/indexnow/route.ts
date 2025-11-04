import { NextResponse } from "next/server";

/**
 * IndexNow API endpoint
 * Submits URL updates to search engines (Bing, Yandex, etc.) for fast indexing
 *
 * Documentation: https://www.indexnow.org/documentation
 */
export async function POST(request: Request) {
  try {
    const { url, key } = await request.json();

    // Validate inputs
    if (!url || !key) {
      return NextResponse.json(
        { error: "Missing required parameters: url and key" },
        { status: 400 },
      );
    }

    // Verify the key matches the environment variable
    const apiKey = process.env.INDEXNOW_KEY;
    if (!apiKey || key !== apiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Submit to IndexNow API (Bing endpoint)
    const indexNowUrl = "https://api.indexnow.org/indexnow";
    const response = await fetch(indexNowUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: "black-friday.realsee.ai",
        key: apiKey,
        keyLocation: `https://black-friday.realsee.ai/${apiKey}.txt`,
        urlList: [url],
      }),
    });

    if (!response.ok) {
      throw new Error(`IndexNow API returned ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: "URL submitted to IndexNow successfully",
      url,
    });
  } catch (error) {
    console.error("IndexNow submission error:", error);
    return NextResponse.json(
      {
        error: "Failed to submit to IndexNow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint to manually trigger indexing of the main page
 * Usage: curl -X GET https://black-friday.realsee.ai/api/indexnow?key=YOUR_KEY
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  // Verify the key
  const apiKey = process.env.INDEXNOW_KEY;
  if (!apiKey || key !== apiKey) {
    return NextResponse.json(
      { error: "Invalid or missing API key" },
      { status: 401 },
    );
  }

  // Submit the main page
  try {
    const indexNowUrl = "https://api.indexnow.org/indexnow";
    const response = await fetch(indexNowUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: "black-friday.realsee.ai",
        key: apiKey,
        keyLocation: `https://black-friday.realsee.ai/${apiKey}.txt`,
        urlList: ["https://black-friday.realsee.ai"],
      }),
    });

    if (!response.ok) {
      throw new Error(`IndexNow API returned ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: "Main page submitted to IndexNow successfully",
      url: "https://black-friday.realsee.ai",
    });
  } catch (error) {
    console.error("IndexNow submission error:", error);
    return NextResponse.json(
      {
        error: "Failed to submit to IndexNow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
