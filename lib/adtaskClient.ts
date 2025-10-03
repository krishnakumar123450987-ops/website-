export type BasicAuth = { username: string; password: string }
export type BearerAuth = { token: string }

export function encodeBasicAuth({ username, password }: BasicAuth): string {
  if (!username || !password) return ""
  const toEncode = `${username}:${password}`
  // Use browser-safe base64
  const encoded = typeof window !== "undefined" && window.btoa ? window.btoa(toEncode) : Buffer.from(toEncode).toString("base64")
  return `Basic ${encoded}`
}

type RequestOptions = {
  path: string
  method?: string
  body?: unknown
  auth?: BasicAuth
  bearer?: BearerAuth
  authorization?: string // raw Authorization header, overrides others if provided
}

export async function adtaskRequest<T = unknown>({ path, method = "GET", body, auth, bearer, authorization }: RequestOptions): Promise<T> {
  const headers: Record<string, string> = { "content-type": "application/json" }
  if (authorization) headers["authorization"] = authorization
  else if (bearer?.token) headers["authorization"] = `Bearer ${bearer.token}`
  else if (auth) headers["authorization"] = encodeBasicAuth(auth)

  const response = await fetch(`/api/adtask/${path}`, {
    method,
    headers,
    body: body && method !== "GET" ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let errorText: string
    try {
      const data = await response.json()
      errorText = data?.error || JSON.stringify(data)
    } catch {
      errorText = await response.text()
    }
    throw new Error(`ADTASK request failed (${response.status}): ${errorText}`)
  }

  const contentType = response.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return (await response.json()) as T
  }
  // @ts-expect-error generic non-JSON
  return (await response.text()) as T
}



