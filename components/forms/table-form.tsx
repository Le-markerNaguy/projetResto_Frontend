"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Table } from "@/types"

interface TableFormProps {
  onSubmit: (table: Omit<Table, "id" | "status">) => Promise<void>
  onCancel: () => void
}

export function TableForm({ onSubmit, onCancel }: TableFormProps) {
  const [formData, setFormData] = useState({
    number: 0
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="number">Numéro de table</Label>
        <Input
          id="number"
          type="number"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: Number.parseInt(e.target.value) })}
          required
        />
      </div>
      <div className="flex space-x-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
