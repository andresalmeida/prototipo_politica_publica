"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { Parroquia, ClusterStats, GeoJSONData } from "@/types"
import {
  loadParroquias,
  loadClusterStats,
  loadGeoJSON,
  getProvincias,
  filterParroquias,
  getMetrics,
} from "@/lib/data/loader"

export function useParroquias() {
  const [data, setData] = useState<Parroquia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadParroquias()
      .then((parroquias) => {
        setData(parroquias)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}

export function useClusterStats() {
  const [data, setData] = useState<ClusterStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadClusterStats()
      .then((clusters) => {
        setData(clusters)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}

export function useGeoJSON() {
  const [data, setData] = useState<GeoJSONData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadGeoJSON()
      .then((geojson) => {
        setData(geojson)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}

export function useProvincias(parroquias: Parroquia[]) {
  const [provincias, setProvincias] = useState<string[]>([])

  useEffect(() => {
    if (parroquias.length > 0) {
      setProvincias(getProvincias(parroquias))
    }
  }, [parroquias])

  return provincias
}

export function useFilteredParroquias(
  parroquias: Parroquia[],
  filters: {
    provincia?: string | null
    cluster?: number | null
    minPoblacion?: number
    maxPoblacion?: number
    tienePetroleo?: boolean | null
  }
) {
  // Use useMemo instead of useState + useEffect to avoid infinite re-renders
  // when filters object is recreated on each render
  return useMemo(() => {
    return filterParroquias(parroquias, filters)
  }, [
    parroquias,
    filters.provincia,
    filters.cluster,
    filters.minPoblacion,
    filters.maxPoblacion,
    filters.tienePetroleo,
  ])
}

export function useMetrics(parroquias: Parroquia[]) {
  const [metrics, setMetrics] = useState({
    totalParroquias: 0,
    conPetroleo: 0,
    sinPetroleo: 0,
    totalPoblacion: 0,
    totalAfro: 0,
    pctAfro: 0,
    totalEstablecimientos: 0,
    totalInfraestructura: 0,
  })

  useEffect(() => {
    if (parroquias.length > 0) {
      setMetrics(getMetrics(parroquias))
    }
  }, [parroquias])

  return metrics
}

export function useScatterData(parroquias: Parroquia[]) {
  const [data, setData] = useState<Array<{
    x: number
    y: number
    name: string
    cluster: number
    provincia: string
  }>>([])

  useEffect(() => {
    const scatterData = parroquias
      .filter(
        (p) =>
          p.densidad_petroleo_km2 !== null &&
          p.establecimientos_por_10k_hab !== null &&
          p.cluster_kmeans !== null
      )
      .map((p) => ({
        x: p.densidad_petroleo_km2,
        y: p.establecimientos_por_10k_hab || 0,
        name: p.nombre_parroquia,
        cluster: p.cluster_kmeans || 0,
        provincia: p.nombre_provincia,
      }))
    setData(scatterData)
  }, [parroquias])

  return data
}