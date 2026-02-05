export interface Parroquia {
  codigo_dpa: string
  nombre_provincia: string
  nombre_canton: string
  nombre_parroquia: string
  centroide_lon: number
  centroide_lat: number
  area_km2: number
  poblacion_total: number | null
  poblacion_afro: number | null
  pct_poblacion_afro: number | null
  num_establecimientos: number
  densidad_establecimientos_km2: number
  establecimientos_por_10k_hab: number | null
  num_infraestructura_petrolera: number
  num_pozos: number
  num_sitios_contaminados: number
  tiene_petroleo: number
  densidad_petroleo_km2: number
  cluster_kmeans: number | null
  cluster_dbscan: number | null
}

export interface ClusterStats {
  cluster_kmeans: number
  n_parroquias: number
  pob_total: number
  pob_afro: number
  pct_afro_mean: number
  n_establecimientos: number
  estab_10k_mean: number
  n_infraestructura: number
  densidad_petroleo_mean: number
}

export interface GeoFeature {
  type: "Feature"
  properties: {
    codigo_dpa: string
    nombre_parroquia: string
    nombre_canton: string
    nombre_provincia: string
    centroide_lon: number
    centroide_lat: number
    area_km2: number
  }
  geometry: {
    type: "Point"
    coordinates: [number, number]
  }
}

export interface GeoJSONData {
  type: "FeatureCollection"
  features: GeoFeature[]
}

export interface MapLayer {
  id: string
  name: string
  visible: boolean
  opacity: number
}

export interface FilterState {
  provincia: string | null
  cluster: number | null
  minPoblacion: number
  maxPoblacion: number
  tienePetroleo: boolean | null
}

export interface MetricCard {
  title: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: string
}

export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface ScatterData {
  x: number
  y: number
  name: string
  cluster: number
  size?: number
}