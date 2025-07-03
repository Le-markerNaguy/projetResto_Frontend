"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, ShoppingCart } from "lucide-react"

interface MenuHeaderProps {
  cartItemsCount: number
  onCartClick?: () => void
}

export function MenuHeader({ cartItemsCount, onCartClick }: MenuHeaderProps) {
  const [logoClicks, setLogoClicks] = useState(0)
  const [showAdminButton, setShowAdminButton] = useState(false)
  const [adminButtonTimer, setAdminButtonTimer] = useState<NodeJS.Timeout | null>(null)

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      const newCount = prev + 1

      if (newCount >= 3) {
        // Afficher le bouton admin
        setShowAdminButton(true)

        // Nettoyer le timer précédent s'il existe
        if (adminButtonTimer) {
          clearTimeout(adminButtonTimer)
        }

        // Cacher le bouton après 2 minutes
        const timer = setTimeout(
          () => {
            setShowAdminButton(false)
            setLogoClicks(0)
          },
          2 * 60 * 1000,
        ) // 2 minutes

        setAdminButtonTimer(timer)

        return 0 // Reset le compteur
      }

      return newCount
    })

    // Reset le compteur après 3 secondes si pas assez de clics
    setTimeout(() => {
      setLogoClicks((prev) => (prev > 0 ? 0 : prev))
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (adminButtonTimer) {
        clearTimeout(adminButtonTimer)
      }
    }
  }, [adminButtonTimer])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={handleLogoClick}>
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">RestauOpti</h1>
              <p className="text-sm text-gray-500 hidden sm:block">Délicieux plats </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Bouton admin discret après 3 clics */}
            {showAdminButton && (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs opacity-50 hover:opacity-100 transition-opacity">
                  Admin ({Math.ceil((2 * 60 * 1000 - Date.now()) / 1000)}s)
                </Button>
              </Link>
            )}

            {/* Indicateur panier mobile */}
            <div className="md:hidden">
              {cartItemsCount > 0 && (
                <div className="relative cursor-pointer" onClick={onCartClick}>
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
