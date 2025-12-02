# 🗺️ Paradoja Extractivista en Ecuador

Dashboard interactivo para el análisis geoespacial de la relación entre infraestructura petrolera, acceso a salud y población afroecuatoriana en Ecuador.

## 📊 Hallazgo Principal

**Las parroquias con actividad petrolera tienen 33% menos acceso a servicios de salud** (5.87 vs 8.88 establecimientos por 10,000 habitantes).

## 🚀 Visualización en [Streamlit Cloud](https://prototipopoliticapublica-ecuador.streamlit.app/)

## Opción 2: Ejecutar Localmente

```bash
# 1. Instalar dependencias
pip install -r requirements.txt

# 2. Ejecutar el dashboard
cd dashboard
streamlit run app.py
```

El dashboard estará disponible en: `http://localhost:8501`

## 📁 Estructura del Proyecto

```
prototipo_tfm/
├── dashboard/
│   ├── app.py                 # Página principal
│   ├── config.py              # Configuración
│   ├── pages/
│   │   ├── 1_Overview.py      # Análisis general
│   │   ├── 3_Analisis_Espacial.py  # Mapas y clustering
│   │   └── 4_Explorador_Datos.py   # Explorador interactivo
│   └── utils/
│       ├── data_loader.py     # Carga de datos desde CSV
│       └── __init__.py
├── data/
│   ├── processed/             # Datos procesados (CSV)
│   │   └── parroquias_con_clusters.csv
│   └── geo/                   # Datos geoespaciales (GeoJSON)
│       └── parroquias_analisis_completo.geojson
├── requirements.txt           # Dependencias
└── README.md                  # Este archivo
```

## 📦 Datos

El dashboard usa **solo archivos estáticos** (CSV y GeoJSON), por lo que:
- ✅ No requiere base de datos
- ✅ Carga rápida con caché
- ✅ Portable y fácil de replicar

### Fuentes de Datos

- **CONALI**: Límites parroquiales (1,236 parroquias)
- **INEC**: Censo de población y etnia (2022)
- **MSP**: Registro de establecimientos de salud (RAS 2020)
- **MAATE**: Infraestructura petrolera y contaminación

## 🔧 Tecnologías

- **Streamlit** - Framework web para Python
- **Pandas & GeoPandas** - Análisis de datos
- **Plotly** - Visualizaciones interactivas
- **Scikit-learn** - Clustering (K-Means)

## 📈 Características

### 1. Página Principal
- Métricas clave del análisis
- Comparación: parroquias con/sin petróleo
- Resumen de hallazgos

### 2. Overview
- Scatter plot: Petróleo vs Salud
- Top 10 parroquias petroleras
- Análisis por provincia
- Población afroecuatoriana

### 3. Análisis Espacial
- 4 mapas interactivos
- Clustering K-Means (4 grupos)
- Análisis de paradoja extractivista
- Caracterización de clusters

### 4. Explorador de Datos
- Filtros por provincia
- Descarga de datos (CSV)
- Estadísticas descriptivas
- Tablas interactivas

## 📝 Metodología

1. **ETL**: 7 notebooks de procesamiento de datos
2. **Análisis Espacial**: Spatial joins con coordenadas
3. **Clustering**: K-Means (4 clusters)
4. **Estadística**: Correlaciones y pruebas no paramétricas

## 🌍 Hallazgos Clave

1. **Paradoja Extractivista**: Las zonas con petróleo tienen 33% menos acceso a salud
2. **Concentración Geográfica**: 50 parroquias (4%) tienen el 99% de la infraestructura petrolera
3. **Amazonía**: Región más afectada (Sucumbíos, Orellana)
4. **Población Afroecuatoriana**: Mayormente en Esmeraldas, SIN exposición significativa a petróleo

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

**Nota**: Este dashboard fue optimizado para funcionar sin base de datos, usando solo archivos CSV/GeoJSON. Todos los datos están pre-procesados y listos para visualización.

