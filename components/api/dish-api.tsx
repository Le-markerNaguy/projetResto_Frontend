"use client"

// Composant utilitaire pour les appels API des plats
export class DishAPI {
  private static baseUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/plats`

  static async getAll() {
    const response = await fetch(this.baseUrl)
    if (!response.ok) throw new Error("Erreur lors de la récupération des plats")
    return response.json()
  }

  static async create(dish: any, token: string) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dish),
    })
    if (!response.ok) throw new Error("Erreur lors de la création du plat")
    return response.json()
  }

  static async update(id: string, dish: any, token: string) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dish),
    })
    if (!response.ok) throw new Error("Erreur lors de la modification du plat")
    return response.json()
  }

  static async delete(id: string, token: string) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error("Erreur lors de la suppression du plat")
  }
}
