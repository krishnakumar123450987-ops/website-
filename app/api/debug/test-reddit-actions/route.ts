import { NextRequest, NextResponse } from "next/server";

const ADTASK_BASE_URL = process.env.ADTASK_BASE_URL || "https://dev.adtask.ai";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth) {
    return NextResponse.json(
      { error: "Missing Authorization" },
      { status: 401 }
    );
  }

  try {
    // Check Reddit OAuth status
    const redditResponse = await fetch(`${ADTASK_BASE_URL}/api/reddit-oauth/status`, {
      method: "GET",
      headers: {
        authorization: auth,
        "content-type": "application/json",
      },
    });
    
    if (redditResponse.ok) {
      const redditData = await redditResponse.json();
      
      // Check if user has valid Reddit token
      const hasValidToken = redditData?.has_refresh_token || redditData?.token_expires_at;
      const hasUsername = redditData?.reddit_username;
      
      return NextResponse.json({
        reddit_status: redditData,
        can_perform_actions: hasValidToken && hasUsername,
        connected_accounts: hasValidToken && hasUsername ? [redditData.reddit_username] : [],
        message: hasValidToken && hasUsername 
          ? "Reddit account is ready for automation" 
          : "Reddit account needs to be reconnected"
      });
    }
    
    return NextResponse.json({
      error: "Failed to check Reddit status",
      can_perform_actions: false
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Failed to test Reddit actions",
        details: error instanceof Error ? error.message : String(error),
        can_perform_actions: false
      },
      { status: 500 }
    );
  }
}
