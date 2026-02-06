"use client"

import { useMemo } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  Label,
} from "recharts"
import { motion } from "framer-motion"
import { AlertTriangle, Flame, Heart } from "lucide-react"
import type { ClusterStats } from "../../types"

interface ParadoxBarChartProps {
  data: ClusterStats[]
}

export function ParadoxBarChart({ data }: ParadoxBarChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return []

    // Normalize petroleum density to make it visually comparable
    const maxDensity = Math.max(...data.map((d) => d.densidad_petroleo_mean))
    const maxEstab = Math.max(...data.map((d) => d.estab_10k_mean))
    const normFactor = maxEstab > 0 ? maxDensity / maxEstab : 1

    return data
      .sort((a, b) => a.cluster_kmeans - b.cluster_kmeans)
      .map((cluster) => ({
        name: `C${cluster.cluster_kmeans}`,
        clusterNum: cluster.cluster_kmeans,
        densidadPetrolera: cluster.densidad_petroleo_mean,
        // Normalize to same scale as estab for visual comparison
        densidadNorm:
          maxDensity > 0
            ? (cluster.densidad_petroleo_mean / maxDensity) * 20
            : 0,
        establecimientos: cluster.estab_10k_mean,
        nParroquias: cluster.n_parroquias,
        label: getClusterShortLabel(cluster.cluster_kmeans),
      }))
  }, [data])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-white/5 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-900/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6"
    >
      {/* Decorative gradient orb */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-red-400/20 to-amber-400/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Paradoja: Petróleo Alto = Salud Baja
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Comparación de densidad petrolera vs acceso a salud por cluster
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[420px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            barGap={4}
            barCategoryGap="25%"
          >
            <defs>
              {/* Gradient for petroleum bars */}
              <linearGradient id="petroGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#991b1b" stopOpacity={0.7} />
              </linearGradient>
              {/* Gradient for health bars */}
              <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#065f46" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 13, fontWeight: 600, fill: "#374151" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            >
              <Label
                value="Cluster"
                offset={-20}
                position="insideBottom"
                style={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
              />
            </XAxis>
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            >
              <Label
                value="Valor"
                angle={-90}
                position="insideLeft"
                offset={5}
                style={{ fontSize: 12, fill: "#374151", fontWeight: 500 }}
              />
            </YAxis>
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload
                  return (
                    <div className="bg-card/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-border text-sm">
                      <p className="font-bold text-foreground mb-2">
                        Cluster {d.clusterNum} — {d.label}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Flame className="w-3.5 h-3.5 text-red-500" />
                          <span className="text-muted-foreground">Densidad Petrolera:</span>
                          <span className="font-semibold text-red-600">
                            {d.densidadPetrolera.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-muted-foreground">Est. Salud/10k:</span>
                          <span className="font-semibold text-emerald-600">
                            {d.establecimientos.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                          <span className="text-muted-foreground">Parroquias:</span>
                          <span className="font-medium">{d.nParroquias}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey="densidadNorm"
              name="Densidad Petrolera (norm)"
              fill="url(#petroGradient)"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
              animationBegin={200}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`petro-${index}`}
                  fill="url(#petroGradient)"
                  opacity={0.9}
                />
              ))}
            </Bar>
            <Bar
              dataKey="establecimientos"
              name="Establecimientos/10k hab"
              fill="url(#healthGradient)"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
              animationBegin={400}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`health-${index}`}
                  fill="url(#healthGradient)"
                  opacity={0.9}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded-sm bg-gradient-to-b from-red-600 to-red-800" />
          <span className="text-muted-foreground font-medium">Densidad Petrolera (norm)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded-sm bg-gradient-to-b from-emerald-600 to-emerald-800" />
          <span className="text-muted-foreground font-medium">Establecimientos/10k hab</span>
        </div>
      </div>

      {/* Insight callout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 p-3 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/50 dark:to-amber-950/50 border border-red-100 dark:border-red-800"
      >
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-red-700">C3 (Alta Actividad Petrolera)</span>{" "}
            muestra la mayor densidad de infraestructura pero el{" "}
            <span className="font-semibold text-red-700">menor acceso a salud</span>,
            evidenciando la paradoja extractivista.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function getClusterShortLabel(cluster: number): string {
  const labels: Record<number, string> = {
    0: "Sin Petróleo",
    1: "Petrolero Moderado",
    2: "Com. Afroecuatorianas",
    3: "Alta Act. Petrolera",
  }
  return labels[cluster] || "Sin Clasificar"
}
