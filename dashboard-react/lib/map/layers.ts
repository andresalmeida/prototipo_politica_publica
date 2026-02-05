import type { AnyLayer } from "mapbox-gl"

export const MAPBOX_STYLES = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
  satellite: "mapbox://styles/mapbox/satellite-v9",
  streets: "mapbox://styles/mapbox/streets-v12",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
}

export const CLUSTER_COLORS: Record<number, string> = {
  0: "#3b82f6", // Blue - Sin petróleo
  1: "#ef4444", // Red - Alta actividad
  2: "#10b981", // Green - Moderada
  3: "#f59e0b", // Orange - Población Afro
}

export const getParroquiasLayer = (sourceId: string): AnyLayer => ({
  id: "parroquias-circle",
  type: "circle",
  source: sourceId,
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      5,
      4,
      10,
      12,
    ],
    "circle-color": [
      "match",
      ["get", "cluster_kmeans"],
      0,
      CLUSTER_COLORS[0],
      1,
      CLUSTER_COLORS[1],
      2,
      CLUSTER_COLORS[2],
      3,
      CLUSTER_COLORS[3],
      "#94a3b8",
    ],
    "circle-opacity": 0.7,
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
    "circle-stroke-opacity": 0.8,
  },
})

export const getInfraestructuraLayer = (sourceId: string): AnyLayer => ({
  id: "infraestructura-circle",
  type: "circle",
  source: sourceId,
  filter: [">", ["get", "num_infraestructura_petrolera"], 0],
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["get", "densidad_petroleo_km2"],
      0,
      4,
      10,
      25,
    ],
    "circle-color": "#dc2626",
    "circle-opacity": 0.8,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#ffffff",
  },
})

export const getSaludLayer = (sourceId: string): AnyLayer => ({
  id: "salud-circle",
  type: "circle",
  source: sourceId,
  filter: [">", ["get", "num_establecimientos"], 0],
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["get", "num_establecimientos"],
      0,
      3,
      20,
      15,
    ],
    "circle-color": "#059669",
    "circle-opacity": 0.6,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#ffffff",
  },
})

export const getAfroLayer = (sourceId: string): AnyLayer => ({
  id: "afro-circle",
  type: "circle",
  source: sourceId,
  filter: [">", ["get", "pct_poblacion_afro"], 5],
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["get", "pct_poblacion_afro"],
      0,
      4,
      50,
      20,
    ],
    "circle-color": "#7c3aed",
    "circle-opacity": 0.7,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#ffffff",
  },
})

export const getHighlightLayer = (sourceId: string): AnyLayer => ({
  id: "highlight-circle",
  type: "circle",
  source: sourceId,
  filter: ["==", ["get", "codigo_dpa"], ""],
  paint: {
    "circle-radius": 20,
    "circle-color": "#fbbf24",
    "circle-opacity": 0.5,
    "circle-stroke-width": 3,
    "circle-stroke-color": "#f59e0b",
  },
})

export const updateHighlightFilter = (map: mapboxgl.Map, codigoDpa: string | null) => {
  const layer = map.getLayer("highlight-circle")
  if (layer) {
    map.setFilter("highlight-circle", ["==", ["get", "codigo_dpa"], codigoDpa || ""])
  }
}