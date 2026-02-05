"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingDown, Users, Droplets } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CorrelationChart } from "@/components/charts/CorrelationChart"
import { BarChart } from "@/components/charts/BarChart"
import {
  useParroquias,
  useClusterStats,
  useScatterData,
  useMetrics,
} from "@/hooks/useData"
import { formatNumber, formatPercent } from "@/lib/utils"

export default function AnalisisPage() {
  const { data: parroquias, loading: loadingParroquias } = useParroquias()
  const { data: clusters, loading: loadingClusters } = useClusterStats()
  const scatterData = useScatterData(parroquias)
  const metrics = useMetrics(parroquias)

  // Calculate additional metrics
  const conPetroleo = parroquias.filter((p) => p.tiene_petroleo === 1)
  const sinPetroleo = parroquias.filter((p) => p.tiene_petroleo === 0)

  const avgEstabConPetroleo =
    conPetroleo.reduce((sum, p) => sum + (p.establecimientos_por_10k_hab || 0), 0) /
    (conPetroleo.length || 1)

  const avgEstabSinPetroleo =
    sinPetroleo.reduce((sum, p) => sum + (p.establecimientos_por_10k_hab || 0), 0) /
    (sinPetroleo.length || 1)

  const diferenciaAcceso =
    ((avgEstabSinPetroleo - avgEstabConPetroleo) / avgEstabSinPetroleo) * 100

  return (
    <div className="space-y-8">
      <Header
        title="Análisis General"
        subtitle="Estadísticas descriptivas y patrones territoriales"
        icon={<BarChart3 className="w-8 h-8" />}
        gradient="green"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Brecha de Acceso
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {loadingParroquias ? "..." : `-${diferenciaAcceso.toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Menos acceso a salud en zonas con petróleo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Promedio Est. Salud (Sin Petróleo)
            </CardTitle>
            <Users className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loadingParroquias
                ? "..."
                : avgEstabSinPetroleo.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Establecimientos por 10k habitantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Promedio Est. Salud (Con Petróleo)
            </CardTitle>
            <Droplets className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loadingParroquias
                ? "..."
                : avgEstabConPetroleo.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Establecimientos por 10k habitantes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CorrelationChart data={scatterData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BarChart data={clusters} />
        </motion.div>
      </div>

      {/* Cluster Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold mb-4">Análisis de Clusters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingClusters
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-8 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))
            : clusters.map((cluster) => (
                <Card key={cluster.cluster_kmeans}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor:
                            [
                              "#3b82f6",
                              "#ef4444",
                              "#10b981",
                              "#f59e0b",
                            ][cluster.cluster_kmeans] || "#94a3b8",
                        }}
                      />
                      <CardTitle className="text-base">
                        Cluster {cluster.cluster_kmeans}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Parroquias</span>
                      <span className="font-medium">{cluster.n_parroquias}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Población</span>
                      <span className="font-medium">
                        {formatNumber(cluster.pob_total, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">% Afro</span>
                      <span className="font-medium">
                        {formatPercent(cluster.pct_afro_mean, 1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Est. Salud</span>
                      <span className="font-medium">
                        {cluster.n_establecimientos}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Infraestructura</span>
                      <span className="font-medium">
                        {cluster.n_infraestructura}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Est/10k hab
                      </span>
                      <span className="font-medium">
                        {cluster.estab_10k_mean.toFixed(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </motion.div>
    </div>
  )
}