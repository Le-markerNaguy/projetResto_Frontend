"use client"

import { useEffect, useState } from "react"
import { useOrders } from "@/hooks/use-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { io } from "socket.io-client"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { AutoRefreshNotification } from "@/components/ui/auto-refresh-notification"
import { AutoRefreshStatus } from "@/components/ui/auto-refresh-status"
import { CustomerNameBadge } from "@/components/ui/customer-name-badge"

const notificationSoundUrl = "/audio/MÉLODIE K - XYLOPHONE COURT (HOROFRANCE)  SONNERIE ÉCOLECOLLÈGELYCÉEEREACFA.mp3"; // Place ce fichier dans public/audio/
const socket = io("https://express-projetresto.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true
});

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

function groupOrdersByDay(orders: any[]) {
  return orders.reduce((acc: Record<string, any[]>, order: any) => {
    const date = order.dateCommande ? new Date(order.dateCommande).toLocaleDateString() : "Date inconnue";
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {});
}

export default function OrdersPage() {
  const { orders, loading, updateOrderStatus, fetchOrders } = useOrders()
  const [highlightedOrders, setHighlightedOrders] = useState<string[]>([]);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | undefined>()

  // Quand la page commandes est vue, reset le badge
  useEffect(() => {
    window.dispatchEvent(new Event("orders:seen"))
  }, [])

  // Fonction de rafraîchissement des commandes
  const refreshOrders = async () => {
    await fetchOrders()
    setLastRefreshTime(new Date())
  }

  // Hook de rafraîchissement automatique
  const { restartInterval, stopInterval, isActive } = useAutoRefresh({
    interval: 120000, // 2 minutes
    enabled: autoRefreshEnabled,
    onRefresh: refreshOrders
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

  useEffect(() => {
    socket.on("new-order", (order) => {
      if (order?.token) {
        setHighlightedOrders((prev) => [...prev, order.token]);
        setTimeout(() => {
          setHighlightedOrders((prev) => prev.filter(t => t !== order.token));
        }, 10000);
      }
    });
    return () => {
      socket.off("new-order");
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  // Grouper les commandes par jour
  const grouped = groupOrdersByDay(orders.filter((order: any) => order.status !== "served" && order.status !== "cancelled"));
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-6">
      <AutoRefreshNotification enabled={autoRefreshEnabled} lastRefreshTime={lastRefreshTime} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600">
            Suivez et gérez toutes les commandes • 
            <span className="font-semibold text-blue-600 ml-1">
              {orders.filter((order: any) => order.status !== "served" && order.status !== "cancelled").length} commandes actives
            </span>
          </p>
          <AutoRefreshStatus enabled={autoRefreshEnabled} lastRefreshTime={lastRefreshTime} />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshOrders}
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

      <div className="grid gap-6">
        {sortedDates.map(date => (
          <div key={date}>
            <h2 className="text-xl font-semibold mb-2 mt-4">Commandes du {date}</h2>
            {grouped[date].map((order: any) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        <span className="font-bold text-blue-700 mr-3">
                          Table {order.table?.numero || order.tableId}
                        </span>
                        <span className="text-gray-700">Commande n°{order.numeroDuJour || order.id}</span>
                        {/* Icône temporaire de signalement */}
                        {highlightedOrders.includes(order.token) && (
                          <span className="ml-2 text-yellow-500 animate-bounce" title="Nouvelle commande">
                            🔔
                          </span>
                        )}
                        <span className="ml-3 text-base font-semibold">
                          [Statut : {statusLabels[order.status as keyof typeof statusLabels] || order.status}]
                        </span>
                      </CardTitle>
                      <CardDescription>
                        {order.nomClient ? `Client : ${order.nomClient} • ` : ""}{order.dateCommande ? new Date(order.dateCommande).toLocaleString() : "Date inconnue"}
                        {autoRefreshEnabled && (
                          <span className="ml-1 text-green-600">• Auto-refresh actif</span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CustomerNameBadge nomClient={order.nomClient} />
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
        ))}
      </div>
    </div>
  )
}
