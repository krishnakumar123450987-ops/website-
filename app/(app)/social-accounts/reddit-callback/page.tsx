"use client"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function RedditCallbackPage() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const code = params.get("code")
    const state = params.get("state")
    const authRaw = localStorage.getItem("adtask_auth") || sessionStorage.getItem("adtask_auth")
    if (!code || !state || !authRaw) {
      if (window.opener) {
        window.opener.postMessage({ type: "reddit_oauth_done", ok: false }, "*")
        window.close()
        return
      }
      router.replace("/social-accounts?oauth=failed")
      return
    }
    const parsed = JSON.parse(authRaw)
    const authorization = parsed?.mode === "bearer" && parsed?.token ? `Bearer ${parsed.token}` : `Basic ${btoa(`${parsed.username}:${parsed.password}`)}`

    ;(async () => {
      try {
        const resp = await fetch(`/api/adtask/api/reddit-oauth/callback`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization,
          },
          body: JSON.stringify({ code, state, redirect_uri: `${window.location.origin}/social-accounts/reddit-callback.html` }),
        })
        if (!resp.ok) throw new Error(await resp.text())
        if (window.opener) {
          window.opener.postMessage({ type: "reddit_oauth_done", ok: true }, "*")
          window.close()
          return
        }
        router.replace("/social-accounts?oauth=ok")
      } catch (e) {
        if (window.opener) {
          window.opener.postMessage({ type: "reddit_oauth_done", ok: false }, "*")
          window.close()
          return
        }
        router.replace("/social-accounts?oauth=failed")
      }
    })()
  }, [params, router])

  return null
}


