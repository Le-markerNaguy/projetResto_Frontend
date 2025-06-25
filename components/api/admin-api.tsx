"use client"

// Composant utilitaire pour les appels API des admins
export class AdminAPI {
  private static baseUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/admin`

  static async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, motDePasse: password }),
    })
    if (!response.ok) throw new Error("Erreur de connexion")
    return response.json()
  }

  static async getAll(token: string) {
    const response = await fetch(this.baseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error("Erreur lors de la récupération des admins")
    return response.json()
  }

  static async create(admin: any, token: string) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(admin),
    })
    if (!response.ok) throw new Error("Erreur lors de la création de l'admin")
    return response.json()
  }

  static async delete(id: string, token: string) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error("Erreur lors de la suppression de l'admin")
  }
}
