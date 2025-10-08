"use client"

import type React from "react"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Mode = "signin" | "signup"

export function AuthCard() {
  const [mode, setMode] = useState<Mode>("signin")

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log("[v0] Auth submit:", { mode })
  }

  return (
    <Card
      className={cn(
        "w-full max-w-xl border rounded-xl",
        // light panel feel like the reference
        "bg-card",
      )}
      // light inset border effect to mimic the screenshot
      style={{
        boxShadow:
          "0 1px 0 0 color-mix(in oklab, var(--color-foreground) 6%, transparent), 0 8px 30px rgba(0,0,0,0.04)",
      }}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden className="size-5 text-primary" />
          <CardTitle className="text-balance">Postrendify</CardTitle>
        </div>
        <CardDescription className="text-pretty">
          Postrendify helps you manage your social media with AI-powered content creation
        </CardDescription>

        {/* Tab-like controls */}
        <div role="tablist" aria-label="Authentication mode" className="grid grid-cols-2 gap-2">
          <button
            role="tab"
            aria-selected={mode === "signin"}
            onClick={() => setMode("signin")}
            className={cn(
              "h-9 rounded-md border text-sm transition",
              mode === "signin"
                ? "bg-secondary text-foreground"
                : "bg-secondary/60 text-foreground/80 hover:bg-secondary",
            )}
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => setMode("signup")}
            className={cn(
              "h-9 rounded-md border text-sm transition",
              mode === "signup"
                ? "bg-secondary text-foreground"
                : "bg-secondary/60 text-foreground/80 hover:bg-secondary",
            )}
          >
            Sign Up
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              placeholder="demo@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">Demo: Use demo@example.com with any password</p>
        </form>
      </CardContent>
    </Card>
  )
}
