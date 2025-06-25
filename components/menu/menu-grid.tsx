"use client"

import { DishCard } from "./dish-card"
import { UtensilsCrossed } from "lucide-react"
import type { Dish } from "@/types"

interface MenuGridProps {
  dishes: Dish[]
  cart: any[]
  onAddToCart: (dish: Dish) => void
  onIncreaseQuantity: (dish: Dish) => void
  onDecreaseQuantity: (dishId: string) => void
}

export function MenuGrid({ dishes, cart, onAddToCart, onIncreaseQuantity, onDecreaseQuantity }: MenuGridProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {dishes.map((dish) => {
        const quantity = getQuantityInCart(dish.id)
        return (
          <DishCard
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
