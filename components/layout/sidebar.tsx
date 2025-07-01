"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  Table,
  TrendingUp,
  User,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react"
import { useAdminSettings } from "@/contexts/admin-settings-context"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Plats", href: "/admin/dishes", icon: UtensilsCrossed },
  { name: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { name: "Tables", href: "/admin/tables", icon: Table },
  { name: "Admins", href: "/admin/admins", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { name: "Profil", href: "/admin/profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { settings, updateSettings } = useAdminSettings()

  return (
    <>
      {/* Bouton menu mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col bg-gray-50 border-r transition-transform duration-300 ease-in-out z-40",
          "md:relative md:translate-x-0 md:w-64",
          "fixed inset-y-0 left-0 w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <item.icon
                    className={cn("mr-3 flex-shrink-0 h-5 w-5", isActive ? "text-blue-500" : "text-gray-400")}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          {/* Paramètres rapides admin */}
          <div className="mt-8 px-2 space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Thème</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Changer le thème"
                onClick={() => updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" })}
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {settings.theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
            <div>
              <label htmlFor="notif-volume" className="block text-xs text-gray-500 mb-1">Volume notifications</label>
              <input
                id="notif-volume"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={settings.notificationVolume}
                onChange={e => updateSettings({ notificationVolume: Number(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
