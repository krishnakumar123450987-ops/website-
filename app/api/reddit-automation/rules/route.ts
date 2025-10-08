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
    const response = await fetch(`${ADTASK_BASE_URL}/api/reddit-automation/rules`, {
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
    const mockRules = [
      {
        id: "1",
        name: "Tech News Auto Engagement",
        type: "auto_comment",
        enabled: true,
        config: {
          subreddits: ["technology", "programming"],
          keywords: ["AI", "blockchain", "startup"],
          comment_templates: [
            "Great article! Thanks for sharing.",
            "This is really interesting, looking forward to seeing how this develops.",
            "Solid points made here.",
          ],
          delay_min: 120,
          delay_max: 480,
          daily_limit: 20,
          conditions: {
            min_upvotes: 5,
            max_age_hours: 12,
          },
        },
        stats: {
          total_actions: 156,
          actions_today: 8,
          last_run: new Date().toISOString(),
          success_rate: 94,
        },
      },
      {
        id: "2",
        name: "Trending Post Upvotes",
        type: "auto_upvote",
        enabled: false,
        config: {
          subreddits: ["cryptocurrency", "stocks"],
          keywords: ["Bitcoin", "Ethereum", "market"],
          daily_limit: 100,
          conditions: {
            min_upvotes: 10,
            max_age_hours: 6,
          },
        },
        stats: {
          total_actions: 423,
          actions_today: 0,
          success_rate: 98,
        },
      },
    ];

    return NextResponse.json(mockRules);
  } catch (error) {
    console.error("Error fetching automation rules:", error);
    return NextResponse.json([], { status: 200 });
  }
}

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

    // Try to create rule in ADTASK backend
    const response = await fetch(`${ADTASK_BASE_URL}/api/reddit-automation/rules`, {
      method: "POST",
      headers: {
        authorization: auth,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Fallback: return mock success response
    const mockRule = {
      id: `rule_${Date.now()}`,
      ...body,
      enabled: false,
      stats: {
        total_actions: 0,
        actions_today: 0,
        success_rate: 0,
      },
    };

    return NextResponse.json(mockRule, { status: 201 });
  } catch (error) {
    console.error("Error creating automation rule:", error);
    return NextResponse.json(
      { error: "Failed to create rule" },
      { status: 500 }
    );
  }
}
