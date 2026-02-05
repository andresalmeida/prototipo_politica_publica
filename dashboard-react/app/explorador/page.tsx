"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, ChevronDown, ChevronUp } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useParroquias,
  useProvincias,
  useFilteredParroquias,
} from "@/hooks/useData"
import { useFilterStore } from "@/store"
import { formatNumber, formatPercent, getClusterColor, getClusterLabel } from "@/lib/utils"
import type { Parroquia } from "@/types"

export default function ExploradorPage() {
  const { data: parroquias, loading } = useParroquias()
  const provincias = useProvincias(parroquias)
  const { filters, setProvincia, setCluster, resetFilters } = useFilterStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Parroquia>("nombre_parroquia")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const filteredParroquias = useFilteredParroquias(parroquias, {
    provincia: filters.provincia,
    cluster: filters.cluster,
  }).filter(
    (p) =>
      p.nombre_parroquia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nombre_canton.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nombre_provincia.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedParroquias = [...filteredParroquias].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    return sortDirection === "asc"
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number)
  })

  const handleSort = (field: keyof Parroquia) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Código DPA",
      "Provincia",
      "Cantón",
      "Parroquia",
      "Población",
      "% Afro",
      "Establecimientos",
      "Infraestructura",
      "Cluster",
    ]
    const rows = sortedParroquias.map((p) => [
      p.codigo_dpa,
      p.nombre_provincia,
      p.nombre_canton,
      p.nombre_parroquia,
      p.poblacion_total || "",
      p.pct_poblacion_afro?.toFixed(2) || "",
      p.num_establecimientos,
      p.num_infraestructura_petrolera,
      p.cluster_kmeans,
    ])

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "parroquias.csv"
    a.click()
  }

  return (
    <div className="space-y-6">
      <Header
        title="Explorador de Datos"
        subtitle="Análisis detallado por parroquia con filtros avanzados"
        icon={<Search className="w-8 h-8" />}
        gradient="orange"
      />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-4"
      >
        <div className="flex-1 min-w-[300px]">
          <Input
            placeholder="Buscar parroquia, cantón o provincia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
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

        <Button variant="outline" onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </motion.div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Mostrando {sortedParroquias.length} de {parroquias.length} parroquias
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th
                  className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80"
                  onClick={() => handleSort("nombre_parroquia")}
                >
                  <div className="flex items-center gap-1">
                    Parroquia
                    {sortField === "nombre_parroquia" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80"
                  onClick={() => handleSort("nombre_canton")}
                >
                  <div className="flex items-center gap-1">
                    Cantón
                    {sortField === "nombre_canton" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80"
                  onClick={() => handleSort("nombre_provincia")}
                >
                  <div className="flex items-center gap-1">
                    Provincia
                    {sortField === "nombre_provincia" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right font-medium cursor-pointer hover:bg-muted/80"
                  onClick={() => handleSort("poblacion_total")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Población
                    {sortField === "poblacion_total" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right font-medium cursor-pointer hover:bg-muted/80"
                  onClick={() => handleSort("pct_poblacion_afro")}
                >
                  <div className="flex items-center justify-end gap-1">
                    % Afro
                    {sortField === "pct_poblacion_afro" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right font-medium cursor-pointer hover:bg-muted/80"
                  onClick={() => handleSort("num_establecimientos")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Est. Salud
                    {sortField === "num_establecimientos" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right font-medium cursor-pointer hover:bg-muted/80"
                  onClick={() => handleSort("num_infraestructura_petrolera")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Infraestructura
                    {sortField === "num_infraestructura_petrolera" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center font-medium cursor-pointer hover:bg-muted/80"
                  onClick={() => handleSort("cluster_kmeans")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Cluster
                    {sortField === "cluster_kmeans" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  </td>
                </tr>
              ) : sortedParroquias.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No se encontraron resultados
                  </td>
                </tr>
              ) : (
                sortedParroquias.slice(0, 100).map((parroquia) => (
                  <tr
                    key={parroquia.codigo_dpa}
                    className="border-t hover:bg-muted/50 cursor-pointer"
                    onClick={() =>
                      setExpandedRow(
                        expandedRow === parroquia.codigo_dpa
                          ? null
                          : parroquia.codigo_dpa
                      )
                    }
                  >
                    <td className="px-4 py-3 font-medium">
                      {parroquia.nombre_parroquia}
                    </td>
                    <td className="px-4 py-3">{parroquia.nombre_canton}</td>
                    <td className="px-4 py-3">{parroquia.nombre_provincia}</td>
                    <td className="px-4 py-3 text-right">
                      {parroquia.poblacion_total
                        ? formatNumber(parroquia.poblacion_total, 0)
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {parroquia.pct_poblacion_afro
                        ? formatPercent(parroquia.pct_poblacion_afro, 1)
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {parroquia.num_establecimientos}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {parroquia.num_infraestructura_petrolera}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {parroquia.cluster_kmeans !== null && (
                        <Badge
                          style={{
                            backgroundColor: getClusterColor(
                              parroquia.cluster_kmeans
                            ),
                            color: "white",
                          }}
                        >
                          {parroquia.cluster_kmeans}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {sortedParroquias.length > 100 && (
          <div className="px-4 py-3 border-t bg-muted text-center text-sm text-muted-foreground">
            Mostrando 100 de {sortedParroquias.length} resultados. Use los filtros
            para refinar la búsqueda.
          </div>
        )}
      </motion.div>
    </div>
  )
}