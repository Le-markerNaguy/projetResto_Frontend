"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { OrderAlertProvider } from "@/contexts/order-alert-context"
import { AdminSettingsProvider, useAdminSettings } from "@/contexts/admin-settings-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { admin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !admin) {
      router.push("/login")
    }
  }, [admin, isLoading, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!admin) {
    return null
  }

  return (
    <AdminSettingsProvider>
      <OrderAlertProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </OrderAlertProvider>
    </AdminSettingsProvider>
  )
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { settings } = useAdminSettings()
  return (
    <div className={`min-h-screen ${settings.theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 md:ml-0">
          <div className="md:hidden h-12" /> {/* Espace pour le bouton menu mobile */}
          {children}
        </main>
      </div>
    </div>
  )
}
