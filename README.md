# 🗺️ Paradoja Extractivista en Ecuador

Dashboard interactivo para el análisis geoespacial de la relación entre infraestructura petrolera, acceso a salud y población afroecuatoriana en Ecuador.

## 📊 Hallazgo Principal

**Las parroquias con actividad petrolera tienen 33% menos acceso a servicios de salud** (5.87 vs 8.88 establecimientos por 10,000 habitantes).

## 🚀 Ejecutar el Dashboard

### Requisitos Previos
- Node.js 18+ y npm

### Instalación y Ejecución

```bash
# 1. Navegar al directorio del dashboard
cd dashboard-react

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Construir para producción
npm run build
npm start
```

El dashboard estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
prototipo_tfm/
├── dashboard-react/           # Dashboard React + Next.js
│   ├── app/                   # Páginas de la aplicación
│   │   ├── page.tsx          # Página principal
│   │   ├── analisis/         # Análisis general
│   │   ├── mapas/            # Mapas y territorios
│   │   └── explorador/       # Explorador de datos
│   ├── components/           # Componentes reutilizables
│   │   ├── charts/           # Gráficos (Recharts)
│   │   ├── map/              # Mapas (Mapbox GL)
│   │   ├── layout/           # Layout (Header, Sidebar)
│   │   └── ui/               # Componentes UI (shadcn/ui)
│   ├── hooks/                # Custom hooks
│   ├── store/                # Estado global (Zustand)
│   ├── types/                # TypeScript types
│   └── public/data/          # Datos estáticos (JSON)
├── data/
│   ├── processed/            # Datos procesados (CSV)
│   └── geo/                  # Datos geoespaciales (GeoJSON)
├── plans/                    # Documentación de arquitectura
└── README.md                 # Este archivo
```

## 📦 Datos

El dashboard usa **solo archivos estáticos** (JSON y GeoJSON), por lo que:
- ✅ No requiere base de datos
- ✅ Carga rápida con caché
- ✅ Portable y fácil de replicar
- ✅ Deploy sencillo en Vercel/Netlify

### Fuentes de Datos

- **CONALI**: Límites parroquiales (1,236 parroquias)
- **INEC**: Censo de población y etnia (2022)
- **MSP**: Registro de establecimientos de salud (RAS 2020)
- **MAATE**: Infraestructura petrolera y contaminación

## 🔧 Tecnologías

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **shadcn/ui** - Componentes UI accesibles

### Visualización
- **Mapbox GL JS** - Mapas interactivos WebGL
- **Recharts** - Gráficos responsivos
- **Lucide React** - Iconos modernos

### Estado y Datos
- **Zustand** - Estado global ligero
- **SWR** - Fetching y caché de datos

## 📈 Características

### 1. Página Principal
- Métricas clave del análisis
- Comparación: parroquias con/sin petróleo
- Resumen de hallazgos
- Navegación intuitiva

### 2. Análisis General
- Scatter plot: Petróleo vs Salud
- Top 10 parroquias petroleras
- Análisis por provincia
- Población afroecuatoriana
- Gráficos interactivos

### 3. Mapas y Territorios
- Mapas interactivos con Mapbox GL
- Control de capas múltiples
- Clustering K-Means (4 grupos)
- Análisis de paradoja extractivista
- Caracterización de clusters
- Zoom y navegación fluida

### 4. Explorador de Datos
- Filtros por provincia y cluster
- Búsqueda en tiempo real
- Descarga de datos (CSV)
- Estadísticas descriptivas
- Tablas interactivas con paginación

## 📝 Metodología

1. **ETL**: Procesamiento de datos con Python/Pandas
2. **Análisis Espacial**: Spatial joins con coordenadas
3. **Clustering**: K-Means (4 clusters)
4. **Estadística**: Correlaciones y pruebas no paramétricas
5. **Visualización**: Dashboard React moderno

## 🌍 Hallazgos Clave

1. **Paradoja Extractivista**: Las zonas con petróleo tienen 33% menos acceso a salud
2. **Concentración Geográfica**: 50 parroquias (4%) tienen el 99% de la infraestructura petrolera
3. **Amazonía**: Región más afectada (Sucumbíos, Orellana)
4. **Población Afroecuatoriana**: Mayormente en Esmeraldas, SIN exposición significativa a petróleo

## 🚀 Deploy

> 📖 **Guía detallada**: Ver [`DEPLOY.md`](./dashboard-react/DEPLOY.md) para instrucciones completas.

### ⚙️ Requisito Previo: Mapbox Token

Antes de desplegar, necesitas un token de Mapbox (gratuito, 50,000 cargas/mes):
1. Crea cuenta en https://account.mapbox.com/
2. Copia tu token público

### 🌟 Vercel (Recomendado)

```bash
cd dashboard-react

# Configurar variable de entorno
vercel env add NEXT_PUBLIC_MAPBOX_TOKEN

# Deploy
vercel --prod
```

### 🌐 Netlify

```bash
cd dashboard-react

# Crear .env.local localmente
echo "NEXT_PUBLIC_MAPBOX_TOKEN=pk.tu_token" > .env.local

npm run build
npx netlify deploy --prod --dir=dist
```

> 🔒 **IMPORTANTE**: Nunca commitees archivos `.env.local`. El proyecto incluye `.env.local.example` como template.

## 🤝 Contribuciones

Este es un proyecto académico. Para preguntas o colaboraciones:
- Email: [almeidaandres12@gmail.com]
- GitHub: [andresalmeida]

## 📄 Licencia

**Copyright © 2025 - Todos los derechos reservados**

Este proyecto es un prototipo desarrollado para análisis de política pública en Ecuador.

**Restricciones:**
- El código y análisis son propiedad del autor
- No se permite uso comercial sin autorización escrita
- Uso permitido únicamente para revisión académica y evaluación gubernamental
- Para solicitar permisos de uso, contactar al autor

**Datos oficiales**: Los datos utilizados provienen de fuentes públicas (CONALI, INEC, MSP, MAATE) y mantienen sus licencias originales.

---

**Nota**: Este dashboard fue migrado de Streamlit a React + Next.js para mejor rendimiento, experiencia de usuario moderna y facilidad de deploy.
