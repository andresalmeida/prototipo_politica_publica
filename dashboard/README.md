# Dashboard - Paradoja Extractivista en Ecuador

Dashboard interactivo para visualizar la relación entre infraestructura petrolera, acceso a salud y población afroecuatoriana en Ecuador.

## Estructura

```
dashboard/
├── app.py                      # Página principal
├── config.py                   # Configuración (DB, colores, mensajes)
├── pages/
│   ├── 1_Overview.py          # Análisis exploratorio
│   └── 2_Explorador_Datos.py  # Filtros y descarga de datos
└── utils/
    ├── db_connection.py       # Conexión a PostgreSQL/PostGIS
    └── queries.py             # Queries SQL reutilizables
```

## Requisitos

- Python 3.10+
- PostgreSQL 14+ con PostGIS
- Dependencias: `streamlit`, `pandas`, `plotly`, `sqlalchemy`, `psycopg2`, `geopandas`

## Instalación

```bash
# Instalar dependencias
pip install streamlit pandas plotly sqlalchemy psycopg2-binary geopandas

# Verificar conexión a la base de datos
python test_connection.py
```

## Configuración

Editar `config.py` con las credenciales de tu base de datos:

```python
DB_CONFIG = {
    'host': 'localhost',
    'port': 5434,
    'database': 'prototipo_salud',
    'user': 'postgres',
    'password': 'postgres'
}
```

## Uso

```bash
# Ejecutar dashboard
streamlit run app.py

# El dashboard estará disponible en:
# http://localhost:8501
```

## Páginas

### 1. Inicio (app.py)
- Métricas generales
- Hallazgo principal
- Metodología

### 2. Overview
- Scatter plot: Petróleo vs Salud
- Top 10 parroquias más petroleras
- Análisis por provincia
- Población afroecuatoriana

### 3. Análisis Espacial
- Mapas interactivos (Plotly Mapbox)
- Clustering K-Means (k=4)
- Caracterización de clusters
- Visualización geoespacial por variable

### 4. Explorador de Datos
- Filtros interactivos
- Tabla de datos
- Descarga CSV
- Estadísticas descriptivas

## Tecnologías

- **Streamlit**: Framework web
- **Plotly**: Visualizaciones interactivas
- **PostgreSQL/PostGIS**: Base de datos espacial
- **SQLAlchemy**: ORM
- **Pandas/GeoPandas**: Análisis de datos

## Autor

TFM - Máster en Análisis de Datos Masivos | 2025
