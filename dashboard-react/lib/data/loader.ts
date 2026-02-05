import type { Parroquia, ClusterStats, GeoJSONData } from "@/types"

let parroquiasCache: Parroquia[] | null = null
let clustersCache: ClusterStats[] | null = null
let geojsonCache: GeoJSONData | null = null

export async function loadParroquias(): Promise<Parroquia[]> {
  if (parroquiasCache) return parroquiasCache

  try {
    const response = await fetch("/data/parroquias.json")
    const data = await response.json()
    parroquiasCache = data
    return data
  } catch (error) {
    console.error("Error loading parroquias:", error)
    return []
  }
}

export async function loadClusterStats(): Promise<ClusterStats[]> {
  if (clustersCache) return clustersCache

  try {
    const response = await fetch("/data/clusters.json")
    const data = await response.json()
    clustersCache = data
    return data
  } catch (error) {
    console.error("Error loading clusters:", error)
    return []
  }
}

export async function loadGeoJSON(): Promise<GeoJSONData | null> {
  if (geojsonCache) return geojsonCache

  try {
    const response = await fetch("/data/parroquias_geo.json")
    const data = await response.json()
    geojsonCache = data
    return data
  } catch (error) {
    console.error("Error loading geojson:", error)
    return null
  }
}

export function clearCache() {
  parroquiasCache = null
  clustersCache = null
  geojsonCache = null
}

export function getProvincias(parroquias: Parroquia[]): string[] {
  const provincias = new Set(parroquias.map((p) => p.nombre_provincia))
  return Array.from(provincias).sort()
}

export function filterParroquias(
  parroquias: Parroquia[],
  filters: {
    provincia?: string | null
    cluster?: number | null
    minPoblacion?: number
    maxPoblacion?: number
    tienePetroleo?: boolean | null
  }
): Parroquia[] {
  return parroquias.filter((p) => {
    if (filters.provincia && p.nombre_provincia !== filters.provincia) return false
    if (filters.cluster !== null && filters.cluster !== undefined && p.cluster_kmeans !== filters.cluster) return false
    if (filters.minPoblacion !== undefined && p.poblacion_total !== null && p.poblacion_total < filters.minPoblacion) return false
    if (filters.maxPoblacion !== undefined && p.poblacion_total !== null && p.poblacion_total > filters.maxPoblacion) return false
    if (filters.tienePetroleo !== null && filters.tienePetroleo !== undefined) {
      const tiene = p.tiene_petroleo === 1
      if (tiene !== filters.tienePetroleo) return false
    }
    return true
  })
}

export function getMetrics(parroquias: Parroquia[]) {
  const total = parroquias.length
  const conPetroleo = parroquias.filter((p) => p.tiene_petroleo === 1).length
  const totalPoblacion = parroquias.reduce((sum, p) => sum + (p.poblacion_total || 0), 0)
  const totalAfro = parroquias.reduce((sum, p) => sum + (p.poblacion_afro || 0), 0)
  const totalEstablecimientos = parroquias.reduce((sum, p) => sum + p.num_establecimientos, 0)
  const totalInfraestructura = parroquias.reduce((sum, p) => sum + p.num_infraestructura_petrolera, 0)

  return {
    totalParroquias: total,
    conPetroleo,
    sinPetroleo: total - conPetroleo,
    totalPoblacion,
    totalAfro,
    pctAfro: totalPoblacion > 0 ? (totalAfro / totalPoblacion) * 100 : 0,
    totalEstablecimientos,
    totalInfraestructura,
  }
}