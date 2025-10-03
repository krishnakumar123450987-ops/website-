import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function AIAssistantPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Compose with AI</CardTitle>
          <CardDescription>Draft captions and posts quickly. This is a static UI stub.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe your post idea</Label>
            <Textarea id="prompt" placeholder="Announce our new feature..." />
          </div>
          <div className="flex items-center gap-2">
            <Button>Generate draft</Button>
            <Button variant="secondary">Refine tone</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
