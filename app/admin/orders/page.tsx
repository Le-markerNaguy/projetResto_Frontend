"use client"

import { useOrders } from "@/hooks/use-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  served: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  pending: "En attente",
  preparing: "En préparation",
  ready: "Prêt",
  served: "Servi",
  cancelled: "Annulé",
}

export default function OrdersPage() {
  const { orders, loading, updateOrderStatus } = useOrders()

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
        <p className="text-gray-600">Suivez et gérez toutes les commandes</p>
      </div>

      <div className="grid gap-6">
        {orders.filter((order: any) => order.status !== "served" && order.status !== "cancelled").map((order: any) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    <span className="font-bold text-blue-700 mr-3">
                      Table {order.table?.numero || order.tableId}
                    </span>
                    Commande #{order.id.toString().slice(0, 8)}
                    <span className="ml-3 text-base font-semibold">
                      [Statut : {statusLabels[order.status as keyof typeof statusLabels] || order.status}]
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {order.customerName ? `Client : ${order.customerName} • ` : ""}{order.dateCommande ? new Date(order.dateCommande).toLocaleString() : "Date inconnue"}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                  </Badge>
                  <span className="text-lg font-bold">{order.prixtotal ? order.prixtotal.toFixed(2) : order.total} F CFA</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Articles commandés :</h4>
                  <div className="space-y-2">
                    {(order.plats || order.items)?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>
                          {item.quantite || item.quantity}x {item.plat?.nom || item.dish?.name || "Plat inconnu"}
                        </span>
                        <span>
                          {item.plat?.prix ? (item.plat.prix * (item.quantite || 1)).toFixed(2) : (item.price * (item.quantity || 1)).toFixed(2)} F CFA
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium">Changer le statut :</label>
                    <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                      <SelectTrigger className="w-40 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="preparing">En préparation</SelectItem>
                        <SelectItem value="ready">Prêt</SelectItem>
                        <SelectItem value="served">Servi</SelectItem>
                        <SelectItem value="cancelled">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-bold">{order.prixtotal ? order.prixtotal.toFixed(2) : order.total} F CFA</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
