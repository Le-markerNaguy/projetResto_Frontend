"use client"

import { useOrders, useDishes, useDailyRevenue } from "@/hooks/use-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Clock } from "lucide-react"

export default function AnalyticsPage() {
  const { orders, loading: ordersLoading } = useOrders()
  const { dishes, loading: dishesLoading } = useDishes()
  const { dailyRevenue, loading: dailyRevenueLoading } = useDailyRevenue()

  if (ordersLoading || dishesLoading || dailyRevenueLoading) {
    return <LoadingSpinner />
  }

  // Calculs des statistiques
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
  const totalOrders = orders.length
  const completedOrders = orders.filter((order: any) => order.status === "served").length
  const pendingOrders = orders.filter((order: any) => order.status === "pending").length

  // Plats les plus populaires
  const dishPopularity = dishes
    .map((dish: any) => {
      const orderCount = orders.reduce((count: number, order: any) => {
        const dishOrders = order.items?.filter((item: any) => item.dishId === dish.id).length || 0
        return count + dishOrders
      }, 0)
      return { ...dish, orderCount }
    })
    .sort((a, b) => b.orderCount - a.orderCount)

  const stats = [
    {
      title: "Revenus totaux",
      value: `${totalRevenue.toFixed(2)} F CFA`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Commandes totales",
      value: totalOrders.toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Panier moyen",
      value: `${averageOrderValue.toFixed(2)} F CFA`,
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
    },
    {
      title: "Commandes en attente",
      value: pendingOrders.toString(),
      change: "0%",
      trend: "neutral",
      icon: Clock,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Analysez les performances de votre restaurant</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
                {stat.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500 mr-1" />}
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-gray-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenus par jour */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus de la semaine</CardTitle>
            <CardDescription>Évolution des revenus sur 7 jours</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyRevenueLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-4">
                {dailyRevenue.map((day) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <span className="font-medium">{day.day}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(day.revenue / Math.max(...dailyRevenue.map(d => d.revenue), 1)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{day.revenue} F CFA</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plats populaires */}
        <Card>
          <CardHeader>
            <CardTitle>Plats les plus populaires</CardTitle>
            <CardDescription>Classement par nombre de commandes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dishPopularity.slice(0, 5).map((dish, index) => (
                <div key={dish.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{dish.name}</p>
                      <p className="text-sm text-gray-500">{dish.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{dish.orderCount} commandes</Badge>
                    <p className="text-sm text-gray-500">{dish.price} F CFA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statut des commandes */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des commandes</CardTitle>
          <CardDescription>État actuel de toutes les commandes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["pending", "preparing", "ready", "served", "cancelled"].map((status) => {
              const count = orders.filter((order: any) => order.status === status).length
              const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0

              const statusLabels: { [key: string]: string } = {
                pending: "En attente",
                preparing: "En préparation",
                ready: "Prêt",
                served: "Servi",
                cancelled: "Annulé",
              }

              const statusColors: { [key: string]: string } = {
                pending: "bg-yellow-100 text-yellow-800",
                preparing: "bg-blue-100 text-blue-800",
                ready: "bg-green-100 text-green-800",
                served: "bg-gray-100 text-gray-800",
                cancelled: "bg-red-100 text-red-800",
              }

              return (
                <div key={status} className="text-center">
                  <div className="text-2xl font-bold">{count}</div>
                  <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
                  <div className="text-sm text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
