"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { TableSelector } from "./table-selector"
import { OrderSummary } from "./order-summary"
import type { Table as TableType } from "@/types"

interface OrderTableExpandedProps {
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
}

export function OrderTableExpanded({
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
}: OrderTableExpandedProps) {
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const total = subtotal

  return (
    <div className="space-y-6">
      {/* En-tête de commande */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <ShoppingCart className="h-6 w-6 mr-3" />
            Commande en cours
            {itemsCount > 0 && (
              <Badge variant="secondary" className="ml-3">
                {itemsCount} article{itemsCount > 1 ? "s" : ""}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableSelector tables={tables} selectedTable={selectedTable} onTableChange={onTableChange} />
        </CardContent>
      </Card>

      {/* Tableau des articles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Articles commandés</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Aucun article dans la commande</p>
              <p className="text-sm">Ajoutez des plats pour commencer votre commande</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Plat</TableHead>
                    <TableHead className="font-semibold text-center w-32">Quantité</TableHead>
                    <TableHead className="font-semibold text-right w-24">Prix unitaire</TableHead>
                    <TableHead className="font-semibold text-right w-24">Total</TableHead>
                    <TableHead className="w-16 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item, index) => (
                    <TableRow key={item.dishId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <TableCell className="py-4">
                        <div>
                          <p className="font-medium text-base">{item.dish.name}</p>
                          <p className="text-sm text-gray-500">{item.dish.category}</p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.dish.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDecreaseQuantity(item.dishId)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onIncreaseQuantity(item.dish)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <span className="font-medium">{item.price.toFixed(2)} F CFA</span>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <span className="font-bold text-lg">{(item.price * item.quantity).toFixed(2)} F CFA</span>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveItem(item.dishId)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résumé et validation */}
      {cart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Résumé de la commande</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderSummary
              itemsCount={itemsCount}
              subtotal={subtotal}
              total={total}
              customerName={customerName}
              onCustomerNameChange={onCustomerNameChange}
            />

            <div className="mt-6">
              <Button onClick={onSubmitOrder} disabled={!selectedTable || loading} className="w-full h-12 text-lg">
                {loading ? "Commande en cours..." : `Valider la commande (${total.toFixed(2)} F CFA)`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
