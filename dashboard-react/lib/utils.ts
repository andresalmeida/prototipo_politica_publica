import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals: number = 1): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}K`
  }
  return num.toFixed(decimals)
}

export function formatPercent(num: number, decimals: number = 1): string {
  return `${num.toFixed(decimals)}%`
}

export function getClusterColor(cluster: number): string {
  const colors: Record<number, string> = {
    0: "#3b82f6", // Blue - Sin petróleo
    1: "#ef4444", // Red - Alta actividad
    2: "#10b981", // Green - Moderada
    3: "#f59e0b", // Orange - Población Afro
  }
  return colors[cluster] || "#94a3b8"
}

export function getClusterLabel(cluster: number): string {
  const labels: Record<number, string> = {
    0: "Sin Petróleo",
    1: "Alta Actividad",
    2: "Actividad Moderada",
    3: "Alta Población Afro",
  }
  return labels[cluster] || "Sin Clasificar"
}