"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Table } from "@/types"

interface TableSelectorProps {
  tables: any[] // Correction du typage pour éviter l'erreur
  selectedTable: string
  onTableChange: (tableId: string) => void
  disabled?: boolean // Ajout pour désactiver la sélection
}

export function TableSelector({ tables, selectedTable, onTableChange, disabled = false }: TableSelectorProps) {
  // Afficher toutes les tables sans filtrage pour l'instant
  const availableTables = tables || []

  return (
    <div>
      <Label htmlFor="table" className="text-sm font-medium">
        Choisir une table
      </Label>
      <Select value={selectedTable} onValueChange={onTableChange} disabled={disabled}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Sélectionner une table" />
        </SelectTrigger>
        <SelectContent>
          {availableTables.length > 0 ? (
            availableTables.map((table) => (
              <SelectItem key={table.id} value={table.id.toString()}>
                Table {table.numero || table.number}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="" disabled>
              Aucune table disponible
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
