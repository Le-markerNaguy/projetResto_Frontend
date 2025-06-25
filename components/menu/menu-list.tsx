"use client"

import { DishCardCompact } from "./dish-card-compact"
import { UtensilsCrossed } from "lucide-react"
import type { Dish } from "@/types"

interface MenuListProps {
  dishes: Dish[]
  cart: any[]
  onAddToCart: (dish: Dish) => void
  onIncreaseQuantity: (dish: Dish) => void
  onDecreaseQuantity: (dishId: string) => void
}

export function MenuList({ dishes, cart, onAddToCart, onIncreaseQuantity, onDecreaseQuantity }: MenuListProps) {
  const getQuantityInCart = (dishId: string) => {
    const item = cart.find((item) => item.dishId === dishId)
    return item ? item.quantity : 0
  }

  if (dishes.length === 0) {
    return (
      <div className="text-center py-12">
        <UtensilsCrossed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Aucun plat disponible dans cette catégorie</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {dishes.map((dish) => {
        const quantity = getQuantityInCart(dish.id)
        return (
          <DishCardCompact
            key={dish.id}
            dish={dish}
            quantity={quantity}
            onAddToCart={() => onAddToCart(dish)}
            onIncreaseQuantity={() => onIncreaseQuantity(dish)}
            onDecreaseQuantity={() => onDecreaseQuantity(dish.id)}
          />
        )
      })}
    </div>
  )
}
