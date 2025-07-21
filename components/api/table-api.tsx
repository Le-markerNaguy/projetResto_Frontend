"use client"

// Composant utilitaire pour les appels API des tables
export class TableAPI {
  private static baseUrl = `https://express-projetresto.onrender.com/api/tables`

  static async getAll() {
    const response = await fetch(this.baseUrl)
    if (!response.ok) throw new Error("Erreur lors de la récupération des tables")
    return response.json()
  }

  static async create(table: any, token: string) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(table),
    })
    if (!response.ok) throw new Error("Erreur lors de la création de la table")
    return response.json()
  }
}
