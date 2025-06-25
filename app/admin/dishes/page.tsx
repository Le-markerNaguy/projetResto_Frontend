"use client"

import { useState } from "react"
import { useDishes } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { DishForm } from "@/components/forms/dish-form"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Dish } from "@/types"

export default function DishesPage() {
  const { dishes, loading, createDish, updateDish, deleteDish } = useDishes()
  const [showForm, setShowForm] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)

  const handleSubmit = async (dishData: Omit<Dish, "id">) => {
    if (editingDish) {
      await updateDish(editingDish.id, dishData)
    } else {
      await createDish(dishData)
    }
    setShowForm(false)
    setEditingDish(null)
  }

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce plat ?")) {
      try {
        await deleteDish(id)
      } catch (error: any) {
        alert(error.message || "Erreur lors de la suppression du plat.")
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestion des Plats</h1>
          <p className="text-gray-600">Gérez votre menu et vos plats</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau plat
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingDish ? "Modifier le plat" : "Nouveau plat"}</CardTitle>
          </CardHeader>
          <CardContent>
            <DishForm
              dish={editingDish || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingDish(null)
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {dishes.map((dish: any) => (
          <Card key={dish.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base md:text-lg truncate">{dish.name}</CardTitle>
                  <CardDescription className="text-sm">{dish.category}</CardDescription>
                </div>
                <Badge variant={dish.available ? "default" : "secondary"} className="shrink-0">
                  {dish.available ? "Dispo" : "Indispo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{dish.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">{dish.price} F CFA</span>
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(dish)}>
                    <Edit className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(dish.id)}>
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
