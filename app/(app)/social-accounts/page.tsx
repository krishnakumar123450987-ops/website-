import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Twitter, Instagram, Facebook, Linkedin } from "lucide-react"

export default function SocialAccountsPage() {
  const services = [
    { name: "Twitter/X", icon: Twitter },
    { name: "Instagram", icon: Instagram },
    { name: "Facebook", icon: Facebook },
    { name: "LinkedIn", icon: Linkedin },
  ]
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map(({ name, icon: Icon }) => (
        <Card key={name} className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              <CardDescription>Not connected</CardDescription>
            </div>
            <Icon className="size-5 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">
              Connect
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
