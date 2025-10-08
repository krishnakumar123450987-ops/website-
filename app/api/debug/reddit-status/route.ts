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
    // Fetch from ADTASK backend
    const response = await fetch(`${ADTASK_BASE_URL}/api/reddit-oauth/status`, {
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

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
      rawResponse: responseText,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Failed to fetch Reddit status",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
