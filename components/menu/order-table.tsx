"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QuantitySelector } from "./quantity-selector"
import { ShoppingCart, Trash2 } from "lucide-react"
import { TableSelector } from "./table-selector"
import { OrderSummary } from "./order-summary"
import type { Table as TableType } from "@/types"

interface OrderTableProps {
  cart: any[]
  tables: TableType[]
  selectedTable: string
  customerName: string
  loading: boolean
  onTableChange: (tableId: string) => void
  onCustomerNameChange: (name: string) => void
  onIncreaseQuantity: (dish: any) => void
  onDecreaseQuantity: (dishId: string) => void
  onRemoveItem: (dishId: string) => void
  onSubmitOrder: () => void
  manualTableNumber: string
  setManualTableNumber: (val: string) => void
  qrTableDetected?: boolean // Ajouté pour désactiver la sélection manuelle
  disabled?: boolean // Ajouté pour supporter la prop disabled
}

export function OrderTable({
  cart,
  tables,
  selectedTable,
  customerName,
  loading,
  onTableChange,
  onCustomerNameChange,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onSubmitOrder,
  manualTableNumber,
  setManualTableNumber,
  qrTableDetected = false,
  disabled = false,
}: OrderTableProps) {
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.2 // TVA 20%
  const total = subtotal + tax

  return (
    <Card className="sticky top-24 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Commande en cours
          {itemsCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {itemsCount} article{itemsCount > 1 ? "s" : ""}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saisie manuelle du numéro de table */}
        <div className="mb-2">
          <label htmlFor="manual-table-number" className="block text-xs font-medium text-gray-700 mb-1">Numéro de table (saisie rapide)</label>
          <input
            id="manual-table-number"
            type="number"
            min="1"
            value={manualTableNumber}
            onChange={e => setManualTableNumber(e.target.value)}
            placeholder="Ex: 5"
            className="border rounded px-2 py-1 w-full text-sm"
            disabled={qrTableDetected || disabled}
          />
        </div>
        {/* Sélection table */}
        <TableSelector tables={tables} selectedTable={selectedTable} onTableChange={onTableChange} disabled={qrTableDetected || disabled} />

        {/* Tableau des articles */}
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun article dans la commande</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs font-medium">Plat</TableHead>
                  <TableHead className="text-xs font-medium text-center w-20">Qté</TableHead>
                  <TableHead className="text-xs font-medium text-right w-16">Prix</TableHead>
                  <TableHead className="text-xs font-medium text-right w-20">Total</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.dishId} className="hover:bg-gray-50">
                    <TableCell className="py-3">
                      <div>
                        <p className="font-medium text-sm truncate max-w-32">{item.dish.name}</p>
                        <p className="text-xs text-gray-500">{item.dish.category}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-3">
                      <QuantitySelector
                        quantity={item.quantity}
                        onIncrease={() => onIncreaseQuantity(item.dish)}
                        onDecrease={() => onDecreaseQuantity(item.dishId)}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <span className="text-sm">{item.price.toFixed(2)} F CFA</span>
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <span className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} F CFA</span>
                    </TableCell>
                    <TableCell className="py-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveItem(item.dishId)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Résumé et commande */}
        {cart.length > 0 && (
          <>
            <OrderSummary
              itemsCount={itemsCount}
              subtotal={subtotal}
              total={total}
              customerName={customerName}
              onCustomerNameChange={onCustomerNameChange}
            />

            <Button onClick={onSubmitOrder} disabled={(!selectedTable && !manualTableNumber) || loading || cart.length === 0} className="w-full">
              {loading ? "Commande en cours..." : `Valider la commande (${total.toFixed(2)} F CFA)`}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
