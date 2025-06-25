import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction, Clock } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Construction className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Maintenance en cours</CardTitle>
          <CardDescription>
            Notre site est temporairement indisponible pour maintenance. Nous serons de retour très bientôt !
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Temps estimé : 30 minutes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
