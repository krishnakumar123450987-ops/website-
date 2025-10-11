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
    // Try to fetch from ADTASK backend
    const response = await fetch(`${ADTASK_BASE_URL}/api/reddit-automation/status`, {
      method: "GET",
      headers: {
        authorization: auth,
        "content-type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      // Also fetch Reddit accounts from OAuth status
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
          console.log('Reddit OAuth status:', redditData);
          
          // Extract connected Reddit accounts from the response
          let connectedAccounts = [];
          
          // Check if user has valid Reddit token (even if connected=false)
          const hasValidToken = redditData?.has_refresh_token || redditData?.token_expires_at;
          const hasUsername = redditData?.reddit_username;
          
          if (hasValidToken && hasUsername) {
            // Treat as connected if we have a valid token and username
            connectedAccounts = [redditData.reddit_username];
            console.log('Treating Reddit account as connected due to valid token:', redditData.reddit_username);
          } else if (redditData?.reddit_username) {
            connectedAccounts = [redditData.reddit_username];
          } else if (Array.isArray(redditData?.accounts)) {
            connectedAccounts = redditData.accounts.map(acc => acc.username || acc.id);
          } else if (Array.isArray(redditData?.reddit_accounts)) {
            connectedAccounts = redditData.reddit_accounts.map(acc => acc.username || acc.id);
          }
          
          // Merge the data with connected accounts
          const mergedData = {
            ...data,
            data: {
              ...data.data,
              connected_accounts: connectedAccounts
            }
          };
          
          return NextResponse.json(mergedData);
        }
      } catch (redditError) {
        console.warn('Failed to fetch Reddit accounts:', redditError);
      }
      
      return NextResponse.json(data);
    }

    // Fallback to mock data if ADTASK backend is not available
    const mockStatus = {
      is_running: false,
      active_rules: 2,
      actions_today: 15,
      connected_accounts: ["account1", "account2"],
      last_updated: new Date().toISOString(),
    };

    return NextResponse.json(mockStatus);
  } catch (error) {
    console.error("Error fetching automation status:", error);
    
    // Return mock data on error
    const mockStatus = {
      is_running: false,
      active_rules: 0,
      actions_today: 0,
      connected_accounts: [],
      last_updated: new Date().toISOString(),
    };

    return NextResponse.json(mockStatus);
  }
}
