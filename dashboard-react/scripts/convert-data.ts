import { parse } from "csv-parse/sync"
import { readFileSync, writeFileSync, mkdirSync } from "fs"
import { join } from "path"

interface ParroquiaCSV {
  codigo_dpa: string
  nombre_provincia: string
  nombre_canton: string
  nombre_parroquia: string
  centroide_lon: string
  centroide_lat: string
  area_km2: string
  poblacion_total: string
  poblacion_afro: string
  pct_poblacion_afro: string
  num_establecimientos: string
  densidad_establecimientos_km2: string
  establecimientos_por_10k_hab: string
  num_infraestructura_petrolera: string
  num_pozos: string
  num_sitios_contaminados: string
  tiene_petroleo: string
  densidad_petroleo_km2: string
  cluster_kmeans: string
  cluster_dbscan: string
}

interface ClusterCSV {
  cluster_kmeans: string
  n_parroquias: string
  pob_total: string
  pob_afro: string
  pct_afro_mean: string
  n_establecimientos: string
  estab_10k_mean: string
  n_infraestructura: string
  densidad_petroleo_mean: string
}

function parseNumber(value: string): number | null {
  if (!value || value.trim() === "" || value === "NA") return null
  const num = parseFloat(value)
  return isNaN(num) ? null : num
}

function convertParroquias() {
  console.log("Convirtiendo parroquias_con_clusters.csv...")

  const csvContent = readFileSync(
    join(process.cwd(), "..", "data", "processed", "parroquias_con_clusters.csv"),
    "utf-8"
  )

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as ParroquiaCSV[]

  const parroquias = records.map((record) => ({
    codigo_dpa: record.codigo_dpa,
    nombre_provincia: record.nombre_provincia,
    nombre_canton: record.nombre_canton,
    nombre_parroquia: record.nombre_parroquia,
    centroide_lon: parseFloat(record.centroide_lon),
    centroide_lat: parseFloat(record.centroide_lat),
    area_km2: parseFloat(record.area_km2),
    poblacion_total: parseNumber(record.poblacion_total),
    poblacion_afro: parseNumber(record.poblacion_afro),
    pct_poblacion_afro: parseNumber(record.pct_poblacion_afro),
    num_establecimientos: parseInt(record.num_establecimientos) || 0,
    densidad_establecimientos_km2: parseFloat(record.densidad_establecimientos_km2) || 0,
    establecimientos_por_10k_hab: parseNumber(record.establecimientos_por_10k_hab),
    num_infraestructura_petrolera: parseInt(record.num_infraestructura_petrolera) || 0,
    num_pozos: parseInt(record.num_pozos) || 0,
    num_sitios_contaminados: parseInt(record.num_sitios_contaminados) || 0,
    tiene_petroleo: parseInt(record.tiene_petroleo) || 0,
    densidad_petroleo_km2: parseFloat(record.densidad_petroleo_km2) || 0,
    cluster_kmeans: parseNumber(record.cluster_kmeans),
    cluster_dbscan: parseNumber(record.cluster_dbscan),
  }))

  mkdirSync(join(process.cwd(), "public", "data"), { recursive: true })
  writeFileSync(
    join(process.cwd(), "public", "data", "parroquias.json"),
    JSON.stringify(parroquias, null, 2)
  )

  console.log(`✓ Convertidas ${parroquias.length} parroquias`)
  return parroquias
}

function convertClusters() {
  console.log("Convirtiendo estadisticas_clusters.csv...")

  const csvContent = readFileSync(
    join(process.cwd(), "..", "data", "processed", "estadisticas_clusters.csv"),
    "utf-8"
  )

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as ClusterCSV[]

  const clusters = records.map((record) => ({
    cluster_kmeans: parseFloat(record.cluster_kmeans),
    n_parroquias: parseInt(record.n_parroquias),
    pob_total: parseFloat(record.pob_total),
    pob_afro: parseFloat(record.pob_afro),
    pct_afro_mean: parseFloat(record.pct_afro_mean),
    n_establecimientos: parseInt(record.n_establecimientos),
    estab_10k_mean: parseFloat(record.estab_10k_mean),
    n_infraestructura: parseInt(record.n_infraestructura),
    densidad_petroleo_mean: parseFloat(record.densidad_petroleo_mean),
  }))

  writeFileSync(
    join(process.cwd(), "public", "data", "clusters.json"),
    JSON.stringify(clusters, null, 2)
  )

  console.log(`✓ Convertidos ${clusters.length} clusters`)
  return clusters
}

function convertGeoJSON(parroquias: ReturnType<typeof convertParroquias>) {
  console.log("Convirtiendo parroquias_centroides.geojson...")

  const geojson = {
    type: "FeatureCollection" as const,
    features: parroquias.map((p) => ({
      type: "Feature" as const,
      properties: {
        codigo_dpa: p.codigo_dpa,
        nombre_parroquia: p.nombre_parroquia,
        nombre_canton: p.nombre_canton,
        nombre_provincia: p.nombre_provincia,
        cluster_kmeans: p.cluster_kmeans,
        num_infraestructura_petrolera: p.num_infraestructura_petrolera,
        num_establecimientos: p.num_establecimientos,
        densidad_petroleo_km2: p.densidad_petroleo_km2,
        pct_poblacion_afro: p.pct_poblacion_afro,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [p.centroide_lon, p.centroide_lat],
      },
    })),
  }

  writeFileSync(
    join(process.cwd(), "public", "data", "parroquias_geo.json"),
    JSON.stringify(geojson, null, 2)
  )

  console.log(`✓ Convertidos ${geojson.features.length} features GeoJSON`)
}

// Main execution
console.log("═══════════════════════════════════════════")
console.log("CONVERSIÓN DE DATOS - Dashboard React")
console.log("═══════════════════════════════════════════\n")

try {
  const parroquias = convertParroquias()
  convertClusters()
  convertGeoJSON(parroquias)

  console.log("\n═══════════════════════════════════════════")
  console.log("✓ Conversión completada exitosamente")
  console.log("═══════════════════════════════════════════")
} catch (error) {
  console.error("\n✗ Error en la conversión:", error)
  process.exit(1)
}