import { NextRequest, NextResponse } from "next/server";

const ADTASK_BASE_URL = process.env.ADTASK_BASE_URL || "https://dev.adtask.ai";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth)
    return NextResponse.json(
      { error: "Missing Authorization" },
      { status: 401 },
    );

  try {
    const redirectRaw = `${request.nextUrl.origin}/social-accounts/reddit-callback`;
    // Build URL using URL/searchParams to ensure a single proper encoding (avoid double-encoding)
    const u = new URL(`${ADTASK_BASE_URL}/api/reddit-oauth/auth-url`)
    u.searchParams.set("redirect_uri", redirectRaw)
    const url = u.toString()
    // Debug log so we can see what redirect is forwarded to ADTASK
    console.log("[reddit oauth start] forwarding redirect_uri:", redirectRaw)
    console.log("[reddit oauth start] forwarding url:", url)
    const resp = await fetch(url, {
      method: "GET",
      headers: { authorization: auth },
    })

    const data = await resp.json();
    if (!resp.ok) return NextResponse.json(data, { status: resp.status });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export const GET = POST;
