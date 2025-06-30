"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useOrderRealtime } from "@/app/admin/_realtime"

export function Navbar() {
  const { admin, logout } = useAuth()
  const [newOrderCount, setNewOrderCount] = useState(0)
  const lastOrderId = useRef<number | null>(null)

  // Hook temps réel pour badge
  useOrderRealtime(() => {
    setNewOrderCount((c) => c + 1)
  }, {
    onNewOrder: (order) => {
      // Mémorise le dernier id pour éviter les doublons si besoin
      lastOrderId.current = order.id
    }
  })

  // Remise à zéro du badge quand l'admin va sur la page commandes
  useEffect(() => {
    const resetBadge = () => setNewOrderCount(0)
    window.addEventListener("orders:seen", resetBadge)
    return () => window.removeEventListener("orders:seen", resetBadge)
  }, [])

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
              Restaurant Admin
              {newOrderCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-bounce">
                  {newOrderCount}
                </span>
              )}
            </h1>
          </div>

          {admin && (
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <User className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                <span className="text-sm text-gray-700 truncate max-w-32">{admin.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-1 md:space-x-2">
                <LogOut className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
