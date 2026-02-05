# Dashboard React - Paradoja Extractivista

Dashboard de análisis geoespacial sobre la relación entre infraestructura petrolera, acceso a salud y población afroecuatoriana en Ecuador.

## 🚀 Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Radix UI** - Componentes accesibles
- **Mapbox GL** - Mapas interactivos
- **Recharts** - Visualizaciones de datos
- **Zustand** - Estado global
- **Framer Motion** - Animaciones

## 📁 Estructura del Proyecto

```
dashboard-react/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página de inicio
│   ├── layout.tsx         # Layout raíz
│   ├── globals.css        # Estilos globales
│   ├── analisis/          # Página Análisis General
│   ├── mapas/             # Página Mapas y Territorios
│   └── explorador/        # Página Explorador de Datos
├── components/
│   ├── ui/                # Componentes base (Radix + Tailwind)
│   ├── layout/            # Sidebar, Header
│   ├── map/               # MapContainer, LayerControl
│   └── charts/            # CorrelationChart, BarChart
├── lib/
│   ├── utils.ts           # Funciones utilitarias
│   ├── data/              # Carga de datos
│   └── map/               # Configuración de capas Mapbox
├── store/                 # Zustand stores
├── hooks/                 # Custom React hooks
├── public/data/           # Datos JSON convertidos
├── types/                 # Tipos TypeScript
└── scripts/               # Scripts de conversión
```

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Convertir datos CSV a JSON
npm run convert-data

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🔑 Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_de_mapbox
```

Para obtener un token gratuito, visita: https://www.mapbox.com/

## 📊 Datos

Los datos se convierten automáticamente desde los archivos CSV originales:

- `parroquias_con_clusters.csv` → `public/data/parroquias.json`
- `estadisticas_clusters.csv` → `public/data/clusters.json`
- `parroquias_centroides.geojson` → `public/data/parroquias_geo.json`

## 🗺️ Funcionalidades

### Página de Inicio
- Métricas generales del dataset
- Hallazgo clave destacado
- Resumen por clusters
- Navegación a secciones

### Análisis General
- Gráfico de correlación (infraestructura vs salud)
- Gráfico de barras por cluster
- Estadísticas comparativas
- Análisis detallado de clusters

### Mapas y Territorios
- Mapa interactivo con Mapbox GL
- Control de capas (parroquias, infraestructura, salud)
- Filtros por provincia y cluster
- Leyenda de clusters
- Tooltips informativos

### Explorador de Datos
- Tabla completa de parroquias
- Búsqueda y filtros avanzados
- Ordenamiento por columnas
- Exportación a CSV

## 🎨 Clusters

| Cluster | Color | Descripción |
|---------|-------|-------------|
| 0 | Azul | Sin petróleo |
| 1 | Rojo | Alta actividad petrolera |
| 2 | Verde | Actividad moderada |
| 3 | Naranja | Alta población afro |

## 📄 Licencia

TFM - Máster en Análisis de Datos Masivos