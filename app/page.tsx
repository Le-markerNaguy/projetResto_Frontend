"use client"

import { useEffect, useState } from "react"
import { useDishes, useTables } from "@/hooks/use-api"
import { useCart } from "@/hooks/use-cart"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MenuHeader } from "@/components/menu/menu-header"
import { CategoryFilter } from "@/components/menu/category-filter"
import { MenuGrid } from "@/components/menu/menu-grid"
import { OrderTableExpanded } from "@/components/menu/order-table-expanded"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"
import { remove as removeDiacritics } from "diacritics"
import { ShoppingCart } from "lucide-react"

// Typage explicite pour Table
interface Table {
  id: number;
  numero: string;
  qrToken?: string;
  // Ajoute d'autres propriétés si besoin
}

export default function HomePage() {
  const { dishes, loading: dishesLoading } = useDishes()
  const { tables, loading: tablesLoading } = useTables()
  const { cart, addToCart, removeFromCart, removeItemCompletely, clearCart, getItemsCount } = useCart()

  const [selectedTable, setSelectedTable] = useState("")
  const [qrTableDetected, setQrTableDetected] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [expandedOrder, setExpandedOrder] = useState(false)
  const [manualTableNumber, setManualTableNumber] = useState("")

  // Correction du typage pour éviter les erreurs
  const safeTables: Table[] = Array.isArray(tables) ? tables as Table[] : [];

  // Ajout : lecture du paramètre table (qrToken) dans l'URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const qrToken = params.get("table")
      if (qrToken && safeTables.length > 0) {
        const foundTable = safeTables.find((t) => t.qrToken === qrToken)
        if (foundTable) {
          setSelectedTable(foundTable.id.toString())
          setQrTableDetected(true)
        }
      }
    }
  }, [safeTables])

  const handleSubmitOrder = async () => {
    console.log('handleSubmitOrder called')
    // Utiliser le numéro de table saisi manuellement si présent
    let tableIdToUse = selectedTable
    if (manualTableNumber && !qrTableDetected) {
      const table = safeTables.find((t) => t.numero?.toString() === manualTableNumber.trim())
      if (table) {
        tableIdToUse = table.id.toString(); // Correction ici
      } else {
        alert("Numéro de table invalide")
        return
      }
    }
    if (!tableIdToUse || cart.length === 0) return
    setLoading(true)
    try {
      const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
      const tax = subtotal * 0.2
      const total = subtotal + tax
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      const response = await fetch(`${API_URL}/commandes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableId: Number(tableIdToUse),
          plats: cart.map(item => ({
            id: Number(item.dishId),
            quantite: item.quantity
          })),
          total: total,
          customerName: customerName || undefined,
        }),
      })
      if (!response.ok) throw new Error("Erreur lors de la commande")
      alert("Commande passée avec succès !")
      clearCart()
      setSelectedTable("")
      setManualTableNumber("")
      setCustomerName("")
      setExpandedOrder(false) // Revenir à l'affichage normal du menu
    } catch (error) {
      alert("Erreur lors de la commande")
      console.error("Order error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (dishesLoading || tablesLoading) {
    return <LoadingSpinner />
  }

  // Filtrer les plats par catégorie (normalisation)
  const normalize = (cat: string) => removeDiacritics((cat || "").trim().toLowerCase())
  const categories = [...new Set(dishes.map((dish: any) => normalize(dish.category)))]
  const filteredDishes =
    selectedCategory === "all"
      ? dishes.filter((dish: any) => dish.available)
      : dishes.filter((dish: any) => dish.available && normalize(dish.category) === normalize(selectedCategory))

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <MenuHeader cartItemsCount={getItemsCount()} />
      {/* Bouton flottant résumé commande (mobile/desktop) */}
      {cart.length > 0 && !expandedOrder && (
        <button
          className="fixed z-50 bottom-6 right-6 w-20 h-20 bg-white border-4 border-orange-300 shadow-lg rounded-full flex flex-col items-center justify-center transition hover:scale-105 active:scale-95"
          style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}
          onClick={() => setExpandedOrder(true)}
          aria-label="Voir le résumé de la commande"
        >
          <span className="relative flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-orange-500" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">{getItemsCount()}</span>
          </span>
          <span className="text-xs mt-1 font-semibold text-orange-700">Commande</span>
        </button>
      )}
      <div className="container mx-auto px-4 py-8">
        {expandedOrder ? (
          // Vue étendue avec tableau complet
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestion de la commande</h2>
              <Button variant="outline" onClick={() => setExpandedOrder(false)}>
                <Minimize2 className="h-4 w-4 mr-2" />
                Vue compacte
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Menu condensé */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Menu disponible</h3>
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
                <div className="mt-4">
                  <MenuGrid
                    dishes={filteredDishes}
                    cart={cart}
                    onAddToCart={addToCart}
                    onIncreaseQuantity={addToCart}
                    onDecreaseQuantity={removeFromCart}
                  />
                </div>
              </div>
              {/* Tableau de commande étendu */}
              <div>
                <OrderTableExpanded
                  cart={cart}
                  tables={tables}
                  selectedTable={selectedTable}
                  customerName={customerName}
                  loading={loading}
                  onTableChange={setSelectedTable}
                  onCustomerNameChange={setCustomerName}
                  onIncreaseQuantity={addToCart}
                  onDecreaseQuantity={removeFromCart}
                  onRemoveItem={removeItemCompletely}
                  onSubmitOrder={handleSubmitOrder}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Menu principal */}
            <div className="lg:col-span-3">
              {/* Filtres et contrôles */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
                {/* Suppression du ViewToggle */}
              </div>

              {/* Affichage des plats uniquement en grille avec image */}
              <MenuGrid
                dishes={filteredDishes}
                cart={cart}
                onAddToCart={addToCart}
                onIncreaseQuantity={addToCart}
                onDecreaseQuantity={removeFromCart}
              />
            </div>
            {/* Suppression OrderTable compact */}
          </div>
        )}
      </div>
    </div>
  )
}
