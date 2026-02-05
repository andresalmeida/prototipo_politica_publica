"use client"

import { motion } from "framer-motion"
import { Eye, EyeOff, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useMapStore } from "@/store"
import { CLUSTER_COLORS } from "@/lib/map/layers"

const layerInfo = [
  { id: "parroquias", name: "Parroquias por Cluster", color: null },
  { id: "infraestructura", name: "Infraestructura Petrolera", color: "#dc2626" },
  { id: "salud", name: "Establecimientos de Salud", color: "#059669" },
]

const clusterLabels: Record<number, string> = {
  0: "Sin Petróleo",
  1: "Alta Actividad",
  2: "Actividad Moderada",
  3: "Alta Población Afro",
}

export function LayerControl() {
  const { layers, toggleLayer, setLayerOpacity } = useMapStore()

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-4 right-4 z-10 w-72 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg border border-border p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Control de Capas</h3>
      </div>

      <div className="space-y-4">
        {layerInfo.map((layer) => {
          const layerState = layers.find((l) => l.id === layer.id)
          if (!layerState) return null

          return (
            <div key={layer.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {layer.color ? (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: layer.color }}
                    />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500" />
                  )}
                  <span className="text-sm font-medium">{layer.name}</span>
                </div>
                <Switch
                  checked={layerState.visible}
                  onCheckedChange={() => toggleLayer(layer.id)}
                />
              </div>
              {layerState.visible && (
                <div className="pl-5">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-3 h-3 text-muted-foreground" />
                    <Slider
                      value={[layerState.opacity * 100]}
                      onValueChange={([value]) =>
                        setLayerOpacity(layer.id, value / 100)
                      }
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <Eye className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Leyenda de Clusters
        </h4>
        <div className="space-y-2">
          {Object.entries(CLUSTER_COLORS).map(([cluster, color]) => (
            <div key={cluster} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs">
                {clusterLabels[Number(cluster)]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}