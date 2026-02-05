"use client"

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { getClusterColor } from "../../lib/utils"

interface CorrelationChartProps {
  data: Array<{
    x: number
    y: number
    name: string
    cluster: number
    provincia: string
  }>
}

export function CorrelationChart({ data }: CorrelationChartProps) {
  // Calculate correlation
  const n = data.length
  const sumX = data.reduce((sum, d) => sum + d.x, 0)
  const sumY = data.reduce((sum, d) => sum + d.y, 0)
  const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0)
  const sumX2 = data.reduce((sum, d) => sum + d.x * d.x, 0)
  const sumY2 = data.reduce((sum, d) => sum + d.y * d.y, 0)

  const correlation =
    (n * sumXY - sumX * sumY) /
    Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

  // Trend line
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  const trendData = [
    { x: 0, y: intercept },
    { x: Math.max(...data.map((d) => d.x)), y: slope * Math.max(...data.map((d) => d.x)) + intercept },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Correlación: Infraestructura vs Acceso a Salud</span>
          <span
            className={`text-sm font-normal px-3 py-1 rounded-full ${
              Math.abs(correlation) > 0.5
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            r = {correlation.toFixed(3)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                dataKey="x"
                name="Densidad Petróleo"
                unit="/km²"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Establecimientos"
                unit="/10k hab"
                tick={{ fontSize: 12 }}
              />
              <ZAxis type="number" dataKey="cluster" range={[50, 50]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-muted-foreground">{data.provincia}</p>
                        <div className="mt-2 space-y-1">
                          <p>Densidad Petróleo: {data.x.toFixed(2)}/km²</p>
                          <p>Est. Salud: {data.y.toFixed(2)}/10k hab</p>
                          <p>Cluster: {data.cluster}</p>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <ReferenceLine
                segment={trendData}
                stroke="#888"
                strokeDasharray="5 5"
              />
              {Array.from(new Set(data.map((d) => d.cluster))).map((cluster) => (
                <Scatter
                  key={cluster}
                  name={`Cluster ${cluster}`}
                  data={data.filter((d) => d.cluster === cluster)}
                  fill={getClusterColor(cluster)}
                  opacity={0.7}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Las parroquias con mayor densidad de infraestructura petrolera tienden a tener
          menor acceso a servicios de salud
        </p>
      </CardContent>
    </Card>
  )
}