"use client"

import { useMemo } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Line,
} from "recharts"
import { motion } from "framer-motion"
import { TrendingDown, Info } from "lucide-react"

interface ScatterDataPoint {
  x: number
  y: number
  name: string
  cluster: number
  provincia: string
}

interface ScatterPlotParadoxProps {
  data: ScatterDataPoint[]
}

function linearRegression(data: { x: number; y: number }[]) {
  const n = data.length
  if (n === 0) return { slope: 0, intercept: 0, r: 0, p: 1 }

  const sumX = data.reduce((s, d) => s + d.x, 0)
  const sumY = data.reduce((s, d) => s + d.y, 0)
  const sumXY = data.reduce((s, d) => s + d.x * d.y, 0)
  const sumX2 = data.reduce((s, d) => s + d.x * d.x, 0)
  const sumY2 = data.reduce((s, d) => s + d.y * d.y, 0)

  const denom = n * sumX2 - sumX * sumX
  const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0
  const intercept = (sumY - slope * sumX) / n

  // Pearson correlation
  const numerator = n * sumXY - sumX * sumY
  const denomR = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  )
  const r = denomR !== 0 ? numerator / denomR : 0

  // t-statistic for p-value approximation
  const t = r * Math.sqrt((n - 2) / (1 - r * r))
  // Approximate p-value using t-distribution (two-tailed)
  const df = n - 2
  const p = approximatePValue(Math.abs(t), df)

  return { slope, intercept, r, p }
}

function approximatePValue(t: number, df: number): number {
  // Simple approximation of two-tailed p-value
  const x = df / (df + t * t)
  // Using a rough beta function approximation
  if (t === 0) return 1
  if (df <= 0) return 1
  // For large df, use normal approximation
  if (df > 100) {
    const z = t
    return 2 * (1 - normalCDF(z))
  }
  // Rough approximation
  return 2 * (1 - normalCDF(t * Math.sqrt(1 - 1 / (4 * df))))
}

function normalCDF(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const sign = x < 0 ? -1 : 1
  x = Math.abs(x) / Math.sqrt(2)
  const t = 1.0 / (1.0 + p * x)
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  return 0.5 * (1.0 + sign * y)
}

export function ScatterPlotParadox({ data }: ScatterPlotParadoxProps) {
  const { regression, trendLine, maxX, maxY } = useMemo(() => {
    if (data.length === 0)
      return {
        regression: { slope: 0, intercept: 0, r: 0, p: 1 },
        trendLine: [],
        maxX: 100,
        maxY: 70,
      }

    const reg = linearRegression(data)
    const mX = Math.max(...data.map((d) => d.x))
    const mY = Math.max(...data.map((d) => d.y))

    // Generate trend line points
    const steps = 50
    const trend = Array.from({ length: steps + 1 }, (_, i) => {
      const xVal = (mX / steps) * i
      return {
        x: xVal,
        y: Math.max(0, reg.slope * xVal + reg.intercept),
      }
    })

    return { regression: reg, trendLine: trend, maxX: mX, maxY: mY }
  }, [data])

  const clusterColors: Record<number, string> = {
    0: "rgba(99, 149, 237, 0.6)",  // Cornflower blue
    1: "rgba(239, 68, 68, 0.5)",   // Red
    2: "rgba(16, 185, 129, 0.5)",  // Green
    3: "rgba(245, 158, 11, 0.5)",  // Orange
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-white/5 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-900/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6"
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            Paradoja Extractivista: Petróleo vs Salud
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Correlación negativa entre infraestructura petrolera y acceso a salud
          </p>
        </div>

        {/* Stats badges */}
        <div className="flex gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-mono font-semibold"
          >
            r = {regression.r.toFixed(3)}
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-mono font-semibold"
          >
            p = {regression.p.toFixed(4)}
          </motion.div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[420px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 40, left: 20 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.06)"
              vertical={false}
            />
            <XAxis
              type="number"
              dataKey="x"
              name="Infraestructura Petrolera"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              domain={[0, "auto"]}
            >
              <Label
                value="Número de Infraestructura Petrolera"
                offset={-20}
                position="insideBottom"
                style={{ fontSize: 12, fill: "#374151", fontWeight: 500 }}
              />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              name="Establecimientos"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              domain={[0, "auto"]}
            >
              <Label
                value="Establecimientos por 10k hab"
                angle={-90}
                position="insideLeft"
                offset={5}
                style={{ fontSize: 12, fill: "#374151", fontWeight: 500 }}
              />
            </YAxis>
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: "#94a3b8" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload
                  return (
                    <div className="bg-card/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-border text-sm">
                      <p className="font-bold text-foreground">{d.name}</p>
                      <p className="text-muted-foreground text-xs">{d.provincia}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Infraestructura:</span>
                          <span className="font-semibold">{d.x}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Est. Salud/10k:</span>
                          <span className="font-semibold">{d.y.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Cluster:</span>
                          <span className="font-semibold">C{d.cluster}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />

            {/* Trend line */}
            <Scatter
              data={trendLine}
              fill="none"
              line={{ stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "8 4" }}
              shape={(() => <circle r={0} />) as any}
              legendType="none"
              isAnimationActive={false}
            />

            {/* Data points by cluster */}
            {[0, 1, 2, 3].map((cluster) => {
              const clusterData = data.filter((d) => d.cluster === cluster)
              if (clusterData.length === 0) return null
              return (
                <Scatter
                  key={cluster}
                  name={`C${cluster}`}
                  data={clusterData}
                  fill={clusterColors[cluster]}
                  stroke={clusterColors[cluster]?.replace("0.6", "1").replace("0.5", "1")}
                  strokeWidth={1}
                  r={5}
                />
              )
            })}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-red-500" style={{ borderTop: "2px dashed #ef4444" }} />
          <span>Tendencia</span>
        </div>
        {[
          { c: 0, label: "C0", color: "#6395ed" },
          { c: 1, label: "C1", color: "#ef4444" },
          { c: 2, label: "C2", color: "#10b981" },
          { c: 3, label: "C3", color: "#f59e0b" },
        ].map(({ c, label, color }) => (
          <div key={c} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Insight callout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-100 dark:border-blue-800"
      >
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Cada punto representa una parroquia. La{" "}
            <span className="font-semibold text-red-600">línea de tendencia descendente</span>{" "}
            confirma que a mayor infraestructura petrolera, menor acceso a salud.
            El coeficiente <span className="font-semibold text-gray-800">r = {regression.r.toFixed(3)}</span>{" "}
            indica una correlación negativa entre ambas variables.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
