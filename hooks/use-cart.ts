"use client"

import { useState } from "react"
import type { Dish } from "@/types"

export interface CartItem {
  dishId: string
  dish: Dish
  quantity: number
  price: number
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (dish: Dish) => {
    const existingItem = cart.find((item) => item.dishId === dish.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.dishId === dish.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([
        ...cart,
        {
          dishId: dish.id,
          dish: dish,
          quantity: 1,
          price: dish.price,
        },
      ])
    }
  }

  const removeFromCart = (dishId: string) => {
    const existingItem = cart.find((item) => item.dishId === dishId)
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map((item) => (item.dishId === dishId ? { ...item, quantity: item.quantity - 1 } : item)))
    } else {
      setCart(cart.filter((item) => item.dishId !== dishId))
    }
  }

  const removeItemCompletely = (dishId: string) => {
    setCart(cart.filter((item) => item.dishId !== dishId))
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getItemsCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    removeItemCompletely,
    clearCart,
    getTotalPrice,
    getItemsCount,
  }
}
