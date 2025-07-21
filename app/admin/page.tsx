"use client"

import { useOrders, useDishes, useTables } from "@/hooks/use-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { UtensilsCrossed, ShoppingCart, Table, TrendingUp, RefreshCw } from "lucide-react"
import { useOrderRealtime } from "./_realtime"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { AutoRefreshNotification } from "@/components/ui/auto-refresh-notification"
import { CustomerNameBadge } from "@/components/ui/customer-name-badge"

export default function AdminDashboard() {
  const { orders, loading: ordersLoading, fetchOrders } = useOrders()
  const { dishes, loading: dishesLoading, fetchDishes } = useDishes()
  const { tables, loading: tablesLoading, fetchTables } = useTables()
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | undefined>()

  useOrderRealtime(fetchOrders)

  // Fonction de rafraîchissement de toutes les données
  const refreshAllData = async () => {
    await Promise.all([
      fetchOrders(),
      fetchDishes(),
      fetchTables()
    ])
    setLastRefreshTime(new Date())
  }

  // Hook de rafraîchissement automatique
  const { restartInterval, stopInterval, isActive } = useAutoRefresh({
    interval: 120000, // 2 minutes
    enabled: autoRefreshEnabled,
    onRefresh: refreshAllData
  })

  // Écouter les événements de rafraîchissement automatique
  useEffect(() => {
    const handleAutoRefresh = (event: CustomEvent) => {
      setLastRefreshTime(event.detail.timestamp)
    }

    window.addEventListener('autoRefresh', handleAutoRefresh as EventListener)
    return () => {
      window.removeEventListener('autoRefresh', handleAutoRefresh as EventListener)
    }
  }, [])

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
      <AutoRefreshNotification enabled={autoRefreshEnabled} lastRefreshTime={lastRefreshTime} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de votre restaurant</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAllData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Rafraîchir
          </Button>
          <Button
            variant={autoRefreshEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setAutoRefreshEnabled(!autoRefreshEnabled)
              if (autoRefreshEnabled) {
                stopInterval()
              } else {
                restartInterval()
              }
            }}
            className="flex items-center gap-2"
          >
            <div className={`w-2 h-2 rounded-full ${autoRefreshEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
            Auto-refresh
          </Button>
        </div>
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
              <p className="text-xs text-muted-foreground">
                {stat.description}
                {autoRefreshEnabled && (
                  <span className="ml-1 text-green-600">• Auto-refresh actif</span>
                )}
              </p>
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
                      {order.nomClient && (
                        <span className="ml-2 text-blue-600">• {order.nomClient}</span>
                      )}
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
