import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // This endpoint will help test the Reddit connection
  return NextResponse.json({
    message: "Reddit connection test endpoint",
    instructions: [
      "1. Go to http://localhost:3001/social-accounts",
      "2. Open browser developer tools (F12)",
      "3. Go to Console tab",
      "4. Click 'Refresh' button",
      "5. Look for debug logs starting with 'Reddit OAuth Status Response:'",
      "6. Check what the actual response data structure looks like"
    ],
    expectedFormats: [
      "data.accounts (array)",
      "data.reddit_accounts (array)", 
      "data.reddit.username (string)",
      "data.connected + data.reddit_username",
      "data.username (direct)",
      "data.user.username",
      "data.data.username"
    ],
    currentStatus: "Waiting for browser console logs to see actual response format"
  });
}
