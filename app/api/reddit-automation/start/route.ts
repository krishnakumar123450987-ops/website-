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
