"use client"

import { useEffect, useRef } from "react"

interface UseAutoRefreshOptions {
  interval?: number // en millisecondes
  enabled?: boolean
  onRefresh: () => void | Promise<void>
}

export function useAutoRefresh({ 
  interval = 120000, // 2 minutes par défaut
  enabled = true, 
  onRefresh 
}: UseAutoRefreshOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

      // Fonction de rafraîchissement
  const refresh = async () => {
    try {
      await onRefresh()
      console.log("🔄 Données rafraîchies automatiquement")
      // Déclencher un événement personnalisé pour notifier les composants
      window.dispatchEvent(new CustomEvent('autoRefresh', { 
        detail: { timestamp: new Date() } 
      }))
    } catch (error) {
      console.error("❌ Erreur lors du rafraîchissement automatique:", error)
    }
  }

    // Démarrer l'intervalle
    intervalRef.current = setInterval(refresh, interval)

    // Nettoyer l'intervalle au démontage
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [interval, enabled, onRefresh])

  // Fonction pour redémarrer manuellement l'intervalle
  const restartInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(onRefresh, interval)
  }

  // Fonction pour arrêter l'intervalle
  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  return {
    restartInterval,
    stopInterval,
    isActive: intervalRef.current !== null
  }
} 