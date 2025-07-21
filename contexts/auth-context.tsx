"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Admin, AuthContextType } from "@/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token")
    const savedAdmin = localStorage.getItem("admin_data")

    if (savedToken && savedAdmin && savedAdmin !== "undefined") {
      setToken(savedToken)
      setAdmin(JSON.parse(savedAdmin))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const API_URL = "https://express-projetresto.onrender.com/api"
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, motDePasse: password }),
      })

      if (!response.ok) {
        throw new Error("Échec de la connexion")
      }

      const data = await response.json()

      setToken(data.token)
      setAdmin(data.admin)
      localStorage.setItem("admin_token", data.token)
      localStorage.setItem("admin_data", JSON.stringify(data.admin))
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setAdmin(null)
    setToken(null)
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_data")
  }

  return <AuthContext.Provider value={{ admin, token, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
