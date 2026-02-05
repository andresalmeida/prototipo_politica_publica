"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Map, Filter } from "lucide-react"
import { Header } from "../../components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { MapContainer } from "../../components/map/MapContainer"
import { LayerControl } from "../../components/map/LayerControl"
import { useParroquias, useProvincias, useFilteredParroquias } from "../../hooks/useData"
import { useFilterStore } from "../../store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { getClusterColor, getClusterLabel } from "../../lib"

export default function MapasPage() {
  const { data: parroquias, loading } = useParroquias()
  const provincias = useProvincias(parroquias)
  const { filters, setProvincia, setCluster, resetFilters } = useFilterStore()

  const filteredParroquias = useFilteredParroquias(parroquias, {
    provincia: filters.provincia,
    cluster: filters.cluster,
  })

  const activeFiltersCount = [
    filters.provincia,
    filters.cluster !== null,
  ].filter(Boolean).length

  return (
    <div className="space-y-6">
      <Header
        title="Mapas y Territorios"
        subtitle="Visualización geoespacial avanzada con clustering territorial"
        icon={<Map className="w-8 h-8" />}
        gradient="red"
      />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>

        <Select
          value={filters.provincia || "all"}
          onValueChange={(value) =>
            setProvincia(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas las provincias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las provincias</SelectItem>
            {provincias.map((prov) => (
              <SelectItem key={prov} value={prov}>
                {prov}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.cluster?.toString() || "all"}
          onValueChange={(value) =>
            setCluster(value === "all" ? null : parseInt(value))
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos los clusters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los clusters</SelectItem>
            {[0, 1, 2, 3].map((cluster) => (
              <SelectItem key={cluster} value={cluster.toString()}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getClusterColor(cluster) }}
                  />
                  {getClusterLabel(cluster)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
            onClick={resetFilters}
          >
            Limpiar filtros ({activeFiltersCount})
          </Badge>
        )}

        <div className="ml-auto text-sm text-muted-foreground">
          Mostrando {filteredParroquias.length} de {parroquias.length} parroquias
        </div>
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {loading ? (
          <Card className="h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando mapa...</p>
            </div>
          </Card>
        ) : (
          <div className="relative">
            <MapContainer parroquias={filteredParroquias} height="600px" />
            <LayerControl />
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Parroquias Filtradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredParroquias.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Con Petróleo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredParroquias.filter((p) => p.tiene_petroleo === 1).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Establecimientos de Salud
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredParroquias.reduce(
                (sum, p) => sum + p.num_establecimientos,
                0
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Infraestructura Petrolera
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredParroquias.reduce(
                (sum, p) => sum + p.num_infraestructura_petrolera,
                0
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}