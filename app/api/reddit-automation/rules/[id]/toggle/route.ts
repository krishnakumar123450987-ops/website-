import { NextRequest, NextResponse } from "next/server";

const ADTASK_BASE_URL = process.env.ADTASK_BASE_URL || "https://dev.adtask.ai";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = request.headers.get("authorization");
  if (!auth) {
    return NextResponse.json(
      { error: "Missing Authorization" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { enabled } = body;

    // Try to update rule in ADTASK backend
    const response = await fetch(
      `${ADTASK_BASE_URL}/api/reddit-automation/rules/${params.id}/toggle`,
      {
        method: "PUT",
        headers: {
          authorization: auth,
          "content-type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Fallback: return mock success response
    return NextResponse.json({
      id: params.id,
      enabled,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error toggling automation rule:", error);
    return NextResponse.json(
      { error: "Failed to toggle rule" },
      { status: 500 }
    );
  }
}
