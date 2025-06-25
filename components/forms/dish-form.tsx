"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Dish } from "@/types"

interface DishFormProps {
  dish?: Dish
  onSubmit: (dish: Omit<Dish, "id">) => Promise<void>
  onCancel: () => void
}

const DEFAULT_CATEGORIES = ["Entrée", "Plat", "Dessert"]

export function DishForm({ dish, onSubmit, onCancel }: DishFormProps) {
  const [formData, setFormData] = useState({
    name: dish?.name || "",
    description: dish?.description || "",
    price: dish?.price || 0,
    category: dish?.category || "",
    available: dish?.available ?? true,
    image: dish?.image || "",
  })
  const [loading, setLoading] = useState(false)
  const [customCategory, setCustomCategory] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const finalCategory = formData.category === "custom" ? customCategory : formData.category
      await onSubmit({ ...formData, category: finalCategory })
    } finally {
      setLoading(false)
    }
  }

  // Ajout gestion upload image locale
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom du plat</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="price">Prix (F CFA)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {DEFAULT_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
            <SelectItem value="custom">Autre (personnalisée)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.category === "custom" && (
        <div>
          <Label htmlFor="customCategory">Catégorie personnalisée</Label>
          <Input
            id="customCategory"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Nom de la catégorie"
            required
          />
        </div>
      )}

      <div>
        <Label htmlFor="image">Image du plat</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        {/* Affichage de l'image sélectionnée ou de l'URL */}
        {(formData.image && (formData.image.startsWith('data:') || formData.image.startsWith('http'))) && (
          <img src={formData.image} alt="Aperçu du plat" className="mt-2 w-32 h-32 object-cover rounded" />
        )}
        <Input
          id="image-url"
          placeholder="Ou collez une URL d'image"
          value={formData.image.startsWith('data:') ? '' : formData.image}
          onChange={e => setFormData({ ...formData, image: e.target.value })}
          className="mt-2"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="available"
          checked={formData.available}
          onCheckedChange={(checked) => setFormData({ ...formData, available: !!checked })}
        />
        <Label htmlFor="available">Disponible</Label>
      </div>

      <div className="flex space-x-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : dish ? "Modifier" : "Créer"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
