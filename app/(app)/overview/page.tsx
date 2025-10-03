import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, BarChart3, MessageSquare, Share2, ListChecks } from "lucide-react"

// Overview stat cards
function StatCard({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string
  value: string
  hint: string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}) {
  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription>{hint}</CardDescription>
        </div>
        <Icon className="size-4 text-muted-foreground" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}

function EmptyPanel({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground">
        <Icon className="size-10" aria-hidden />
        <p className="max-w-sm">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Top metric cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Posts" value="0" hint="Create your first post" icon={MessageSquare} />
        <StatCard title="Scheduled" value="0" hint="No posts scheduled" icon={Activity} />
        <StatCard title="Success Rate" value="0.0%" hint="No posts yet" icon={BarChart3} />
        <StatCard title="Connected Accounts" value="0" hint="Connect your accounts" icon={Share2} />
      </section>

      {/* Middle two-up panels */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Weekly Activity</CardTitle>
            <CardDescription>Posts published in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="flex h-56 items-center justify-center text-muted-foreground">
            No posts published this week
          </CardContent>
        </Card>

        <EmptyPanel title="Platform Distribution" subtitle="No platform data available" icon={BarChart3} />
      </section>

      {/* Bottom two-up panels */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Get started with your social media management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-muted-foreground" aria-hidden />
                <span>Create content with AI</span>
              </div>
              <Badge variant="secondary" className="text-foreground">
                New
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <div className="flex items-center gap-2">
                <Share2 className="size-4 text-muted-foreground" aria-hidden />
                <span>Connect social accounts</span>
              </div>
              <Badge className="bg-orange-100 text-orange-900 hover:bg-orange-100">Required</Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-muted-foreground" aria-hidden />
                <span>Schedule your first post</span>
              </div>
              <Button size="sm" variant="secondary">
                Start here
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <div className="flex items-center gap-2">
                <ListChecks className="size-4 text-muted-foreground" aria-hidden />
                <span>Monitor posting queue</span>
              </div>
              <div />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Your latest social media activity</CardDescription>
          </CardHeader>
          <CardContent className="flex h-56 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <MessageSquare className="size-10" aria-hidden />
            <div>
              <div className="font-medium text-foreground">No activity yet</div>
              <div>Start by connecting your social accounts</div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
