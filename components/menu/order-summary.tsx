"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OrderSummaryProps {
  itemsCount: number
  subtotal: number
  tax: number
  total: number
  customerName: string
  onCustomerNameChange: (name: string) => void
}

export function OrderSummary({
  itemsCount,
  subtotal,
  total,
  customerName,
  onCustomerNameChange,
}: Omit<OrderSummaryProps, "tax">) {
  return (
    <div className="border-t pt-4 space-y-4">
      {/* Nom client */}
      <div>
        <Label htmlFor="customerName" className="text-sm font-medium">
          Nom (optionnel)
        </Label>
        <Input
          id="customerName"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
          placeholder="Votre nom"
          className="mt-1"
        />
      </div>

      {/* Résumé de la commande */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Sous-total ({itemsCount} articles)</span>
          <span>{subtotal.toFixed(2)} F CFA</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>{total.toFixed(2)} F CFA</span>
        </div>
      </div>
    </div>
  )
}
