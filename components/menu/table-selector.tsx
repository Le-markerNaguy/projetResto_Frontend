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
  const availableTables = tables.filter((table) => table.status === "available")

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
          {tables.map((table) => (
            <SelectItem key={table.id} value={table.id.toString()}>
              Table {table.numero}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
