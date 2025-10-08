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
    // Check multiple possible endpoints for Reddit accounts
    const endpoints = [
      "api/reddit-oauth/status",
      "api/reddit/accounts", 
      "api/reddit/user-info",
      "api/reddit-oauth/accounts",
      "api/reddit-oauth/list",
      "api/accounts/reddit",
      "api/social-accounts/reddit"
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${ADTASK_BASE_URL}/${endpoint}`, {
          method: "GET",
          headers: {
            authorization: auth,
            "content-type": "application/json",
          },
        });

        const responseText = await response.text();
        let responseData;
        
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = responseText;
        }

        results.push({
          endpoint,
          status: response.status,
          data: responseData
        });
      } catch (error) {
        results.push({
          endpoint,
          status: "error",
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return NextResponse.json({
      message: "Multiple account endpoints check",
      results
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Failed to check multiple accounts",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
