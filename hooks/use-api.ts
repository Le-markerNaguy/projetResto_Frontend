"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

const API_BASE_URL = "https://express-projetresto.onrender.com/api"

export function useApi() {
  const { token } = useAuth()

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    // S'assure que endpoint commence par un seul /
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    const url = `${API_BASE_URL}${cleanEndpoint}`
    // Debug : log l'URL appelée
    // console.log("🌐 API CALL URL:", url)
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      // Ajoute le code HTTP et l'URL à l'erreur pour faciliter le debug
      throw new Error(`API Error: ${response.status} ${response.statusText} (${url})`)
    }

    return response.json()
  }

  return { apiCall }
}

// Hook pour la gestion des plats - Route: /api/plats
export function useDishes() {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const { apiCall } = useApi()

  const fetchDishes = async () => {
    try {
      setLoading(true)
      const data = await apiCall("/plats")
      // Mapping des champs backend -> frontend
      const mapped = data.map((dish: any) => ({
        id: dish.id.toString(),
        name: dish.nom,
        description: dish.description || "",
        price: dish.prix,
        category: dish.categorie,
        available: dish.disponible,
        image: dish.image || undefined,
      }))
      setDishes(mapped)
    } catch (error) {
      console.error("Error fetching dishes:", error)
    } finally {
      setLoading(false)
    }
  }

  const createDish = async (dish: any) => {
    const dataToSend = {
      nom: dish.name,
      description: dish.description,
      prix: dish.price,
      categorie: dish.category,
      disponible: dish.available,
      image: dish.image, // Ajout du champ image
    }
    const data = await apiCall("/plats", {
      method: "POST",
      body: JSON.stringify(dataToSend),
    })
    await fetchDishes()
    return data
  }

  const updateDish = async (id: string, dish: any) => {
    const dataToSend = {
      nom: dish.name,
      description: dish.description,
      prix: dish.price,
      categorie: dish.category,
      disponible: dish.available,
      image: dish.image, // Ajout du champ image
    }
    const data = await apiCall(`/plats/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dataToSend),
    })
    await fetchDishes()
    return data
  }

  const deleteDish = async (id: string) => {
    try {
      await apiCall(`/plats/${id}`, {
        method: "DELETE",
      })
      await fetchDishes()
    } catch (error: any) {
      if (error instanceof Error && error.message.startsWith("API Error:")) {
        throw error
      }
      throw new Error("Erreur lors de la suppression du plat.")
    }
  }

  useEffect(() => {
    fetchDishes()
  }, [])

  return {
    dishes,
    loading,
    fetchDishes,
    createDish,
    updateDish,
    deleteDish,
  }
}

// Hook pour la gestion des commandes - Route: /api/commandes
export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { apiCall } = useApi()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await apiCall("/commandes")
      // Mapping pour compatibilité frontend : statut -> status, prixtotal -> total
      const mapped = data.map((order: any) => ({
        ...order,
        status: order.statut || order.status,
        total: order.prixtotal || order.total,
        nomClient: order.nomClient || order.customerName, // Mapping du nom du client
      }))
      setOrders(mapped)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async (order: any) => {
    // Envoie l'objet order tel quel, sans transformation
    const response = await fetch(`${API_BASE_URL}/commandes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  const updateOrderStatus = async (id: string, status: string) => {
    // Envoie le champ tel qu'attendu par le backend
    const data = await apiCall(`/commandes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ statut: status }),
    })
    await fetchOrders()
    return data
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return {
    orders,
    loading,
    fetchOrders,
    createOrder,
    updateOrderStatus,
  }
}

// Hook pour la gestion des tables - Route: /api/tables
export function useTables() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const { apiCall } = useApi()

  const fetchTables = async () => {
    try {
      setLoading(true)
      // Appel API public pour récupérer les tables
      const data = await apiCall("/tables")
      // Mapping pour garantir que id et number sont des nombres
      const mapped = data.map((table: any) => ({
        ...table,
        id: Number(table.id),
        number: Number(table.number ?? table.numero),
      }))
      setTables(mapped)
    } catch (error) {
      console.error("Error fetching tables:", error)
    } finally {
      setLoading(false)
    }
  }

  const createTable = async (table: any) => {
    const dataToSend = {
      numero: Number(table.number),
      capacity: table.capacity,
    }
    const data = await apiCall("/tables", {
      method: "POST",
      body: JSON.stringify(dataToSend),
    })
    await fetchTables()
    return data
  }

  // Ajout suppression table
  const deleteTable = async (id: number | string) => {
    await apiCall(`/tables/${id}`, {
      method: "DELETE",
    })
    await fetchTables()
  }

  useEffect(() => {
    fetchTables()
  }, [])

  return {
    tables,
    loading,
    fetchTables,
    createTable,
    deleteTable,
  }
}

// Hook pour la gestion des admins - Route: /api/admin
export function useAdmins() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const { apiCall } = useApi()

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const data = await apiCall("/admin")
      setAdmins(data)
    } catch (error) {
      console.error("Error fetching admins:", error)
    } finally {
      setLoading(false)
    }
  }

  const createAdmin = async (admin: any) => {
    const dataToSend = {
      nom: admin.name,
      email: admin.email,
      motDePasse: admin.password,
    }
    const data = await apiCall("/admin", {
      method: "POST",
      body: JSON.stringify(dataToSend),
    })
    await fetchAdmins()
    return data
  }

  const deleteAdmin = async (id: string) => {
    await apiCall(`/admin/${id}`, {
      method: "DELETE",
    })
    await fetchAdmins()
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  return {
    admins,
    loading,
    fetchAdmins,
    createAdmin,
    deleteAdmin,
  }
}

// Hook pour le revenu de la semaine
export function useWeeklyRevenue() {
  const [revenue, setRevenue] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const { apiCall } = useApi()

  const fetchWeeklyRevenue = async () => {
    try {
      setLoading(true)
      const data = await apiCall("/commandes/revenue-week")
      setRevenue(data.revenue || 0)
    } catch (error) {
      setRevenue(0)
      console.error("Erreur lors de la récupération du revenu de la semaine:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeeklyRevenue()
  }, [])

  return { revenue, loading, fetchWeeklyRevenue }
}

// Hook pour le revenu journalier de la semaine
export function useDailyRevenue() {
  const [dailyRevenue, setDailyRevenue] = useState<{ day: string; revenue: number }[]>([])
  const [loading, setLoading] = useState(true)
  const { apiCall } = useApi()

  const fetchDailyRevenue = async () => {
    try {
      setLoading(true)
      const data = await apiCall("/commandes/revenue-daily")
      setDailyRevenue(data)
    } catch (error) {
      setDailyRevenue([])
      console.error("Erreur lors de la récupération du revenu journalier:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDailyRevenue()
  }, [])

  return { dailyRevenue, loading, fetchDailyRevenue }
}
