"use client"

import { QuantitySelector } from "./quantity-selector"

interface CartItemProps {
  item: {
    dishId: string
    dish: {
      name: string
      price: number
    }
    quantity: number
    price: number
  }
  onIncrease: () => void
  onDecrease: () => void
}

export function CartItem({ item, onIncrease, onDecrease }: CartItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.dish.name}</p>
        <p className="text-xs text-gray-500">
          {item.price} F CFA × {item.quantity} = {(item.price * item.quantity).toFixed(2)} F CFA
        </p>
      </div>
      <div className="ml-3">
        <QuantitySelector quantity={item.quantity} onIncrease={onIncrease} onDecrease={onDecrease} size="sm" />
      </div>
    </div>
  )
}
