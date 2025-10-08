"use client";

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, Bot, Calendar, ListChecks, Share2, Settings } from "lucide-react"

const nav = [
  { href: "/overview", label: "Overview", icon: Briefcase },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/content-calendar", label: "Content Calendar", icon: Calendar },
  { href: "/posting-queue", label: "Posting Queue", icon: ListChecks },
  { href: "/social-accounts", label: "Social Accounts", icon: Share2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

function TopNav() {
  const pathname = usePathname();
  return (
    <nav className="w-full">
      <ul className="flex flex-wrap items-center gap-2">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition",
                  active
                    ? "bg-secondary text-foreground"
                    : "bg-secondary/60 text-foreground/80 hover:bg-secondary",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-4" aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/overview" className="flex items-center gap-2">
              <Briefcase className="size-5 text-primary" aria-hidden />
              <span className="font-semibold tracking-tight">Postrendify</span>
            </Link>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  alt="User avatar"
                  src="/diverse-user-avatars.png"
                />
                <AvatarFallback>PR</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="mt-4">
            <TopNav />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
