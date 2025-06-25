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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Administrateurs</h1>
          <p className="text-gray-600">Gérez les comptes administrateurs du système</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel admin
        </Button>
      </div>

      {showForm && (
        <Card>
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin: any) => (
          <Card key={admin.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{admin.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {admin.email}
                    </CardDescription>
                  </div>
                </div>
                {currentAdmin?.id === admin.id && <Badge variant="default">Vous</Badge>}
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
                    className="text-red-600 hover:text-red-700"
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
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun administrateur trouvé</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
