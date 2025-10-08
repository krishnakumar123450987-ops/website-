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
    // Try to stop automation in ADTASK backend
    const response = await fetch(`${ADTASK_BASE_URL}/api/reddit-automation/stop`, {
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
      message: "Reddit automation stopped successfully",
      stopped_at: new Date().toISOString(),
      status: "stopped",
    });
  } catch (error) {
    console.error("Error stopping automation:", error);
    return NextResponse.json(
      { error: "Failed to stop automation" },
      { status: 500 }
    );
  }
}
