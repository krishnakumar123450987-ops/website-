import { AuthCard } from "@/components/auth-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main
      className="min-h-dvh flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(800px 400px at 70% 5%, color-mix(in oklab, var(--color-accent) 12%, var(--color-background)), var(--color-background))",
      }}
    >
      <div className="flex w-full max-w-xl flex-col items-stretch gap-4">
        <AuthCard />
        <Link href="/overview" className="self-center">
          <Button variant="secondary">Continue to Dashboard (demo)</Button>
        </Link>
      </div>
    </main>
  )
}
