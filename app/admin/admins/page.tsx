"use client"

import { useState } from "react"
import { useAdmins } from "@/hooks/use-api"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AdminForm } from "@/components/forms/admin-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, User, Mail, Calendar } from "lucide-react"
import type { Admin } from "@/types"

function getInitials(name: string) {
  if (!name) return "?"
  const parts = name.trim().split(" ")
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function AdminsPage() {
  const { admins, loading, createAdmin, deleteAdmin } = useAdmins()
  const { admin: currentAdmin } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (adminData: Omit<Admin, "id" | "createdAt">) => {
    try {
      setError("")
      await createAdmin(adminData)
      setShowForm(false)
    } catch (err) {
      setError("Erreur lors de la création de l'admin")
    }
  }

  const handleDelete = async (id: string) => {
    if (currentAdmin?.id === id) {
      alert("Vous ne pouvez pas supprimer votre propre compte")
      return
    }

    if (confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
      try {
        await deleteAdmin(id)
      } catch (err) {
        alert("Erreur lors de la suppression")
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-2 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Administrateurs</h1>
            <p className="text-gray-600">Gérez les comptes administrateurs du système</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md px-6 py-2 rounded-lg sticky top-4 z-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel admin
          </Button>
        </div>

        {showForm && (
          <div className="animate-fade-in">
            <Card className="max-w-lg mx-auto shadow-lg border-blue-200 border-2">
              <CardHeader>
                <CardTitle>Nouvel administrateur</CardTitle>
                <CardDescription>Créer un nouveau compte administrateur</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <AdminForm
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false)
                    setError("")
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="rounded-xl bg-white/80 shadow-xl p-6 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.map((admin: any) => (
              <Card
                key={admin.id}
                className={`transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl border-2 ${currentAdmin?.id === admin.id ? "border-blue-500" : "border-gray-200"}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-md select-none ${currentAdmin?.id === admin.id ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"}`}
                        aria-label={`Avatar de ${admin.name}`}
                      >
                        {getInitials(admin.name)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{admin.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {admin.email}
                        </CardDescription>
                      </div>
                    </div>
                    {currentAdmin?.id === admin.id && (
                      <Badge variant="default" className="bg-blue-500 text-white">Vous</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Créé le {new Date(admin.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(admin.id)}
                        disabled={currentAdmin?.id === admin.id}
                        className="text-red-600 hover:text-red-700 border-red-200"
                        aria-label="Supprimer l'administrateur"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {admins.length === 0 && (
            <Card className="mt-8">
              <CardContent className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun administrateur trouvé</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
