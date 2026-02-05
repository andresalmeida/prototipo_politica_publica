# Arquitectura Dashboard React + Next.js

## Resumen Ejecutivo

Migración del dashboard de Streamlit a una arquitectura moderna con Next.js 14, React 18, TypeScript, Mapbox GL, y Tailwind CSS. El dashboard será **Static Site Generation (SSG)** con datos convertidos a JSON durante el build.

---

## 1. Estructura de Carpetas del Proyecto

```
dashboard-react/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Página de inicio (Home)
│   ├── layout.tsx                # Layout raíz con providers
│   ├── globals.css               # Estilos globales
│   ├── analisis/
│   │   └── page.tsx              # Página: Análisis General
│   ├── mapas/
│   │   └── page.tsx              # Página: Mapas y Territorios
│   └── explorador/
│       └── page.tsx              # Página: Explorador de Datos
│
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base (Radix + Tailwind)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── tooltip.tsx
│   │   └── badge.tsx
│   │
│   ├── layout/                   # Componentes de layout
│   │   ├── sidebar.tsx           # Navegación lateral
│   │   ├── header.tsx            # Header de página
│   │   └── page-container.tsx    # Contenedor de página
│   │
│   ├── map/                      # Componentes de mapa
│   │   ├── map-container.tsx     # Contenedor principal de Mapbox
│   │   ├── layer-control.tsx     # Panel de control de capas
│   │   ├── tooltip-map.tsx       # Tooltip de hover en mapa
│   │   ├── feature-panel.tsx     # Panel lateral de feature seleccionada
│   │   └── legend.tsx            # Leyenda de capas
│   │
│   ├── charts/                   # Componentes de visualización
│   │   ├── scatter-plot.tsx      # Gráfico de dispersión
│   │   ├── bar-chart.tsx         # Gráfico de barras
│   │   ├── pie-chart.tsx         # Gráfico circular
│   │   └── stats-cards.tsx       # Tarjetas de métricas
│   │
│   ├── filters/                  # Componentes de filtro
│   │   ├── province-filter.tsx   # Filtro de provincia
│   │   ├── range-filter.tsx      # Filtro por rango
│   │   └── toggle-filter.tsx     # Filtros booleanos
│   │
│   └── animations/               # Componentes de animación
│       ├── fade-in.tsx           # Wrapper de fade in
│       ├── slide-in.tsx          # Wrapper de slide
│       └── stagger-container.tsx # Contenedor de stagger
│
├── lib/                          # Utilidades y configuración
│   ├── utils.ts                  # Funciones utilitarias (cn, etc)
│   ├── data/                     # Carga y transformación de datos
│   │   ├── loaders.ts            # Funciones para cargar JSON
│   │   ├── transformers.ts       # Transformaciones de datos
│   │   └── types.ts              # Tipos de datos
│   │
│   ├── map/                      # Configuración de mapas
│   │   ├── config.ts             # Configuración de Mapbox
│   │   ├── layers.ts             # Definición de capas
│   │   └── styles.ts             # Estilos de capas
│   │
│   └── charts/                   # Configuración de gráficos
│       └── config.ts             # Colores, temas, etc
│
├── store/                        # Estado global (Zustand)
│   ├── map-store.ts              # Estado del mapa
│   ├── filter-store.ts           # Estado de filtros
│   └── ui-store.ts               # Estado de UI
│
├── hooks/                        # Custom hooks
│   ├── use-map.ts                # Hook para interactuar con Mapbox
│   ├── use-data.ts               # Hook para cargar datos
│   └── use-filters.ts            # Hook para aplicar filtros
│
├── types/                        # Tipos TypeScript globales
│   ├── index.ts                  # Exportaciones principales
│   ├── parroquia.ts              # Tipo de parroquia
│   ├── cluster.ts                # Tipo de cluster
│   └── map.ts                    # Tipos de mapa
│
├── scripts/                      # Scripts de build
│   └── convert-data.ts           # Convierte CSV/GeoJSON a JSON
│
├── public/                       # Archivos estáticos
│   └── data/                     # Datos convertidos a JSON
│       ├── parroquias.json
│       ├── clusters.json
│       ├── infraestructura.json
│       ├── salud.json
│       └── estadisticas.json
│
├── tailwind.config.ts            # Configuración de Tailwind
├── next.config.js                # Configuración de Next.js
├── tsconfig.json                 # Configuración de TypeScript
└── package.json
```

---

## 2. Componentes Principales

### 2.1 Layout Components

| Componente | Props | Descripción |
|------------|-------|-------------|
| `Sidebar` | `items: NavItem[]` | Navegación lateral con iconos y active state |
| `Header` | `title, subtitle, icon` | Header de página con gradiente y animación |
| `PageContainer` | `children, className` | Contenedor consistente para todas las páginas |

### 2.2 Map Components

| Componente | Props | Descripción |
|------------|-------|-------------|
| `MapContainer` | `center, zoom, layers` | Contenedor principal de Mapbox GL |
| `LayerControl` | `layers, onToggle, onOpacityChange` | Panel flotante de control de capas |
| `TooltipMap` | `feature, position` | Tooltip en hover sobre features |
| `FeaturePanel` | `feature, onClose` | Panel lateral con detalles de parroquia |
| `Legend` | `items` | Leyenda de colores y símbolos |

### 2.3 Chart Components

| Componente | Props | Descripción |
|------------|-------|-------------|
| `ScatterPlot` | `data, xKey, yKey, colorKey` | Gráfico de dispersión con Recharts |
| `BarChart` | `data, xKey, yKey` | Gráfico de barras horizontal/vertical |
| `PieChart` | `data, nameKey, valueKey` | Gráfico circular/donut |
| `StatsCards` | `metrics: Metric[]` | Grid de tarjetas de métricas |

### 2.4 Filter Components

| Componente | Props | Descripción |
|------------|-------|-------------|
| `ProvinceFilter` | `options, value, onChange` | Select de provincias |
| `RangeFilter` | `min, max, value, onChange` | Slider de rango numérico |
| `ToggleFilter` | `label, checked, onChange` | Checkbox con estilo switch |

---

## 3. Integración con Mapbox GL

### 3.1 Configuración de Capas

```typescript
// lib/map/layers.ts

export const MAP_LAYERS = {
  // Capa base: Parroquias coloreadas por cluster
  parroquias: {
    id: 'parroquias-fill',
    type: 'circle',
    source: 'parroquias',
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        5, 4,
        10, 12
      ],
      'circle-color': [
        'match',
        ['get', 'cluster_kmeans'],
        0, '#3b82f6',  // Azul - Sin petróleo
        1, '#ef4444',  // Rojo - Alta actividad
        2, '#10b981',  // Verde - Moderada
        3, '#f59e0b',  // Naranja - Baja
        '#94a3b8'      // Gris - Sin cluster
      ],
      'circle-opacity': 0.7,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  },

  // Capa: Infraestructura petrolera
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
      'circle-opacity': 0.8,
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

### 3.2 Arquitectura del Mapa

```
┌─────────────────────────────────────────────────────────────┐
│                    MapContainer                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │              Mapbox GL Instance                     │   │
│  │                                                     │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐           │   │
│  │   │ Capa    │  │ Capa    │  │ Capa    │           │   │
│  │   │Parroquias│  │Petróleo │  │ Salud   │           │   │
│  │   └─────────┘  └─────────┘  └─────────┘           │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ LayerControl│ │ Tooltip  │  │ Feature  │                 │
│  │ (flotante)  │ │ (hover)  │  │ Panel    │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Interacciones del Mapa

| Evento | Acción |
|--------|--------|
| `hover` en parroquia | Mostrar tooltip con nombre y datos básicos |
| `click` en parroquia | FlyTo a la ubicación + abrir FeaturePanel |
| `zoom` | Ajustar tamaño de puntos proporcionalmente |
| `toggle layer` | Mostrar/ocultar capa con animación |
| `opacity change` | Actualizar opacidad de capa en tiempo real |

---

## 4. Estrategia de Carga de Datos

### 4.1 Pipeline de Datos

```
CSV/GeoJSON (source)
       │
       ▼
┌──────────────────┐
│ scripts/convert  │  ← Script de build
│   -data.ts       │
└──────────────────┘
       │
       ▼
JSON optimizados (public/data/)
       │
       ▼
┌──────────────────┐
│  Static Fetch    │  ← Next.js SSG
│  (getStaticData) │
└──────────────────┘
       │
       ▼
React Components
```

### 4.2 Script de Conversión

```typescript
// scripts/convert-data.ts

// 1. Lee CSV de data/processed/
// 2. Convierte a JSON optimizado
// 3. Guarda en public/data/
// 4. Genera tipos TypeScript automáticamente

const DATA_FILES = [
  { input: 'parroquias_con_clusters.csv', output: 'parroquias.json' },
  { input: 'estadisticas_clusters.csv', output: 'clusters.json' },
  { input: 'infraestructura_petrolera_procesada.csv', output: 'infraestructura.json' },
  { input: 'establecimientos_salud_procesados.csv', output: 'salud.json' },
  { input: 'parroquias_centroides.geojson', output: 'parroquias_geo.json' }
];
```

### 4.3 Hooks de Datos

```typescript
// hooks/use-data.ts

export function useParroquias() {
  // Carga parroquias.json desde /public/data/
  // Retorna datos tipados + estado de carga
}

export function useClusters() {
  // Carga clusters.json
  // Retorna estadísticas por cluster
}

export function useFilteredData(filters: FilterState) {
  // Aplica filtros a los datos
  // Retorna datos filtrados + métricas
}
```

---

## 5. Routing entre Páginas

### 5.1 Estructura de Rutas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Home | Dashboard overview con métricas principales |
| `/analisis` | Análisis General | Gráficos de correlación y estadísticas |
| `/mapas` | Mapas y Territorios | Mapa interactivo con capas |
| `/explorador` | Explorador de Datos | Tabla con filtros avanzados |

### 5.2 Navegación

```typescript
// Componente Sidebar con navegación

const NAV_ITEMS = [
  { href: '/', label: 'Inicio', icon: HomeIcon },
  { href: '/analisis', label: 'Análisis', icon: ChartIcon },
  { href: '/mapas', label: 'Mapas', icon: MapIcon },
  { href: '/explorador', label: 'Explorador', icon: SearchIcon }
];
```

### 5.3 Layout Compartido

```typescript
// app/layout.tsx

export default function RootLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
```

---

## 6. Estado Global (Zustand)

### 6.1 Stores

```typescript
// store/map-store.ts

interface MapState {
  // Instancia de Mapbox
  mapInstance: mapboxgl.Map | null;
  setMapInstance: (map: mapboxgl.Map) => void;
  
  // Capas
  layers: LayerConfig[];
  toggleLayer: (id: string) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  
  // Feature seleccionada
  selectedFeature: Feature | null;
  setSelectedFeature: (feature: Feature | null) => void;
  
  // Viewport
  viewport: { center: [number, number]; zoom: number };
  setViewport: (viewport: Viewport) => void;
}
```

```typescript
// store/filter-store.ts

interface FilterState {
  // Filtros
  provincia: string | null;
  tienePetroleo: boolean;
  sinSalud: boolean;
  pctAfroMin: number;
  saludMin: number;
  
  // Acciones
  setProvincia: (p: string | null) => void;
  setTienePetroleo: (v: boolean) => void;
  setSinSalud: (v: boolean) => void;
  setPctAfroMin: (v: number) => void;
  setSaludMin: (v: number) => void;
  resetFilters: () => void;
}
```

```typescript
// store/ui-store.ts

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Tema
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}
```

### 6.2 Diagrama de Estado

```
┌─────────────────────────────────────────────────────────────┐
│                      Zustand Stores                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  MapStore    │  │ FilterStore  │  │   UIStore    │      │
│  │              │  │              │  │              │      │
│  │ • layers     │  │ • provincia  │  │ • sidebarOpen│      │
│  │ • selected   │  │ • filtros    │  │ • theme      │      │
│  │ • viewport   │  │ • reset()    │  │ • isLoading  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                 │               │
│         ▼                 ▼                 ▼               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Persist Middleware                      │   │
│  │     (localStorage para preferencias de usuario)     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Stack Tecnológico

### 7.1 Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 14.x | Framework React con SSG |
| React | 18.x | UI Library |
| TypeScript | 5.x | Tipado estático |

### 7.2 UI/Styling

| Tecnología | Propósito |
|------------|-----------|
| Tailwind CSS | Utility-first CSS |
| Radix UI | Componentes headless accesibles |
| Framer Motion | Animaciones declarativas |
| Lucide React | Iconos consistentes |

### 7.3 Visualización

| Tecnología | Propósito |
|------------|-----------|
| Mapbox GL JS | Mapas interactivos avanzados |
| Recharts | Gráficos estadísticos |
| react-map-gl | Wrapper React para Mapbox |

### 7.4 Estado y Datos

| Tecnología | Propósito |
|------------|-----------|
| Zustand | Estado global simple |
| Papaparse | Parseo de CSV (build time) |
| zod | Validación de esquemas |

---

## 8. Dependencias (package.json)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "mapbox-gl": "^3.0.0",
    "react-map-gl": "^7.1.0",
    "recharts": "^2.10.0",
    "framer-motion": "^10.16.0",
    "zustand": "^4.4.0",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slider": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/mapbox-gl": "^2.7.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "papaparse": "^5.4.0",
    "@types/papaparse": "^5.3.0"
  }
}
```

---

## 9. Flujo de Datos entre Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                        Data Flow                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   public/data/*.json                                            │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────────┐                                           │
│   │  useData hook   │  ← Carga datos estáticos                 │
│   └─────────────────┘                                           │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────────┐     ┌─────────────────┐                  │
│   │  FilterStore    │◄────│  UI Filters     │                  │
│   │  (estado)       │     │  (componentes)  │                  │
│   └─────────────────┘     └─────────────────┘                  │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────────┐                                           │
│   │  useFilteredData│  ← Aplica filtros a datos                │
│   │  hook           │                                           │
│   └─────────────────┘                                           │
│        │                                                        │
│        ├────────────────┬────────────────┐                      │
│        ▼                ▼                ▼                      │
│   ┌─────────┐      ┌─────────┐      ┌─────────┐                │
│   │  Map    │      │ Charts  │      │  Table  │                │
│   │Container│      │         │      │         │                │
│   └─────────┘      └─────────┘      └─────────┘                │
│        │                                                        │
│        ▼                                                        │
│   MapStore (viewport, selected feature)                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Consideraciones de Performance

### 10.1 Optimizaciones

| Estrategia | Implementación |
|------------|----------------|
| Code Splitting | Dynamic imports para Mapbox (carga pesada) |
| Data Loading | JSON estáticos + SSG, no fetching en runtime |
| Memoization | React.memo para componentes de lista/gráficos |
| Virtualización | react-window para tabla de explorador si es grande |
| Debouncing | Debounce en sliders de filtro |

### 10.2 Bundle Size

- Mapbox GL: ~800KB (cargado dinámicamente)
- Recharts: ~100KB
- Framer Motion: ~40KB
- Resto: ~150KB

---

## 11. Próximos Pasos para Implementación

1. **Setup inicial**: Crear proyecto Next.js con shadcn/ui
2. **Configurar Tailwind**: Tema personalizado con colores del dashboard
3. **Script de datos**: Implementar conversión CSV → JSON
4. **Componentes base**: Crear UI components con Radix
5. **Mapa**: Implementar MapContainer con capas básicas
6. **Páginas**: Construir cada página con sus componentes
7. **Estado**: Integrar Zustand stores
8. **Animaciones**: Agregar Framer Motion
9. **Polish**: Responsive, accesibilidad, testing
