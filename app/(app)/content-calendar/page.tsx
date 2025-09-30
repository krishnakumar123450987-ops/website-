import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ContentCalendarPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Content Calendar</CardTitle>
          <CardDescription>Plan your content schedule. Static placeholder grid.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-7">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="h-24 rounded-md border bg-secondary/50" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
