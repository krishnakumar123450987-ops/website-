import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function PostingQueuePage() {
  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Posting Queue</CardTitle>
          <CardDescription>Upcoming scheduled posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 gap-2 border-b px-3 py-2 text-sm text-muted-foreground">
              <div>Time</div>
              <div>Platform</div>
              <div>Content</div>
              <div>Status</div>
            </div>
            <div className="p-6 text-center text-muted-foreground">No posts scheduled</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
