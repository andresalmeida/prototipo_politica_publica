"use client"

import { useMemo } from "react"
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ErrorBar,
  Cell,
  Scatter,
  ZAxis,
  Label,
} from "recharts"
import { motion } from "framer-motion"
import { BoxSelect, Activity } from "lucide-react"

interface ParroquiaData {
  establecimientos_por_10k_hab: number | null
  cluster_kmeans: number | null
}

interface BoxPlotClusterProps {
  data: ParroquiaData[]
}

interface BoxStats {
  cluster: string
  clusterNum: number
  min: number
  q1: number
  median: number
  q3: number
  max: number
  mean: number
  outliers: number[]
  iqr: number
  whiskerLow: number
  whiskerHigh: number
  color: string
}

function quantile(arr: number[], q: number): number {
  const sorted = [...arr].sort((a, b) => a - b)
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  }
  return sorted[base]
}

const clusterColors: Record<number, string> = {
  0: "#6366f1", // Indigo
  1: "#ef4444", // Red
  2: "#10b981", // Emerald
  3: "#f59e0b", // Amber
}

const clusterBgColors: Record<number, string> = {
  0: "rgba(99, 102, 241, 0.15)",
  1: "rgba(239, 68, 68, 0.15)",
  2: "rgba(16, 185, 129, 0.15)",
  3: "rgba(245, 158, 11, 0.15)",
}

export function BoxPlotCluster({ data }: BoxPlotClusterProps) {
  const boxData = useMemo(() => {
    const clusters = [0, 1, 2, 3]
    return clusters.map((c) => {
      const values = data
        .filter(
          (d) =>
            d.cluster_kmeans === c &&
            d.establecimientos_por_10k_hab !== null &&
            d.establecimientos_por_10k_hab !== undefined
        )
        .map((d) => d.establecimientos_por_10k_hab as number)
        .sort((a, b) => a - b)

      if (values.length === 0) {
        return {
          cluster: `C${c}`,
          clusterNum: c,
          min: 0,
          q1: 0,
          median: 0,
          q3: 0,
          max: 0,
          mean: 0,
          outliers: [],
          iqr: 0,
          whiskerLow: 0,
          whiskerHigh: 0,
          color: clusterColors[c],
        }
      }

      const q1 = quantile(values, 0.25)
      const med = quantile(values, 0.5)
      const q3 = quantile(values, 0.75)
      const iqr = q3 - q1
      const whiskerLow = Math.max(values[0], q1 - 1.5 * iqr)
      const whiskerHigh = Math.min(values[values.length - 1], q3 + 1.5 * iqr)
      const outliers = values.filter((v) => v < whiskerLow || v > whiskerHigh)
      const mean = values.reduce((s, v) => s + v, 0) / values.length

      return {
        cluster: `C${c}`,
        clusterNum: c,
        min: values[0],
        q1,
        median: med,
        q3,
        max: values[values.length - 1],
        mean,
        outliers,
        iqr,
        whiskerLow,
        whiskerHigh,
        color: clusterColors[c],
      } as BoxStats
    })
  }, [data])

  // Custom box plot rendering using composed chart
  // We'll render boxes as stacked bars with error bars for whiskers
  const chartData = boxData.map((b) => ({
    name: b.cluster,
    // The "base" is from 0 to q1
    base: b.q1,
    // The "box" is from q1 to q3
    box: b.q3 - b.q1,
    // Median line position
    median: b.median,
    mean: b.mean,
    // Whisker data
    whiskerLow: b.whiskerLow,
    whiskerHigh: b.whiskerHigh,
    q1: b.q1,
    q3: b.q3,
    min: b.min,
    max: b.max,
    outliers: b.outliers,
    color: b.color,
    clusterNum: b.clusterNum,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6"
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-blue-400/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            Acceso a Salud por Cluster
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Distribución de establecimientos de salud por 10k habitantes
          </p>
        </div>
      </div>

      {/* Custom Box Plot visualization */}
      <div className="h-[420px] relative z-10">
        <div className="flex h-full items-end justify-around px-8 pb-12 pt-4 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-4 bottom-12 flex flex-col justify-between text-xs text-gray-400">
            {[70, 60, 50, 40, 30, 20, 10, 0].map((v) => (
              <span key={v} className="text-right w-6">{v}</span>
            ))}
          </div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500 font-medium whitespace-nowrap">
            Establecimientos por 10k hab
          </div>

          {/* Grid lines */}
          <div className="absolute left-8 right-4 top-4 bottom-12">
            {[0, 10, 20, 30, 40, 50, 60, 70].map((v) => (
              <div
                key={v}
                className="absolute w-full border-t border-gray-100"
                style={{ bottom: `${(v / 70) * 100}%` }}
              />
            ))}
          </div>

          {/* Box plots */}
          {boxData.map((box, i) => {
            const scale = (v: number) => Math.min((v / 70) * 100, 100)
            return (
              <motion.div
                key={box.cluster}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                className="relative flex flex-col items-center z-10"
                style={{ width: "18%", height: "100%", originY: 1 }}
              >
                {/* Outliers */}
                {box.outliers.map((o, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + j * 0.05 }}
                    className="absolute w-2 h-2 rounded-full border-2"
                    style={{
                      borderColor: box.color,
                      backgroundColor: "transparent",
                      bottom: `${scale(o)}%`,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                ))}

                {/* Upper whisker line */}
                <div
                  className="absolute w-px"
                  style={{
                    backgroundColor: "#374151",
                    bottom: `${scale(box.q3)}%`,
                    height: `${scale(box.whiskerHigh) - scale(box.q3)}%`,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
                {/* Upper whisker cap */}
                <div
                  className="absolute h-px"
                  style={{
                    backgroundColor: "#374151",
                    bottom: `${scale(box.whiskerHigh)}%`,
                    width: "30%",
                    left: "35%",
                  }}
                />

                {/* Lower whisker line */}
                <div
                  className="absolute w-px"
                  style={{
                    backgroundColor: "#374151",
                    bottom: `${scale(box.whiskerLow)}%`,
                    height: `${scale(box.q1) - scale(box.whiskerLow)}%`,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
                {/* Lower whisker cap */}
                <div
                  className="absolute h-px"
                  style={{
                    backgroundColor: "#374151",
                    bottom: `${scale(box.whiskerLow)}%`,
                    width: "30%",
                    left: "35%",
                  }}
                />

                {/* Box (IQR) */}
                <div
                  className="absolute rounded-md border-2 transition-all duration-300"
                  style={{
                    backgroundColor: clusterBgColors[box.clusterNum],
                    borderColor: box.color,
                    bottom: `${scale(box.q1)}%`,
                    height: `${scale(box.q3) - scale(box.q1)}%`,
                    width: "60%",
                    left: "20%",
                  }}
                />

                {/* Median line */}
                <div
                  className="absolute"
                  style={{
                    backgroundColor: "#1f2937",
                    bottom: `${scale(box.median)}%`,
                    height: "2px",
                    width: "60%",
                    left: "20%",
                  }}
                />

                {/* Mean marker (triangle) */}
                <div
                  className="absolute"
                  style={{
                    bottom: `${scale(box.mean)}%`,
                    left: "50%",
                    transform: "translateX(-50%) translateY(50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderBottom: `8px solid ${box.color}`,
                  }}
                />

                {/* Cluster label */}
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-semibold"
                  style={{ color: box.color }}
                >
                  {box.cluster}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 rounded-sm border-2 border-gray-400 bg-gray-100" />
          <span>IQR (Q1-Q3)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-gray-800" />
          <span>Mediana</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-0 h-0" style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderBottom: "6px solid #6366f1" }} />
          <span>Media</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full border-2 border-gray-400" />
          <span>Outliers</span>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {boxData.map((box) => (
          <motion.div
            key={box.cluster}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + box.clusterNum * 0.1 }}
            className="text-center p-2 rounded-lg"
            style={{ backgroundColor: clusterBgColors[box.clusterNum] }}
          >
            <div className="text-xs font-semibold" style={{ color: box.color }}>
              {box.cluster}
            </div>
            <div className="text-lg font-bold text-gray-900">
              {box.median.toFixed(1)}
            </div>
            <div className="text-[10px] text-gray-500">mediana</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
