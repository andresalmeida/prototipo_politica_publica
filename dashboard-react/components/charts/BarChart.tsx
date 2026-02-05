"use client"

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import type { ClusterStats } from "../../types"
import { getClusterColor, getClusterLabel } from "../../lib/utils"

interface BarChartProps {
  data: ClusterStats[]
}

export function BarChart({ data }: BarChartProps) {
  const chartData = data.map((cluster) => ({
    name: getClusterLabel(cluster.cluster_kmeans),
    cluster: cluster.cluster_kmeans,
    parroquias: cluster.n_parroquias,
    poblacion: cluster.pob_total / 1000, // Convert to thousands
    afro: cluster.pob_afro / 1000,
    establecimientos: cluster.n_establecimientos,
    infraestructura: cluster.n_infraestructura,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas por Cluster</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
                        <p className="font-semibold">{label}</p>
                        <div className="mt-2 space-y-1">
                          <p>Parroquias: {payload[0].payload.parroquias}</p>
                          <p>Población: {payload[0].payload.poblacion.toFixed(1)}K</p>
                          <p>Población Afro: {payload[0].payload.afro.toFixed(1)}K</p>
                          <p>Establecimientos: {payload[0].payload.establecimientos}</p>
                          <p>Infraestructura: {payload[0].payload.infraestructura}</p>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Bar
                dataKey="parroquias"
                name="Parroquias"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="establecimientos"
                name="Establecimientos"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="infraestructura"
                name="Infraestructura Petrolera"
                fill="#dc2626"
                radius={[4, 4, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}