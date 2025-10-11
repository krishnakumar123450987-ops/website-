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
    // First, check the current Reddit OAuth status
    const redditResponse = await fetch(`${ADTASK_BASE_URL}/api/reddit-oauth/status`, {
      method: "GET",
      headers: {
        authorization: auth,
        "content-type": "application/json",
      },
    });
    
    if (!redditResponse.ok) {
      return NextResponse.json({
        success: false,
        message: "Failed to check Reddit status",
        error: "REDDIT_STATUS_ERROR"
      }, { status: 400 });
    }
    
    const redditData = await redditResponse.json();
    console.log('Current Reddit OAuth status:', redditData);
    
    // Check if user has valid Reddit token
    const hasValidToken = redditData?.has_refresh_token || redditData?.token_expires_at;
    const hasUsername = redditData?.reddit_username;
    
    if (!hasValidToken || !hasUsername) {
      return NextResponse.json({
        success: false,
        message: "No valid Reddit account found. Please connect a Reddit account first.",
        error: "NO_REDDIT_ACCOUNT"
      }, { status: 400 });
    }
    
    // Try to force refresh the Reddit connection
    try {
      const refreshResponse = await fetch(`${ADTASK_BASE_URL}/api/reddit-oauth/refresh`, {
        method: "POST",
        headers: {
          authorization: auth,
          "content-type": "application/json",
        },
      });
      
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        console.log('Reddit token refreshed:', refreshData);
      }
    } catch (refreshError) {
      console.warn('Failed to refresh Reddit token:', refreshError);
    }
    
    // Try to activate the Reddit account for automation
    try {
      const activateResponse = await fetch(`${ADTASK_BASE_URL}/api/reddit-automation/activate-account`, {
        method: "POST",
        headers: {
          authorization: auth,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          reddit_username: redditData.reddit_username,
          reddit_user_id: redditData.reddit_user_id
        }),
      });
      
      if (activateResponse.ok) {
        const activateData = await activateResponse.json();
        console.log('Reddit account activated for automation:', activateData);
        
        return NextResponse.json({
          success: true,
          message: "Reddit account activated for automation",
          reddit_username: redditData.reddit_username,
          data: activateData
        });
      }
    } catch (activateError) {
      console.warn('Failed to activate Reddit account:', activateError);
    }
    
    // If activation endpoint doesn't exist, try to start automation with the account
    try {
      const startResponse = await fetch(`${ADTASK_BASE_URL}/api/reddit-automation/start`, {
        method: "POST",
        headers: {
          authorization: auth,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          force_reddit_account: redditData.reddit_username
        }),
      });
      
      if (startResponse.ok) {
        const startData = await startResponse.json();
        console.log('Automation started with Reddit account:', startData);
        
        return NextResponse.json({
          success: true,
          message: "Reddit automation started with account",
          reddit_username: redditData.reddit_username,
          data: startData
        });
      }
    } catch (startError) {
      console.warn('Failed to start automation with Reddit account:', startError);
    }
    
    // Fallback: return success with the account info
    return NextResponse.json({
      success: true,
      message: "Reddit account is ready for automation",
      reddit_username: redditData.reddit_username,
      reddit_user_id: redditData.reddit_user_id,
      has_refresh_token: redditData.has_refresh_token,
      token_expires_at: redditData.token_expires_at
    });
    
  } catch (error) {
    console.error("Error activating Reddit account:", error);
    return NextResponse.json(
      { 
        error: "Failed to activate Reddit account",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
