"use client"

import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"

interface AutoRefreshStatusProps {
  enabled: boolean
  lastRefreshTime?: Date
}

export function AutoRefreshStatus({ enabled, lastRefreshTime }: AutoRefreshStatusProps) {
  if (!enabled) return null

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
        Auto-refresh actif
      </Badge>
      {lastRefreshTime && (
        <span className="text-xs text-gray-500">
          Dernière mise à jour : {lastRefreshTime.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
} 