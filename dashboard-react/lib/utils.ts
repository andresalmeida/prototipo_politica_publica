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
    1: "#ef4444", // Red - Petrolero moderado
    2: "#10b981", // Green - Comunidades Afroecuatorianas
    3: "#f59e0b", // Orange - Alta actividad petrolera
  }
  return colors[cluster] || "#94a3b8"
}

export function getClusterLabel(cluster: number): string {
  const labels: Record<number, string> = {
    0: "Sin Petróleo",
    1: "Petrolero Moderado",
    2: "Comunidades Afroecuatorianas",
    3: "Alta Actividad Petrolera",
  }
  return labels[cluster] || "Sin Clasificar"
}