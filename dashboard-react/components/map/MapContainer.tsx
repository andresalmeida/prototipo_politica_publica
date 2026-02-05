"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useMapStore } from "@/store"
import type { Parroquia } from "@/types"
import {
  getParroquiasLayer,
  getInfraestructuraLayer,
  getSaludLayer,
  getHighlightLayer,
  CLUSTER_COLORS,
} from "@/lib/map/layers"
import { AlertTriangle } from "lucide-react"

interface MapContainerProps {
  parroquias: Parroquia[]
  height?: string
}

export function MapContainer({ parroquias, height = "600px" }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const { center, zoom, layers, selectedFeature, setSelectedFeature } = useMapStore()
  const [tokenError, setTokenError] = useState(false)

  // Check for token
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token || token === "") {
      setTokenError(true)
      console.error("❌ Mapbox token no configurado. Verifica DEPLOY.md para instrucciones.")
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return
    if (tokenError) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""
    mapboxgl.accessToken = token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: center,
      zoom: zoom,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right")

    map.current.on("load", () => {
      if (!map.current) return

      // Add source
      const geojsonData = {
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

      map.current.addSource("parroquias", {
        type: "geojson",
        data: geojsonData,
      })

      // Add layers
      map.current.addLayer(getHighlightLayer("parroquias"))
      map.current.addLayer(getParroquiasLayer("parroquias"))
      map.current.addLayer(getInfraestructuraLayer("parroquias"))
      map.current.addLayer(getSaludLayer("parroquias"))

      // Click handler
      map.current.on("click", "parroquias-circle", (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0]
          const codigo = feature.properties?.codigo_dpa as string
          setSelectedFeature(codigo)

          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold text-sm">${feature.properties?.nombre_parroquia}</h3>
                <p class="text-xs text-gray-600">${feature.properties?.nombre_canton}, ${feature.properties?.nombre_provincia}</p>
                <div class="mt-2 text-xs space-y-1">
                  <div class="flex justify-between">
                    <span>Cluster:</span>
                    <span class="font-medium" style="color: ${CLUSTER_COLORS[feature.properties?.cluster_kmeans || 0]}">
                      ${feature.properties?.cluster_kmeans !== null ? feature.properties?.cluster_kmeans : "N/A"}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span>Infraestructura:</span>
                    <span class="font-medium">${feature.properties?.num_infraestructura_petrolera || 0}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Est. Salud:</span>
                    <span class="font-medium">${feature.properties?.num_establecimientos || 0}</span>
                  </div>
                </div>
              </div>
            `)
            .addTo(map.current!)
        }
      })

      // Hover cursor
      map.current.on("mouseenter", "parroquias-circle", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer"
      })
      map.current.on("mouseleave", "parroquias-circle", () => {
        if (map.current) map.current.getCanvas().style.cursor = ""
      })
    })

    return () => {
      map.current?.remove()
    }
  }, [parroquias, setSelectedFeature, tokenError])

  // Update layer visibility
  useEffect(() => {
    if (!map.current) return

    layers.forEach((layer) => {
      const layerId = `${layer.id}-circle`
      if (map.current?.getLayer(layerId)) {
        map.current.setLayoutProperty(
          layerId,
          "visibility",
          layer.visible ? "visible" : "none"
        )
        map.current.setPaintProperty(layerId, "circle-opacity", layer.opacity)
      }
    })
  }, [layers])

  // Update highlight
  useEffect(() => {
    if (!map.current || !map.current.getLayer("highlight-circle")) return

    map.current.setFilter("highlight-circle", [
      "==",
      ["get", "codigo_dpa"],
      selectedFeature || "",
    ])
  }, [selectedFeature])

  // Show error if token is missing
  if (tokenError) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center p-8"
      >
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Token de Mapbox requerido
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Para visualizar los mapas, necesitas configurar un token de Mapbox.
            El plan gratuito incluye 50,000 cargas por mes.
          </p>
          <a
            href="https://account.mapbox.com/access-tokens/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Obtener token gratuito
          </a>
          <p className="text-xs text-gray-500 mt-4">
            Luego configura la variable <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> en tu plataforma de deploy.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mapContainer}
      style={{ height }}
      className="w-full rounded-xl overflow-hidden shadow-lg"
    />
  )
}