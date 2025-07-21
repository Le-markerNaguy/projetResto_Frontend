"use client"

import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

interface CustomerNameBadgeProps {
  nomClient?: string | null
  className?: string
}

export function CustomerNameBadge({ nomClient, className = "" }: CustomerNameBadgeProps) {
  if (!nomClient) return null

  return (
    <Badge variant="outline" className={`bg-blue-50 text-blue-700 border-blue-200 ${className}`}>
      <User className="h-3 w-3 mr-1" />
      {nomClient}
    </Badge>
  )
} 