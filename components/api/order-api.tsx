"use client"

// Composant utilitaire pour les appels API des commandes
export class OrderAPI {
  private static baseUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/commandes`

  static async getAll(token: string) {
    const response = await fetch(this.baseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error("Erreur lors de la récupération des commandes")
    return response.json()
  }

  static async create(order: any) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
    if (!response.ok) throw new Error("Erreur lors de la création de la commande")
    return response.json()
  }

  static async updateStatus(id: string, status: string, token: string) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ statut: status }),
    })
    if (!response.ok) throw new Error("Erreur lors de la mise à jour du statut")
    return response.json()
  }
}
