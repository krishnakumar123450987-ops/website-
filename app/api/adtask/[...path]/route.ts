import { NextRequest, NextResponse } from "next/server"

// Catch-all proxy to forward requests to ADTASK backend
// Requires Basic Auth credentials per request via headers from the client

const ADTASK_BASE_URL = process.env.ADTASK_BASE_URL || "https://dev.adtask.ai"

async function forward(request: NextRequest, { params }: { params: { path: string[] } }) {
  const targetPath = params.path?.join("/") || ""
  const url = `${ADTASK_BASE_URL}/${targetPath}`

  const method = request.method
  const headers = new Headers()

  // Forward content-type if present and Authorization for Basic auth
  const incomingContentType = request.headers.get("content-type")
  if (incomingContentType) headers.set("content-type", incomingContentType)
  const auth = request.headers.get("authorization")
  if (auth) headers.set("authorization", auth)

  try {
    const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer()

    const resp = await fetch(url, {
      method,
      headers,
      body: body as BodyInit | undefined,
    })

    const respHeaders = new Headers()
    // Pass through JSON and pagination related headers; avoid exposing set-cookie
    const contentType = resp.headers.get("content-type")
    if (contentType) respHeaders.set("content-type", contentType)

    const text = await resp.text()
    return new NextResponse(text, { status: resp.status, headers: respHeaders })
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy error", details: (error as Error).message },
      { status: 502 },
    )
  }
}

export const GET = forward
export const POST = forward
export const PUT = forward
export const PATCH = forward
export const DELETE = forward



