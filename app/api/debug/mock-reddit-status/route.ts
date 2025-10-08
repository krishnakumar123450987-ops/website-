import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Mock different possible response formats to test frontend parsing
  const mockResponses = [
    {
      name: "Format 1: accounts array",
      data: {
        accounts: [
          { id: "1", platform: "reddit", username: "testuser1" },
          { id: "2", platform: "reddit", username: "testuser2" }
        ]
      }
    },
    {
      name: "Format 2: reddit_accounts array", 
      data: {
        reddit_accounts: [
          { id: "1", username: "testuser1" },
          { id: "2", username: "testuser2" }
        ]
      }
    },
    {
      name: "Format 3: reddit.username",
      data: {
        reddit: {
          username: "testuser1"
        }
      }
    },
    {
      name: "Format 4: connected + reddit_username",
      data: {
        connected: true,
        reddit_username: "testuser1",
        reddit_user_id: "123"
      }
    },
    {
      name: "Format 5: empty response",
      data: {}
    }
  ];

  const formatIndex = Math.floor(Math.random() * mockResponses.length);
  const selectedFormat = mockResponses[formatIndex];

  return NextResponse.json({
    format: selectedFormat.name,
    data: selectedFormat.data
  });
}
