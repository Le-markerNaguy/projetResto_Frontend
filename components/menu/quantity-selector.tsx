"use client"

import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"

interface QuantitySelectorProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  size?: "sm" | "md"
}

export function QuantitySelector({ quantity, onIncrease, onDecrease, size = "md" }: QuantitySelectorProps) {
  const buttonSize = size === "sm" ? "sm" : "sm"
  const buttonClass = size === "sm" ? "h-6 w-6 p-0" : "h-8 w-8 p-0"
  const textClass = size === "sm" ? "w-6 text-center text-sm" : "w-8 text-center"

  return (
    <div className="flex items-center space-x-1">
      <Button
        size={buttonSize}
        variant="outline"
        onClick={onDecrease}
        disabled={quantity === 0}
        className={buttonClass}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className={textClass}>{quantity}</span>
      <Button size={buttonSize} variant="outline" onClick={onIncrease} className={buttonClass}>
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
