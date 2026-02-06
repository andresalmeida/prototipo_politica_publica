"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart3,
  TrendingDown,
  Users,
  Droplets,
  Activity,
  Flame,
  Heart,
  AlertTriangle,
  Zap,
  MapPin,
} from "lucide-react"
import { Header } from "../../components/layout/Header"
import { ScatterPlotParadox } from "../../components/charts/ScatterPlotParadox"
import { BoxPlotCluster } from "../../components/charts/BoxPlotCluster"
import { ParadoxBarChart } from "../../components/charts/ParadoxBarChart"
import { StatCard } from "../../components/ui/stat-card"
import {
  useParroquias,
  useClusterStats,
  useScatterData,
  useMetrics,
} from "../../hooks/useData"
import { formatNumber, formatPercent, getClusterColor, getClusterLabel } from "../../lib"

export default function AnalisisPage() {
  const { data: parroquias, loading: loadingParroquias } = useParroquias()
  const { data: clusters, loading: loadingClusters } = useClusterStats()
  const scatterData = useScatterData(parroquias)
  const metrics = useMetrics(parroquias)

  // Calculate additional metrics
  const conPetroleo = parroquias.filter((p) => p.tiene_petroleo === 1)
  const sinPetroleo = parroquias.filter((p) => p.tiene_petroleo === 0)

  const avgEstabConPetroleo =
    conPetroleo.reduce(
      (sum, p) => sum + (p.establecimientos_por_10k_hab || 0),
      0
    ) / (conPetroleo.length || 1)

  const avgEstabSinPetroleo =
    sinPetroleo.reduce(
      (sum, p) => sum + (p.establecimientos_por_10k_hab || 0),
      0
    ) / (sinPetroleo.length || 1)

  const diferenciaAcceso =
    ((avgEstabSinPetroleo - avgEstabConPetroleo) / avgEstabSinPetroleo) * 100

  // Use num_infraestructura_petrolera for scatter (matching reference image X axis)
  const scatterDataEnhanced = parroquias
    .filter(
      (p) =>
        p.num_infraestructura_petrolera !== null &&
        p.establecimientos_por_10k_hab !== null &&
        p.cluster_kmeans !== null
    )
    .map((p) => ({
      x: p.num_infraestructura_petrolera,
      y: p.establecimientos_por_10k_hab || 0,
      name: p.nombre_parroquia,
      cluster: p.cluster_kmeans || 0,
      provincia: p.nombre_provincia,
    }))

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Análisis de la Paradoja Extractivista
              </h1>
              <p className="text-sm text-white/60 mt-0.5">
                Estadísticas descriptivas y patrones territoriales — Ecuador
              </p>
            </div>
          </div>

          {/* Animated divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-4"
          />

          <p className="text-sm text-white/50 max-w-2xl leading-relaxed">
            Análisis geoespacial que revela la relación inversa entre la presencia de
            infraestructura petrolera y el acceso a servicios de salud en las parroquias
            ecuatorianas, con especial atención a las comunidades afroecuatorianas.
          </p>
        </div>
      </motion.div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Brecha de Acceso"
          value={loadingParroquias ? "..." : `-${diferenciaAcceso.toFixed(1)}%`}
          subtitle="Menos acceso en zonas petroleras"
          icon={<TrendingDown className="w-4 h-4" />}
          trend="down"
          trendValue="significativo"
          color="red"
          delay={0}
        />
        <StatCard
          title="Est. Salud (Sin Petróleo)"
          value={loadingParroquias ? "..." : avgEstabSinPetroleo.toFixed(1)}
          subtitle="por 10k habitantes"
          icon={<Heart className="w-4 h-4" />}
          color="emerald"
          delay={0.1}
        />
        <StatCard
          title="Est. Salud (Con Petróleo)"
          value={loadingParroquias ? "..." : avgEstabConPetroleo.toFixed(1)}
          subtitle="por 10k habitantes"
          icon={<Flame className="w-4 h-4" />}
          color="amber"
          delay={0.2}
        />
        <StatCard
          title="Parroquias Analizadas"
          value={loadingParroquias ? "..." : metrics.totalParroquias}
          subtitle={`${metrics.conPetroleo} con petróleo`}
          icon={<MapPin className="w-4 h-4" />}
          color="blue"
          delay={0.3}
        />
      </div>

      {/* Main Charts Section — Matching Reference Image Layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-foreground">
            Visualización de la Paradoja
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-3" />
        </div>

        {/* Stacked layout — one chart per row for better readability */}
        <div className="space-y-8">
          {/* Panel 1: Scatter Plot — Petróleo vs Salud */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ScatterPlotParadox data={scatterDataEnhanced} />
          </motion.div>

          {/* Panel 2: Box Plot — Acceso a Salud por Cluster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <BoxPlotCluster data={parroquias} />
          </motion.div>

          {/* Panel 3: Grouped Bar — Paradoja */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <ParadoxBarChart data={clusters} />
          </motion.div>
        </div>
      </motion.div>

      {/* Cluster Analysis Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-bold text-foreground">
            Caracterización de Clusters
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingClusters
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-border bg-card p-6"
                  >
                    <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                    <div className="h-8 bg-muted rounded w-1/2 mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-muted/50 rounded" />
                      <div className="h-3 bg-muted/50 rounded w-5/6" />
                      <div className="h-3 bg-muted/50 rounded w-4/6" />
                    </div>
                  </div>
                ))
            : clusters
                .sort((a, b) => a.cluster_kmeans - b.cluster_kmeans)
                .map((cluster, i) => {
                  const clusterColor = getClusterColor(cluster.cluster_kmeans)
                  const isHighRisk =
                    cluster.densidad_petroleo_mean > 1 &&
                    cluster.estab_10k_mean < 5

                  return (
                    <motion.div
                      key={cluster.cluster_kmeans}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className={`relative overflow-hidden rounded-2xl border bg-card p-5 transition-shadow duration-300 hover:shadow-lg ${
                        isHighRisk
                          ? "border-red-200 dark:border-red-800 shadow-red-100/50 dark:shadow-red-900/30"
                          : "border-border"
                      }`}
                    >
                      {/* Color accent bar */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                        style={{ backgroundColor: clusterColor }}
                      />

                      {/* High risk badge */}
                      {isHighRisk && (
                        <div className="absolute top-3 right-3">
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-1 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            Riesgo
                          </span>
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex items-center gap-2.5 mb-4 mt-1">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: clusterColor }}
                        >
                          C{cluster.cluster_kmeans}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">
                            {getClusterLabel(cluster.cluster_kmeans)}
                          </h3>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {cluster.n_parroquias} parroquias
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Users className="w-3 h-3" />
                            Población
                          </span>
                          <span className="text-xs font-bold text-foreground">
                            {formatNumber(cluster.pob_total, 0)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Users className="w-3 h-3" />
                            % Afro
                          </span>
                          <span className="text-xs font-bold text-foreground">
                            {formatPercent(cluster.pct_afro_mean, 1)}
                          </span>
                        </div>

                        {/* Health access bar */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Heart className="w-3 h-3 text-emerald-500" />
                              Est/10k hab
                            </span>
                            <span className="text-xs font-bold text-emerald-600">
                              {cluster.estab_10k_mean.toFixed(1)}
                            </span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(
                                  (cluster.estab_10k_mean / 15) * 100,
                                  100
                                )}%`,
                              }}
                              transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                            />
                          </div>
                        </div>

                        {/* Petroleum density bar */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Flame className="w-3 h-3 text-red-500" />
                              Densidad Petróleo
                            </span>
                            <span className="text-xs font-bold text-red-600">
                              {cluster.densidad_petroleo_mean.toFixed(2)}
                            </span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(
                                  (cluster.densidad_petroleo_mean / 7) * 100,
                                  100
                                )}%`,
                              }}
                              transition={{ delay: 1.1 + i * 0.1, duration: 0.8 }}
                              className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600"
                            />
                          </div>
                        </div>

                        {/* Infrastructure count */}
                        <div className="flex justify-between items-center pt-2 border-t border-border/50">
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Droplets className="w-3 h-3" />
                            Infraestructura
                          </span>
                          <span className="text-xs font-bold text-foreground">
                            {formatNumber(cluster.n_infraestructura, 0)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
        </div>
      </motion.div>

      {/* Summary Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-muted/50 via-card to-muted/50 border border-border p-6"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Hallazgo Principal
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Los datos revelan una{" "}
            <span className="font-semibold text-red-600">
              correlación negativa
            </span>{" "}
            entre la presencia de infraestructura petrolera y el acceso a servicios de
            salud. Las parroquias con mayor actividad extractiva (Cluster 3) presentan
            en promedio{" "}
            <span className="font-semibold text-red-600">
              {clusters.length > 0
                ? clusters
                    .find((c) => c.cluster_kmeans === 3)
                    ?.estab_10k_mean.toFixed(1)
                : "..."}{" "}
              establecimientos por 10k hab
            </span>
            , frente a{" "}
            <span className="font-semibold text-emerald-600">
              {clusters.length > 0
                ? clusters
                    .find((c) => c.cluster_kmeans === 0)
                    ?.estab_10k_mean.toFixed(1)
                : "..."}{" "}
              en zonas sin petróleo
            </span>
            . Esta paradoja extractivista evidencia una desigualdad territorial
            estructural que afecta desproporcionadamente a las comunidades más
            vulnerables.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
