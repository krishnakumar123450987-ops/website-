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
    const body = await request.json();
    const { subreddit = "test", title = "Test Post", content = "This is a test post from automation" } = body;

    // Try to create a test post on Reddit
    const response = await fetch(`${ADTASK_BASE_URL}/api/reddit/post`, {
      method: "POST",
      headers: {
        authorization: auth,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        subreddit,
        title,
        text: content,
        kind: "self"
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        message: "Test post created successfully",
        data
      });
    } else {
      const errorData = await response.json();
      return NextResponse.json({
        success: false,
        message: "Failed to create test post",
        error: errorData,
        status: response.status
      }, { status: response.status });
    }
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Failed to test Reddit post",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
