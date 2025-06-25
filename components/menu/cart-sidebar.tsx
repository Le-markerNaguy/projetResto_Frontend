"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { TableSelector } from "./table-selector"
import { CartItem } from "./cart-item"
import { OrderSummary } from "./order-summary"
import type { Table } from "@/types"

interface CartSidebarProps {
  cart: any[]
  tables: Table[]
  selectedTable: string
  customerName: string
  loading: boolean
  onTableChange: (tableId: string) => void
  onCustomerNameChange: (name: string) => void
  onIncreaseQuantity: (dish: any) => void
  onDecreaseQuantity: (dishId: string) => void
  onSubmitOrder: () => void
}

export function CartSidebar({
  cart,
  tables,
  selectedTable,
  customerName,
  loading,
  onTableChange,
  onCustomerNameChange,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onSubmitOrder,
}: CartSidebarProps) {
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.2 // TVA 20%
  const total = subtotal + tax

  return (
    <Card className="sticky top-24 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Votre commande
          {itemsCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {itemsCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Sélection table */}
        <TableSelector tables={tables} selectedTable={selectedTable} onTableChange={onTableChange} />

        {/* Articles du panier */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Votre panier est vide</p>
            </div>
          ) : (
            <table className="w-full text-sm border rounded overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Plat</th>
                  <th className="p-2 text-right">Prix unitaire</th>
                  <th className="p-2 text-center">Quantité</th>
                  <th className="p-2 text-right">Total</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.dishId} className="border-b">
                    <td className="p-2 font-medium truncate max-w-[120px]">{item.dish.name}</td>
                    <td className="p-2 text-right">{item.price.toFixed(2)} F CFA</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">{(item.price * item.quantity).toFixed(2)} F CFA</td>
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onDecreaseQuantity(item.dishId)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                        <button onClick={() => onIncreaseQuantity(item.dish)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Résumé et commande */}
        {cart.length > 0 && (
          <>
            <OrderSummary
              itemsCount={itemsCount}
              subtotal={subtotal}
              tax={tax}
              total={total}
              customerName={customerName}
              onCustomerNameChange={onCustomerNameChange}
            />

            <Button onClick={onSubmitOrder} disabled={!selectedTable || loading} className="w-full">
              {loading ? "Commande en cours..." : `Commander (${total.toFixed(2)}€)`}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
