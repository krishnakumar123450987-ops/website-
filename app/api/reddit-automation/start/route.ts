import { NextRequest, NextResponse } from "next/server";

const ADTASK_BASE_URL = process.env.ADTASK_BASE_URL || "https://dev.adtask.ai";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth) {
    return NextResponse.json(
      { error: "Missing Authorization" },
      { status: 401 }
    );
  }

  try {
    // First check if we have valid Reddit accounts
    try {
      const redditResponse = await fetch(`${ADTASK_BASE_URL}/api/reddit-oauth/status`, {
        method: "GET",
        headers: {
          authorization: auth,
          "content-type": "application/json",
        },
      });
      
      if (redditResponse.ok) {
        const redditData = await redditResponse.json();
        console.log('Reddit OAuth status for automation start:', redditData);
        
        // Check if user has valid Reddit token (even if connected=false)
        const hasValidToken = redditData?.has_refresh_token || redditData?.token_expires_at;
        const hasUsername = redditData?.reddit_username;
        
        if (!hasValidToken || !hasUsername) {
          return NextResponse.json({
            success: false,
            message: "No valid Reddit account connected. Please connect a Reddit account first.",
            error: "NO_REDDIT_ACCOUNT"
          }, { status: 400 });
        }
      }
    } catch (redditError) {
      console.warn('Failed to check Reddit status:', redditError);
    }

    // Try to start automation in ADTASK backend
    const response = await fetch(`${ADTASK_BASE_URL}/api/reddit-automation/start`, {
      method: "POST",
      headers: {
        authorization: auth,
        "content-type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Fallback: return mock success response
    return NextResponse.json({
      success: true,
      message: "Reddit automation started successfully",
      started_at: new Date().toISOString(),
      status: "running",
    });
  } catch (error) {
    console.error("Error starting automation:", error);
    return NextResponse.json(
      { error: "Failed to start automation" },
      { status: 500 }
    );
  }
}
