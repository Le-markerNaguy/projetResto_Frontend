"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QuantitySelector } from "./quantity-selector"
import { ShoppingCart } from "lucide-react"
import type { Dish } from "@/types"

interface DishCardCompactProps {
  dish: Dish
  quantity: number
  onAddToCart: () => void
  onIncreaseQuantity: () => void
  onDecreaseQuantity: () => void
}

export function DishCardCompact({
  dish,
  quantity,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: DishCardCompactProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Informations du plat */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{dish.name}</h3>
            <p className="text-sm text-gray-500 mb-1">{dish.category}</p>
            <p className="text-xs text-gray-600 line-clamp-2 mb-3">{dish.description}</p>

            {/* Prix et bouton commander */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="font-bold">
                {dish.price} F CFA
              </Badge>
              <Button onClick={onAddToCart} size="sm" className="h-8">
                <ShoppingCart className="h-3 w-3 mr-1" />
                Commander
              </Button>
            </div>
          </div>
        </div>

        {/* Quantité dans le panier */}
        {quantity > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-green-700">
                Dans le panier: {(dish.price * quantity).toFixed(2)} F CFA
              </span>
              <QuantitySelector
                quantity={quantity}
                onIncrease={onIncreaseQuantity}
                onDecrease={onDecreaseQuantity}
                size="sm"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
