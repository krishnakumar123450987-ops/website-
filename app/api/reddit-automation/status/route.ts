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
