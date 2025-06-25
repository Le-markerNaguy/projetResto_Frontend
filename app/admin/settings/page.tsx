"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Bell, Palette, Shield } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    restaurantName: "Mon Restaurant",
    currency: "XOF",
    timezone: "Africa/Abidjan",
    notifications: {
      newOrders: true,
      lowStock: true,
      dailyReport: false,
    },
    appearance: {
      theme: "light",
      language: "fr",
    },
    system: {
      autoBackup: true,
      maintenanceMode: false,
    },
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSave = async () => {
    setLoading(true)
    setMessage("")

    try {
      // Simuler la sauvegarde des paramètres
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Paramètres sauvegardés avec succès")
    } catch (error) {
      setMessage("Erreur lors de la sauvegarde")
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (path: string, value: any) => {
    const keys = path.split(".")
    setSettings((prev) => {
      const newSettings = { ...prev }
      let current: any = newSettings

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newSettings
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Configurez votre application</p>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Paramètres généraux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Paramètres généraux
          </CardTitle>
          <CardDescription>Configuration de base du restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="restaurantName">Nom du restaurant</Label>
            <Input
              id="restaurantName"
              value={settings.restaurantName}
              onChange={(e) => updateSetting("restaurantName", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Devise</Label>
              <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XOF">Franc CFA (F CFA)</SelectItem>
                  <SelectItem value="USD">Dollar ($)</SelectItem>
                  <SelectItem value="GBP">Livre (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Abidjan">Africa/Abidjan</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </CardTitle>
          <CardDescription>Gérez vos préférences de notification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="newOrders">Nouvelles commandes</Label>
              <p className="text-sm text-gray-500">Recevoir une notification pour chaque nouvelle commande</p>
            </div>
            <Switch
              id="newOrders"
              checked={settings.notifications.newOrders}
              onCheckedChange={(checked) => updateSetting("notifications.newOrders", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="lowStock">Stock faible</Label>
              <p className="text-sm text-gray-500">Alerte quand un produit est en rupture</p>
            </div>
            <Switch
              id="lowStock"
              checked={settings.notifications.lowStock}
              onCheckedChange={(checked) => updateSetting("notifications.lowStock", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dailyReport">Rapport quotidien</Label>
              <p className="text-sm text-gray-500">Recevoir un résumé quotidien par email</p>
            </div>
            <Switch
              id="dailyReport"
              checked={settings.notifications.dailyReport}
              onCheckedChange={(checked) => updateSetting("notifications.dailyReport", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Apparence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Apparence
          </CardTitle>
          <CardDescription>Personnalisez l'interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="theme">Thème</Label>
              <Select
                value={settings.appearance.theme}
                onValueChange={(value) => updateSetting("appearance.theme", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="auto">Automatique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Langue</Label>
              <Select
                value={settings.appearance.language}
                onValueChange={(value) => updateSetting("appearance.language", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Système
          </CardTitle>
          <CardDescription>Paramètres système et sécurité</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoBackup">Sauvegarde automatique</Label>
              <p className="text-sm text-gray-500">Sauvegarder automatiquement les données chaque jour</p>
            </div>
            <Switch
              id="autoBackup"
              checked={settings.system.autoBackup}
              onCheckedChange={(checked) => updateSetting("system.autoBackup", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenanceMode">Mode maintenance</Label>
              <p className="text-sm text-gray-500">Désactiver temporairement l'accès public</p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={settings.system.maintenanceMode}
              onCheckedChange={(checked) => updateSetting("system.maintenanceMode", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Sauvegarde..." : "Sauvegarder les paramètres"}
        </Button>
      </div>
    </div>
  )
}
