"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User, Bell, Moon, Sun } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useOrderRealtime } from "@/app/admin/_realtime"
import { useOrderAlert } from "@/contexts/order-alert-context"
import { useAdminSettings } from "@/contexts/admin-settings-context"

export function Navbar() {
  const { admin, logout } = useAuth()
  const { settings, updateSettings } = useAdminSettings();
  const [newOrderCount, setNewOrderCount] = useState(0)
  const lastOrderId = useRef<number | null>(null)
  const { hasNewOrder, setHasNewOrder } = useOrderAlert()

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
    const resetBadge = () => {
      setNewOrderCount(0)
      setHasNewOrder(false)
    }
    window.addEventListener("orders:seen", resetBadge)
    return () => window.removeEventListener("orders:seen", resetBadge)
  }, [setHasNewOrder])

  return (
    <nav className={`bg-white dark:bg-gray-950 shadow-sm border-b transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              Restaurant Admin
              {/* Icône notification forte */}
              {hasNewOrder && (
                <span className="ml-2 relative">
                  <Bell className="h-6 w-6 text-red-600 animate-pulse drop-shadow-lg" aria-label="Nouvelle commande" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                </span>
              )}
              {/* Badge numérique classique (optionnel) */}
              {newOrderCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-bounce">
                  {newOrderCount}
                </span>
              )}
            </h1>
          </div>
          {admin && (
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Switch thème */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Changer le thème"
                onClick={() => updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" })}
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {settings.theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <div className="hidden sm:flex items-center space-x-2">
                <User className="h-4 w-4 md:h-5 md:w-5 text-gray-500 dark:text-gray-300" />
                <span className="text-sm text-gray-700 dark:text-gray-200 truncate max-w-32">{admin.name}</span>
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
