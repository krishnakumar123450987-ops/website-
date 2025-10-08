import { NextRequest, NextResponse } from "next/server";

// Temporary endpoint to log API responses for debugging
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("=== DEBUG LOG ===");
    console.log("Endpoint:", body.endpoint);
    console.log("Timestamp:", body.timestamp);
    console.log("Response:", JSON.stringify(body.response, null, 2));
    console.log("=================");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Debug logging error:", error);
    return NextResponse.json({ error: "Failed to log" }, { status: 500 });
  }
}
