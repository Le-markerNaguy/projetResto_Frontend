"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"

interface AutoRefreshNotificationProps {
  enabled: boolean
  lastRefreshTime?: Date
}

export function AutoRefreshNotification({ enabled, lastRefreshTime }: AutoRefreshNotificationProps) {
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    if (enabled && lastRefreshTime) {
      setShowNotification(true)
      toast.success("🔄 Données mises à jour automatiquement", {
        description: `Dernière mise à jour : ${lastRefreshTime.toLocaleTimeString()}`,
        duration: 3000,
        icon: <RefreshCw className="h-4 w-4" />,
      })
      
      // Masquer la notification après 3 secondes
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [enabled, lastRefreshTime])

  return null
} 