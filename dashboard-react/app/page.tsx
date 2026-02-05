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
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { Header } from "../components/layout/Header"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { AnimatedCard, StatCard } from "../components/ui/animated-card"
import { StatsSkeleton } from "../components/ui/skeleton"
import { useParroquias, useClusterStats, useMetrics } from "../hooks/useData"
import { formatNumber, formatPercent } from "../lib"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

export default function HomePage() {
  const { data: parroquias, loading: loadingParroquias } = useParroquias()
  const { data: clusters, loading: loadingClusters } = useClusterStats()
  const metrics = useMetrics(parroquias)

  return (
    <div className="space-y-8 pb-8">
      <Header
        title="Paradoja Extractivista"
        subtitle="Análisis geoespacial de la relación entre infraestructura petrolera, acceso a salud y población afroecuatoriana en Ecuador"
        icon={<Droplets className="w-8 h-8" />}
        gradient="blue"
      />

      {/* Key Insight - Premium Alert Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-amber-500" />
        <motion.div
          animate={{
            background: [
              "linear-gradient(45deg, rgba(239,68,68,0.3) 0%, rgba(249,115,22,0.3) 100%)",
              "linear-gradient(45deg, rgba(249,115,22,0.3) 0%, rgba(239,68,68,0.3) 100%)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-20, -100],
                x: [0, (i - 1) * 30],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 1.3,
                ease: "easeOut",
              }}
              className="absolute bottom-0 left-1/4 w-2 h-2 rounded-full bg-white/30"
              style={{ left: `${25 + i * 25}%` }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
          >
            <AlertTriangle className="w-8 h-8" />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span className="text-sm font-semibold text-amber-100 uppercase tracking-wider">
                Hallazgo Clave
              </span>
            </div>
            <p className="text-lg lg:text-xl text-white/95 leading-relaxed max-w-3xl">
              Las parroquias con actividad petrolera tienen{" "}
              <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg">
                33% menos acceso
              </span>{" "}
              a servicios de salud en comparación con parroquias sin actividad
              extractiva. Esta brecha evidencia la paradoja extractivista en el
              territorio ecuatoriano.
            </p>
          </div>
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="text-center lg:text-right"
          >
            <div className="text-5xl font-bold tracking-tight">-33%</div>
            <div className="text-white/80 text-sm font-medium">Acceso a salud</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Metrics Grid with new Stat Cards */}
      {loadingParroquias ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Parroquias"
            value={formatNumber(metrics.totalParroquias, 0)}
            subtitle={`${metrics.conPetroleo} con actividad petrolera`}
            icon={<MapPin className="w-6 h-6 text-white" />}
            gradient="blue"
            delay={0}
          />
          <StatCard
            title="Población Total"
            value={formatNumber(metrics.totalPoblacion, 0)}
            subtitle={`${formatPercent(metrics.pctAfro, 1)} población afro`}
            icon={<Users className="w-6 h-6 text-white" />}
            gradient="purple"
            delay={0.1}
          />
          <StatCard
            title="Establecimientos de Salud"
            value={formatNumber(metrics.totalEstablecimientos, 0)}
            subtitle={`${(metrics.totalEstablecimientos / (metrics.totalPoblacion / 10000)).toFixed(1)} por 10k habitantes`}
            icon={<HeartPulse className="w-6 h-6 text-white" />}
            gradient="green"
            delay={0.2}
          />
          <StatCard
            title="Infraestructura Petrolera"
            value={formatNumber(metrics.totalInfraestructura, 0)}
            subtitle="Pozos y sitios contaminados"
            icon={<Droplets className="w-6 h-6 text-white" />}
            gradient="orange"
            delay={0.3}
          />
        </div>
      )}

      {/* Navigation Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Link href="/analisis">
            <AnimatedCard className="h-full group" hover>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                    Analytics
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  Análisis General
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  Estadísticas descriptivas, correlaciones y patrones
                  territoriales entre variables clave.
                </p>
                <Button variant="ghost" className="group-hover:translate-x-2 transition-transform">
                  Explorar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </AnimatedCard>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/mapas">
            <AnimatedCard className="h-full group" hover>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                    Geoespacial
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-red-600 transition-colors">
                  Mapas y Territorios
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  Visualización geoespacial avanzada con clustering territorial y
                  control de capas interactivo.
                </p>
                <Button variant="ghost" className="group-hover:translate-x-2 transition-transform">
                  Explorar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </AnimatedCard>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/explorador">
            <AnimatedCard className="h-full group" hover>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingDown className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                    Datos
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">
                  Explorador de Datos
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  Análisis detallado por parroquia con filtros avanzados y
                  comparativas territoriales.
                </p>
                <Button variant="ghost" className="group-hover:translate-x-2 transition-transform">
                  Explorar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </AnimatedCard>
          </Link>
        </motion.div>
      </motion.div>

      {/* Clusters Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Resumen por Clusters</h2>
          <Badge variant="outline" className="text-muted-foreground">
            K-Means Analysis
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingClusters
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <AnimatedCard key={i}>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                      <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-muted rounded w-full animate-pulse" />
                    </div>
                  </AnimatedCard>
                ))
            : clusters.map((cluster, index) => (
                <motion.div
                  key={cluster.cluster_kmeans}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <AnimatedCard className="h-full">
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                          className="w-4 h-4 rounded-full shadow-lg"
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
                        <span className="font-semibold text-lg">
                          Cluster {cluster.cluster_kmeans}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">Parroquias</span>
                          <span className="font-bold text-lg">{cluster.n_parroquias}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">Población</span>
                          <span className="font-bold">{formatNumber(cluster.pob_total, 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground">Población Afro</span>
                          <span className="font-bold text-emerald-600">
                            {formatPercent(cluster.pct_afro_mean, 1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
        </div>
      </motion.div>
    </div>
  )
}
