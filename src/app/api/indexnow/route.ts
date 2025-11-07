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
 * GET endpoint to return the IndexNow key for verification
 * This endpoint should return the key as plain text
 * Used by scripts CLI to fetch the key before submitting URLs
 */
export async function GET(_request: Request) {
  const apiKey = process.env.INDEXNOW_KEY;
  
  // Return the IndexNow key for verification
  // This endpoint should return the key as plain text
  if (!apiKey) {
    return new NextResponse("IndexNow key not configured", { status: 404 });
  }

  return new NextResponse(apiKey, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
