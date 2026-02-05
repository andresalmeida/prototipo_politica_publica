# Opción 2: Migración a React + Mapbox GL

## Resumen
Dashboard de clase mundial con arquitectura moderna, mapas avanzados con capas múltiples, y experiencia de usuario premium.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js/React)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    UI Layer                              │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │   │
│  │  │   Tailwind   │ │  Radix UI    │ │  Framer Motion   │ │   │
│  │  │   (Estilos)  │ │  (Headless)  │ │  (Animaciones)   │ │   │
│  │  └──────────────┘ └──────────────┘ └──────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 Visualization Layer                      │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │   │
│  │  │  Mapbox GL   │ │  Recharts    │ │  Visx/D3         │ │   │
│  │  │  (Mapas)     │ │  (Charts)    │ │  (Custom)        │ │   │
│  │  └──────────────┘ └──────────────┘ └──────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  State Management                        │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │   │
│  │  │  Zustand     │ │  React Query │ │  URL Sync        │ │   │
│  │  │  (App State) │ │  (Server)    │ │  (Shareable)     │ │   │
│  │  └──────────────┘ └──────────────┘ └──────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API Layer                             │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │   │
│  │  │  REST API    │ │  WebSocket   │ │  GeoJSON Tiles   │ │   │
│  │  │  (CRUD)      │ │  (Realtime)  │ │  (Vector Tiles)  │ │   │
│  │  └──────────────┘ └──────────────┘ └──────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Data Layer                              │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │   │
│  │  │  PostGIS     │ │  Pandas      │ │  GeoPandas       │ │   │
│  │  │  (Spatial)   │ │  (Analysis)  │ │  (Processing)    │ │   │
│  │  └──────────────┘ └──────────────┘ └──────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Mapbox GL: Capas Avanzadas

### Configuración de Capas

```typescript
// types/map.ts
interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  type: 'fill' | 'line' | 'circle' | 'heatmap' | 'symbol';
}

// config/layers.ts
export const LAYERS_CONFIG = {
  // Capa base: Parroquias coloreadas por cluster
  parroquias: {
    id: 'parroquias-fill',
    type: 'fill',
    source: 'parroquias',
    paint: {
      'fill-color': [
        'match',
        ['get', 'cluster_kmeans'],
        0, '#3b82f6',  // Azul - Sin petróleo
        1, '#ef4444',  // Rojo - Alta actividad
        2, '#10b981',  // Verde - Moderada
        3, '#f59e0b',  // Naranja - Baja
        '#94a3b8'      // Gris - Sin cluster
      ],
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        5, 0.4,
        10, 0.7
      ],
      'fill-outline-color': '#ffffff'
    }
  },
  
  // Capa: Bordes de parroquias
  parroquiasLine: {
    id: 'parroquias-line',
    type: 'line',
    source: 'parroquias',
    paint: {
      'line-color': '#475569',
      'line-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        5, 0.5,
        12, 2
      ]
    }
  },
  
  // Capa: Infraestructura petrolera (puntos proporcionales)
  infraestructura: {
    id: 'infraestructura-circle',
    type: 'circle',
    source: 'infraestructura',
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'densidad_petroleo'],
        0, 4,
        50, 25
      ],
      'circle-color': '#dc2626',
      'circle-opacity': 0.7,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  },
  
  // Capa: Heatmap de salud
  saludHeatmap: {
    id: 'salud-heatmap',
    type: 'heatmap',
    source: 'salud',
    paint: {
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'establecimientos_10k'],
        0, 0,
        50, 1
      ],
      'heatmap-intensity': 1,
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(255, 255, 204, 0)',
        0.2, 'rgb(255, 255, 204)',
        0.4, 'rgb(199, 233, 180)',
        0.6, 'rgb(127, 205, 187)',
        0.8, 'rgb(65, 182, 196)',
        1, 'rgb(44, 127, 184)'
      ],
      'heatmap-radius': 30
    }
  }
};
```

### Componente Mapa Principal

```tsx
// components/Map/MapContainer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapStore } from '@/store/mapStore';
import { LayerControl } from './LayerControl';
import { Tooltip } from './Tooltip';

export function MapContainer() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { layers, setMapInstance, selectedFeature } = useMapStore();
  
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-78.1834, -1.8312],
      zoom: 6,
      pitch: 0,
      bearing: 0
    });

    // Agregar controles
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.current.addControl(
      new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'metric' }),
      'bottom-left'
    );

    // Cargar fuentes y capas
    map.current.on('load', () => {
      // Fuente: Parroquias GeoJSON
      map.current?.addSource('parroquias', {
        type: 'geojson',
        data: '/api/geojson/parroquias',
        promoteId: 'id_parroquia'
      });

      // Fuente: Infraestructura
      map.current?.addSource('infraestructura', {
        type: 'geojson',
        data: '/api/geojson/infraestructura',
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Agregar capas
      Object.values(LAYERS_CONFIG).forEach(layer => {
        map.current?.addLayer(layer);
      });

      // Eventos de interacción
      map.current?.on('mousemove', 'parroquias-fill', (e) => {
        if (e.features?.length) {
          setHoveredFeature(e.features[0]);
        }
      });

      map.current?.on('click', 'parroquias-fill', (e) => {
        if (e.features?.length) {
          const feature = e.features[0];
          // Fly to location
          map.current?.flyTo({
            center: e.lngLat,
            zoom: 10,
            duration: 1500
          });
          // Abrir panel lateral con detalles
          useMapStore.getState().setSelectedFeature(feature);
        }
      });
    });

    setMapInstance(map.current);

    return () => map.current?.remove();
  }, []);

  // Actualizar visibilidad de capas
  useEffect(() => {
    if (!map.current) return;
    
    layers.forEach(layer => {
      const visibility = layer.visible ? 'visible' : 'none';
      map.current?.setLayoutProperty(layer.id, 'visibility', visibility);
      map.current?.setPaintProperty(layer.id, `${layer.type}-opacity`, layer.opacity);
    });
  }, [layers]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Control de capas flotante */}
      <LayerControl className="absolute top-4 left-4 z-10" />
      
      {/* Tooltip en hover */}
      {hoveredFeature && (
        <Tooltip feature={hoveredFeature} />
      )}
      
      {/* Panel de detalles lateral */}
      {selectedFeature && (
        <FeaturePanel feature={selectedFeature} />
      )}
    </div>
  );
}
```

### Control de Capas UI

```tsx
// components/Map/LayerControl.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '@/store/mapStore';
import { Eye, EyeOff, Layers, ChevronDown } from 'lucide-react';

export function LayerControl({ className }: { className?: string }) {
  const { layers, toggleLayer, setLayerOpacity } = useMapStore();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-slate-600" />
          <span className="font-semibold text-slate-700">Capas</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Lista de capas */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {layers.map((layer) => (
                <div key={layer.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {layer.name}
                    </span>
                    <button
                      onClick={() => toggleLayer(layer.id)}
                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                      {layer.visible ? (
                        <Eye className="w-4 h-4 text-blue-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                  
                  {layer.visible && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={layer.opacity * 100}
                        onChange={(e) => setLayerOpacity(layer.id, Number(e.target.value) / 100)}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

---

## 📊 Visualizaciones de Datos

### Dashboard con Recharts

```tsx
// components/Charts/CorrelationChart.tsx
'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

interface DataPoint {
  infraestructura: number;
  salud_10k: number;
  cluster: number;
  nombre_parroquia: string;
}

const COLORS = {
  0: '#3b82f6',
  1: '#ef4444',
  2: '#10b981',
  3: '#f59e0b'
};

export function CorrelationChart({ data }: { data: DataPoint[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Correlación: Petróleo vs Salud
      </h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="infraestructura"
            name="Infraestructura Petrolera"
            stroke="#64748b"
          />
          <YAxis
            type="number"
            dataKey="salud_10k"
            name="Establecimientos/10k hab"
            stroke="#64748b"
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload?.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                    <p className="font-semibold text-slate-800">{data.nombre_parroquia}</p>
                    <p className="text-sm text-slate-600">
                      Infraestructura: {data.infraestructura}
                    </p>
                    <p className="text-sm text-slate-600">
                      Salud: {data.salud_10k.toFixed(2)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          
          {/* Línea de tendencia */}
          <ReferenceLine
            segment={[
              { x: 0, y: 10 },
              { x: 100, y: 5 }
            ]}
            stroke="#dc2626"
            strokeDasharray="5 5"
            label="Tendencia"
          />
          
          <Scatter name="Parroquias" data={data}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.cluster as keyof typeof COLORS]}
                fillOpacity={0.7}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
```

---

## 🎨 Sistema de Diseño

### Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta del dashboard
        cluster: {
          0: '#3b82f6', // Azul
          1: '#ef4444', // Rojo
          2: '#10b981', // Verde
          3: '#f59e0b', // Naranja
        },
        petroleo: '#dc2626',
        salud: '#059669',
        afro: '#7c3aed',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### Componentes Radix UI

```tsx
// components/ui/Tabs.tsx
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';

export const Tabs = TabsPrimitive.Root;

export const TabsList = motion(TabsPrimitive.List);
TabsList.defaultProps = {
  className: 'flex space-x-1 rounded-xl bg-slate-100 p-1',
};

export const TabsTrigger = motion(TabsPrimitive.Trigger);
TabsTrigger.defaultProps = {
  className: `
    flex-1 rounded-lg px-3 py-2 text-sm font-medium
    text-slate-600 hover:text-slate-900
    data-[state=active]:bg-white data-[state=active]:text-slate-900
    data-[state=active]:shadow-sm
    transition-all duration-200
  `,
};
```

---

## 📁 Estructura del Proyecto

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout con providers
│   ├── page.tsx                # Dashboard principal
│   ├── mapa/
│   │   └── page.tsx            # Página de mapas
│   ├── analisis/
│   │   └── page.tsx            # Análisis detallado
│   └── globals.css
├── components/
│   ├── Map/
│   │   ├── MapContainer.tsx
│   │   ├── LayerControl.tsx
│   │   ├── Tooltip.tsx
│   │   └── FeaturePanel.tsx
│   ├── Charts/
│   │   ├── CorrelationChart.tsx
│   │   ├── DistributionChart.tsx
│   │   └── ClusterChart.tsx
│   ├── UI/
│   │   ├── Card.tsx
│   │   ├── Metric.tsx
│   │   ├── Tabs.tsx
│   │   └── Button.tsx
│   └── Layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── Footer.tsx
├── hooks/
│   ├── useMap.ts
│   ├── useData.ts
│   └── useFilters.ts
├── store/
│   ├── mapStore.ts             # Zustand store
│   └── filterStore.ts
├── lib/
│   ├── api.ts                  # API client
│   ├── utils.ts
│   └── constants.ts
├── types/
│   ├── map.ts
│   ├── data.ts
│   └── api.ts
└── public/
    └── data/
        └── geojson/

backend/
├── app/
│   ├── main.py
│   ├── routers/
│   │   ├── geojson.py
│   │   ├── data.py
│   │   └── analysis.py
│   └── services/
│       ├── postgis_service.py
│       └── analysis_service.py
└── requirements.txt
```

---

## ✅ Roadmap de Implementación

### Fase 1: Setup (Semana 1)
- [ ] Inicializar proyecto Next.js con TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Instalar dependencias (Mapbox, Recharts, Radix, Framer Motion)
- [ ] Configurar Zustand para state management
- [ ] Setup de FastAPI backend

### Fase 2: Mapas (Semana 2)
- [ ] Implementar MapContainer con Mapbox GL
- [ ] Crear endpoints GeoJSON en FastAPI
- [ ] Configurar capas de parroquias, petróleo y salud
- [ ] Implementar LayerControl con UI
- [ ] Agregar tooltips y panel de detalles

### Fase 3: Visualizaciones (Semana 3)
- [ ] Crear componentes de gráficos con Recharts
- [ ] Implementar dashboard con métricas
- [ ] Agregar filtros interactivos
- [ ] Sincronizar estado con URL

### Fase 4: Polish (Semana 4)
- [ ] Agregar animaciones con Framer Motion
- [ ] Implementar loading states
- [ ] Responsive design
- [ ] Testing y optimización

---

## 💰 Costos

| Componente | Costo Mensual | Notas |
|------------|---------------|-------|
| Vercel Pro | $20 | Hosting frontend |
| Railway/Render | $5-10 | Hosting backend |
| Mapbox | Gratis - $50 | Hasta 50k loads gratis |
| **Total estimado** | **$25-80/mes** | |
