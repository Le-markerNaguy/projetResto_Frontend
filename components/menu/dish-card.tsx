"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QuantitySelector } from "./quantity-selector"
import { ShoppingCart } from "lucide-react"
import type { Dish } from "@/types"

interface DishCardProps {
  dish: Dish
  quantity: number
  onAddToCart: () => void
  onIncreaseQuantity: () => void
  onDecreaseQuantity: () => void
}

export function DishCard({ dish, quantity, onAddToCart, onIncreaseQuantity, onDecreaseQuantity }: DishCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight truncate">{dish.name}</CardTitle>
            <CardDescription className="text-sm mt-1">{dish.category}</CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2 font-bold shrink-0">
            {dish.price} F CFA
          </Badge>
        </div>
      </CardHeader>

      {/* Affichage de l'image du plat si présente */}
      {dish.image && (
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-40 object-cover rounded-t"
          style={{ objectFit: 'cover' }}
        />
      )}

      <CardContent className="pt-0 flex-1 flex flex-col">
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{dish.description}</p>

        <div className="space-y-3">
          {/* Bouton Commander toujours visible */}
          <Button onClick={onAddToCart} className="w-full" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Commander
          </Button>

          {/* Affichage de la quantité et contrôles si le plat est dans le panier */}
          {quantity > 0 && (
            <div className="space-y-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">Dans le panier:</span>
                <QuantitySelector
                  quantity={quantity}
                  onIncrease={onIncreaseQuantity}
                  onDecrease={onDecreaseQuantity}
                  size="sm"
                />
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-green-700">Total: {(dish.price * quantity).toFixed(2)} F CFA</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
