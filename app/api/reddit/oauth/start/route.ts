import { NextRequest, NextResponse } from "next/server"

const ADTASK_BASE_URL = process.env.ADTASK_BASE_URL || "https://dev.adtask.ai"

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (!auth) return NextResponse.json({ error: "Missing Authorization" }, { status: 401 })

  try {
    // Use static HTML callback to avoid Next.js chunk loading issues in popup
    const redirect = encodeURIComponent(`${request.nextUrl.origin}/social-accounts/reddit-callback.html`)
    // Backend expects GET /api/reddit-oauth/auth-url (optionally with redirect_uri)
    const url = `${ADTASK_BASE_URL}/api/reddit-oauth/auth-url?redirect_uri=${redirect}`
    const resp = await fetch(url, {
      method: "GET",
      headers: { authorization: auth },
    })

    const data = await resp.json()
    if (!resp.ok) return NextResponse.json(data, { status: resp.status })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export const GET = POST


