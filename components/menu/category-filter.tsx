"use client"

import { Button } from "@/components/ui/button"
import { remove as removeDiacritics } from "diacritics"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const DEFAULT_CATEGORIES = ["Entrée", "Plat", "Dessert"]

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  // Normalisation et tri des catégories
  const normalize = (cat: string) => removeDiacritics(cat.trim().toLowerCase())
  const uniqueCategories = Array.from(
    new Set([
      ...DEFAULT_CATEGORIES.map(normalize),
      ...categories.filter((cat) => cat && cat.trim() !== "").map(normalize)
    ])
  )
  // Remettre la casse et l'ordre logique
  const orderedCategories = [
    "all",
    ...DEFAULT_CATEGORIES,
    ...uniqueCategories.filter(
      (cat) => !DEFAULT_CATEGORIES.map(normalize).includes(cat)
    ).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))
      .sort()
  ]

  const getCategoryLabel = (category: string) => {
    if (category === "all") return "Tous"
    return category
  }

  return (
    <div className="flex flex-wrap gap-2">
      {orderedCategories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className="capitalize"
        >
          {getCategoryLabel(category)}
        </Button>
      ))}
    </div>
  )
}
