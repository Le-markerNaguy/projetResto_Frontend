"use client"

import { useState } from "react"
import { useTables } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { TableForm } from "@/components/forms/table-form"
import { Plus, Users, Trash2, Download } from "lucide-react"

const statusColors = {
  available: "bg-green-100 text-green-800",
  occupied: "bg-red-100 text-red-800",
  reserved: "bg-yellow-100 text-yellow-800",
}

const statusLabels = {
  available: "Disponible",
  occupied: "Occupée",
  reserved: "Réservée",
}

export default function TablesPage() {
  const { tables, loading, createTable, deleteTable } = useTables()
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | number | null>(null)

  const handleSubmit = async (tableData: any) => {
    await createTable(tableData)
    setShowForm(false)
  }

  const handleDelete = async (id: string | number) => {
    if (confirm("Voulez-vous vraiment supprimer cette table ?")) {
      setDeletingId(id)
      await deleteTable(id)
      setDeletingId(null)
    }
  }

  const handleDownloadQR = (table: any) => {
    // On suppose que table.qrCodeImage contient une image base64
    const qr = table.qrCodeImage
    if (!qr) return
    const link = document.createElement('a')
    link.href = qr
    link.download = `table-${table.number}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Tables</h1>
          <p className="text-gray-600">Gérez les tables de votre restaurant</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle table
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle table</CardTitle>
          </CardHeader>
          <CardContent>
            <TableForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table: any) => (
          <Card key={table.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Table {table.number}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {table.capacity} personnes
                  </CardDescription>
                </div>
                <Badge className={statusColors[table.status as keyof typeof statusColors]}>
                  {statusLabels[table.status as keyof typeof statusLabels]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                {/* Affichage du QR code si disponible */}
                {table.qrCodeImage && (
                  <img src={table.qrCodeImage} alt={`QR Table ${table.number}`} className="mx-auto mb-2 w-24 h-24 object-contain bg-white p-2 rounded" />
                )}
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-gray-600">{table.number}</span>
                </div>
                <p className="text-sm text-gray-500">Capacité: {table.capacity} personnes</p>
                {/* Boutons admin */}
                <div className="flex justify-center gap-2 mt-4">
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(table.id)} disabled={deletingId === table.id} title="Supprimer la table">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {table.qrCodeImage ? (
                    <Button size="icon" variant="outline" onClick={() => handleDownloadQR(table)} title="Télécharger le QR code">
                      <Download className="w-4 h-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
