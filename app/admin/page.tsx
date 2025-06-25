"use client"

import { useOrders, useDishes, useTables } from "@/hooks/use-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { UtensilsCrossed, ShoppingCart, Table, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const { orders, loading: ordersLoading } = useOrders()
  const { dishes, loading: dishesLoading } = useDishes()
  const { tables, loading: tablesLoading } = useTables()

  if (ordersLoading || dishesLoading || tablesLoading) {
    return <LoadingSpinner />
  }

  // Calcule le début de la semaine (lundi)
  const now = new Date()
  const day = now.getDay() || 7 // 1=lundi, 7=dimanche
  const monday = new Date(now)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(now.getDate() - day + 1)

  // Filtre les commandes de la semaine
  const ordersThisWeek = orders.filter((order: any) => {
    const date = new Date(order.dateCommande || order.createdAt)
    return date >= monday && date <= now
  })
  const weeklyRevenue = ordersThisWeek.reduce((sum: number, order: any) => sum + (order.total || 0), 0)

  const stats = [
    {
      title: "Commandes du jour",
      value: orders.length,
      icon: ShoppingCart,
      description: "Commandes en cours",
    },
    {
      title: "Plats disponibles",
      value: dishes.filter((dish: any) => dish.available).length,
      icon: UtensilsCrossed,
      description: "Plats au menu",
    },
    {
      title: "Tables",
      value: tables.length,
      icon: Table,
      description: "Tables configurées",
    },
    {
      title: "Revenus de la semaine",
      value: `${weeklyRevenue.toFixed(2)} F CFA`,
      icon: TrendingUp,
      description: "Cette semaine",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de votre restaurant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
            <CardDescription>Les dernières commandes passées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Commande #{order.id.toString().slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      Table {order.tableId} • {order.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total} F CFA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plats populaires</CardTitle>
            <CardDescription>Les plats les plus commandés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dishes.slice(0, 5).map((dish: any) => (
                <div key={dish.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{dish.name}</p>
                    <p className="text-sm text-gray-500">{dish.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{dish.price} F CFA</p>
                    <p className={`text-sm ${dish.available ? "text-green-600" : "text-red-600"}`}>
                      {dish.available ? "Disponible" : "Indisponible"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
