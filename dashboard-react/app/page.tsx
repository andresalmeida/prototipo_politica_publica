"use client"

import { motion } from "framer-motion"
import {
  Droplets,
  HeartPulse,
  Users,
  MapPin,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Header } from "../components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { useParroquias, useClusterStats, useMetrics } from "../hooks/useData"
import { formatNumber, formatPercent } from "../lib"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function HomePage() {
  const { data: parroquias, loading: loadingParroquias } = useParroquias()
  const { data: clusters, loading: loadingClusters } = useClusterStats()
  const metrics = useMetrics(parroquias)

  return (
    <div className="space-y-8">
      <Header
        title="Paradoja Extractivista"
        subtitle="Análisis geoespacial de la relación entre infraestructura petrolera, acceso a salud y población afroecuatoriana en Ecuador"
        icon={<Droplets className="w-8 h-8" />}
        gradient="blue"
      />

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white shadow-lg"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">Hallazgo Clave</h2>
            <p className="text-white/90 leading-relaxed">
              Las parroquias con actividad petrolera tienen{" "}
              <span className="font-bold text-white">33% menos acceso</span> a
              servicios de salud en comparación con parroquias sin actividad
              extractiva. Esta brecha evidencia la paradoja extractivista en el
              territorio ecuatoriano.
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">-33%</div>
            <div className="text-sm text-white/80">Acceso a salud</div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Parroquias
              </CardTitle>
              <MapPin className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingParroquias
                  ? "..."
                  : formatNumber(metrics.totalParroquias, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.conPetroleo} con actividad petrolera
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Población Total
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingParroquias
                  ? "..."
                  : formatNumber(metrics.totalPoblacion, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercent(metrics.pctAfro, 1)} población afro
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Establecimientos de Salud
              </CardTitle>
              <HeartPulse className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingParroquias
                  ? "..."
                  : formatNumber(metrics.totalEstablecimientos, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(
                  metrics.totalEstablecimientos / (metrics.totalPoblacion / 10000)
                ).toFixed(1)}{" "}
                por 10k habitantes
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Infraestructura Petrolera
              </CardTitle>
              <Droplets className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingParroquias
                  ? "..."
                  : formatNumber(metrics.totalInfraestructura, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Pozos y sitios contaminados
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Navigation Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Link href="/analisis">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Análisis General</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Estadísticas descriptivas, correlaciones y patrones
                  territoriales entre variables clave.
                </p>
                <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
                  Explorar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/mapas">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Mapas y Territorios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Visualización geoespacial avanzada con clustering territorial y
                  control de capas interactivo.
                </p>
                <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
                  Explorar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/explorador">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Explorador de Datos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Análisis detallado por parroquia con filtros avanzados y
                  comparativas territoriales.
                </p>
                <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
                  Explorar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      {/* Clusters Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-bold mb-4">Resumen por Clusters</h2>
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
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
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
                      <span className="text-sm font-medium">
                        Cluster {cluster.cluster_kmeans}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Parroquias:</span>
                        <span className="font-medium">{cluster.n_parroquias}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Población:</span>
                        <span className="font-medium">
                          {formatNumber(cluster.pob_total, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">% Afro:</span>
                        <span className="font-medium">
                          {formatPercent(cluster.pct_afro_mean, 1)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </motion.div>
    </div>
  )
}