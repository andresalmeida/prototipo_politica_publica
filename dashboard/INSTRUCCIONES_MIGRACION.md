# 📝 Instrucciones de Migración - PostgreSQL → CSV

## ✅ Cambios Realizados

### 1. Nuevo Módulo de Carga de Datos

**Archivo**: `dashboard/utils/data_loader.py`

**Funciones principales**:
- `load_parroquias_completo()`: Carga el CSV completo con todos los datos
- `load_parroquias_geo()`: Carga GeoJSON (para mapas avanzados)
- `get_metricas_generales()`: Equivalente a QUERY_METRICAS_GENERALES
- `get_top_petroleras()`: Top N parroquias petroleras
- `get_scatter_data()`: Datos para scatter plots
- `get_stats_provincia()`: Estadísticas por provincia
- `get_provincias()`: Lista de provincias
- `get_datos_por_provincia()`: Datos filtrados por provincia
- `get_afro_con_petroleo()`: Parroquias afro con petróleo

### 2. Archivos Modificados

#### `dashboard/app.py`
- ❌ Eliminado: `from utils.db_connection import get_engine, execute_query`
- ✅ Añadido: `from utils.data_loader import get_metricas_generales`
- ✅ Cambiado: `engine = get_engine()` → `df_metricas = get_metricas_generales()`

#### `dashboard/pages/1_Overview.py`
- ❌ Eliminado: `from utils.db_connection import get_engine, execute_query`
- ✅ Añadido: `from utils.data_loader import get_top_petroleras, get_stats_provincia, get_scatter_data, get_afro_con_petroleo`
- ✅ Cambiado: Todos los `execute_query()` → funciones de `data_loader`

#### `dashboard/pages/3_Analisis_Espacial.py`
- ❌ Eliminado: Función local `load_spatial_data()`
- ✅ Añadido: `from utils.data_loader import load_parroquias_completo`
- ✅ Simplificado: `df = load_parroquias_completo()`

#### `dashboard/pages/4_Explorador_Datos.py`
- ❌ Eliminado: `from utils.db_connection import get_engine, execute_query`
- ✅ Añadido: `from utils.data_loader import get_provincias, get_datos_por_provincia`
- ✅ Cambiado: Todos los queries → funciones de `data_loader`

### 3. Archivos que YA NO SE USAN

Estos archivos ya NO son necesarios para el dashboard (puedes eliminarlos o mantenerlos por referencia):

- `dashboard/utils/db_connection.py` ❌
- `dashboard/utils/queries.py` ❌
- `dashboard/test_connection.py` ❌

**Nota**: No los elimines aún si quieres mantener la referencia del código original.

### 4. Optimizaciones en `requirements.txt`

**Eliminado** (dependencias de PostgreSQL):
- `psycopg2-binary` ❌
- `SQLAlchemy` ❌
- `GeoAlchemy2` ❌
- `seaborn` ❌ (no se usa)
- `folium` ❌ (no se usa)
- `streamlit-folium` ❌ (no se usa)
- `python-dotenv` ❌ (no se usa)
- `tqdm` ❌ (no se usa)
- `openpyxl` ❌ (no se usa)
- `jupyter` ❌ (solo para desarrollo)
- `ipykernel` ❌ (solo para desarrollo)
- `black` ❌ (solo para desarrollo)
- `flake8` ❌ (solo para desarrollo)
- `rtree` ❌ (no se usa en el dashboard)

**Mantenido** (necesario):
- `pandas` ✅
- `numpy` ✅
- `geopandas` ✅ (para leer GeoJSON)
- `shapely` ✅ (dependencia de geopandas)
- `pyproj` ✅ (dependencia de geopandas)
- `fiona` ✅ (dependencia de geopandas)
- `scikit-learn` ✅ (para clustering)
- `scipy` ✅ (para estadísticas)
- `matplotlib` ✅ (backend de plotly)
- `plotly` ✅ (visualizaciones)
- `streamlit` ✅ (framework)

## 🎯 Ventajas de la Migración

### Antes (PostgreSQL)
- ❌ Necesita base de datos local o remota
- ❌ Configuración compleja (Docker, puertos, credenciales)
- ❌ Costo de hosting para PostgreSQL
- ❌ Dependencias pesadas (psycopg2, SQLAlchemy)
- ❌ Latencia en queries
- ❌ No portable

### Ahora (CSV)
- ✅ Solo archivos estáticos
- ✅ Configuración: CERO
- ✅ Deploy gratuito en Streamlit Cloud
- ✅ Dependencias ligeras
- ✅ Caché ultra-rápido con `@st.cache_data`
- ✅ 100% portable

## 🔍 Verificación

Para verificar que todo funciona:

```bash
cd dashboard
streamlit run app.py
```

Deberías ver:
1. Página principal con métricas
2. Sidebar con "Estado de Datos" (en lugar de "Estado de Conexión")
3. Todas las páginas funcionando sin errores

## 📊 Datos Fuente

El dashboard carga datos de:
- **CSV principal**: `data/processed/parroquias_con_clusters.csv` (1,236 filas)
- **GeoJSON** (opcional): `data/geo/parroquias_analisis_completo.geojson`

**Importante**: Estos archivos deben estar en el repositorio para el deploy.

## 🚨 Troubleshooting

### Error: "No such file or directory: parroquias_con_clusters.csv"

**Causa**: Las rutas en `config.py` no apuntan correctamente

**Solución**: Verifica que `config.py` tenga:
```python
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / 'data'
PROCESSED_DIR = DATA_DIR / 'processed'
```

### Error: "Module 'utils.db_connection' not found"

**Causa**: Algún archivo aún importa el módulo antiguo

**Solución**: Busca y reemplaza:
```bash
grep -r "from utils.db_connection" dashboard/
grep -r "from utils.queries" dashboard/
```

### Los datos no se cargan

**Causa**: El archivo CSV está corrupto o vacío

**Solución**: Verifica:
```python
import pandas as pd
df = pd.read_csv('data/processed/parroquias_con_clusters.csv')
print(len(df))  # Debe ser 1236
print(df.columns)  # Verifica las columnas
```

## ✨ Próximos Pasos

1. ✅ Prueba local: `streamlit run dashboard/app.py`
2. ✅ Sube a GitHub
3. ✅ Deploy en Streamlit Cloud
4. ✅ Comparte tu URL

---

**Migración completada con éxito!** 🎉

