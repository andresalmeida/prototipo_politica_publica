"""
═══════════════════════════════════════════════════════════════════════
CARGA DE DATOS DESDE ARCHIVOS ESTÁTICOS (CSV/GeoJSON)
═══════════════════════════════════════════════════════════════════════

Sistema optimizado para deploy sin base de datos.
Todos los datos se cargan desde archivos procesados.
"""

import streamlit as st
import pandas as pd
import geopandas as gpd
from pathlib import Path
import sys

# Agregar el directorio padre al path para importar config
sys.path.append(str(Path(__file__).parent.parent))
from config import PROCESSED_DIR, GEO_DIR


# ═══════════════════════════════════════════════════════════════════════
# CARGA DE DATOS PRINCIPALES
# ═══════════════════════════════════════════════════════════════════════

@st.cache_data
def load_parroquias_completo():
    """
    Carga el dataset completo de parroquias con todos los análisis.
    
    Returns:
        pandas DataFrame con todas las variables
    """
    csv_path = PROCESSED_DIR / 'parroquias_con_clusters.csv'
    
    if not csv_path.exists():
        st.error(f"❌ No se encontró el archivo: {csv_path}")
        return pd.DataFrame()
    
    df = pd.read_csv(csv_path)
    
    # Asegurar que las columnas numéricas sean del tipo correcto
    numeric_cols = [
        'poblacion_total', 'poblacion_afro', 'pct_poblacion_afro',
        'num_establecimientos', 'establecimientos_por_10k_hab',
        'num_infraestructura_petrolera', 'num_pozos', 'num_sitios_contaminados',
        'tiene_petroleo', 'densidad_petroleo_km2', 'area_km2',
        'centroide_lon', 'centroide_lat'
    ]
    
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Crear alias para facilitar el uso
    df['lon'] = df['centroide_lon']
    df['lat'] = df['centroide_lat']
    df['infraestructura'] = df['num_infraestructura_petrolera'].fillna(0)
    df['salud_10k'] = df['establecimientos_por_10k_hab'].fillna(0)
    df['pct_afro'] = df['pct_poblacion_afro'].fillna(0)
    df['densidad_petroleo'] = df['densidad_petroleo_km2'].fillna(0)
    df['pozos'] = df['num_pozos'].fillna(0)
    df['contaminacion'] = df['num_sitios_contaminados'].fillna(0)
    df['cluster'] = df['cluster_kmeans']
    
    return df


@st.cache_data
def load_parroquias_geo():
    """
    Carga el GeoDataFrame de parroquias con geometrías.
    
    Returns:
        geopandas GeoDataFrame
    """
    geojson_path = GEO_DIR / 'parroquias_analisis_completo.geojson'
    
    if not geojson_path.exists():
        # Fallback a parroquias.geojson si existe
        geojson_path = GEO_DIR / 'parroquias.geojson'
    
    if not geojson_path.exists():
        st.warning(f"⚠️ No se encontró el archivo GeoJSON")
        return gpd.GeoDataFrame()
    
    try:
        gdf = gpd.read_file(geojson_path)
        return gdf
    except Exception as e:
        st.error(f"❌ Error cargando GeoJSON: {e}")
        return gpd.GeoDataFrame()


# ═══════════════════════════════════════════════════════════════════════
# QUERIES EQUIVALENTES (sin base de datos)
# ═══════════════════════════════════════════════════════════════════════

def get_metricas_generales():
    """
    Obtiene métricas generales del análisis.
    Equivalente a QUERY_METRICAS_GENERALES.
    """
    df = load_parroquias_completo()
    
    if df.empty:
        return pd.DataFrame()
    
    # Filtrar parroquias con datos de salud
    df_salud = df[df['salud_10k'].notna()].copy()
    
    metricas = {
        'total_parroquias': len(df),
        'parroquias_con_petroleo': (df['tiene_petroleo'] == 1).sum(),
        'total_pozos': df['pozos'].sum(),
        'total_sitios_contaminados': df['contaminacion'].sum(),
        'salud_con_petroleo': df_salud[df_salud['tiene_petroleo'] == 1]['salud_10k'].mean(),
        'salud_sin_petroleo': df_salud[df_salud['tiene_petroleo'] == 0]['salud_10k'].mean()
    }
    
    return pd.DataFrame([metricas])


def get_top_petroleras(limit=10):
    """
    Obtiene las parroquias con mayor infraestructura petrolera.
    Equivalente a QUERY_TOP_PETROLERAS.
    """
    df = load_parroquias_completo()
    
    if df.empty:
        return pd.DataFrame()
    
    df_petroleo = df[df['infraestructura'] > 0].copy()
    
    df_result = df_petroleo[[
        'nombre_parroquia', 'nombre_canton', 'nombre_provincia',
        'infraestructura', 'pozos', 'contaminacion',
        'densidad_petroleo', 'salud_10k', 'poblacion_total', 'pct_afro'
    ]].copy()
    
    df_result = df_result.sort_values('infraestructura', ascending=False).head(limit)
    
    # Añadir columna densidad_km2 ANTES de renombrar
    df_result['densidad_km2'] = df_result['densidad_petroleo'].round(2)
    
    # Renombrar columnas para mantener compatibilidad con código existente
    df_result = df_result.rename(columns={
        'infraestructura': 'num_infraestructura_petrolera',
        'pozos': 'num_pozos',
        'contaminacion': 'num_sitios_contaminados',
        'poblacion_total': 'poblacion'
    })
    
    return df_result


def get_scatter_data():
    """
    Obtiene datos para scatter plots (petróleo vs salud).
    Equivalente a QUERY_SCATTER_DATA.
    """
    df = load_parroquias_completo()
    
    if df.empty:
        return pd.DataFrame()
    
    df_scatter = df[
        df['salud_10k'].notna() & 
        df['infraestructura'].notna()
    ].copy()
    
    df_scatter = df_scatter[[
        'nombre_parroquia', 'nombre_provincia',
        'infraestructura', 'salud_10k', 'pct_afro', 'tiene_petroleo'
    ]].copy()
    
    df_scatter.columns = [
        'nombre_parroquia', 'nombre_provincia',
        'num_infraestructura_petrolera', 'establecimientos_por_10k_hab',
        'pct_poblacion_afro', 'tiene_petroleo'
    ]
    
    return df_scatter


def get_stats_provincia():
    """
    Obtiene estadísticas agrupadas por provincia.
    Equivalente a QUERY_STATS_PROVINCIA.
    """
    df = load_parroquias_completo()
    
    if df.empty:
        return pd.DataFrame()
    
    stats = df.groupby('nombre_provincia').agg({
        'codigo_dpa': 'count',
        'tiene_petroleo': lambda x: (x == 1).sum(),
        'infraestructura': 'sum',
        'salud_10k': 'mean',
        'pct_afro': 'mean'
    }).reset_index()
    
    stats.columns = [
        'nombre_provincia', 'num_parroquias', 'parroquias_petroleras',
        'total_infraestructura', 'salud_promedio', 'afro_promedio'
    ]
    
    stats['salud_promedio'] = stats['salud_promedio'].round(2)
    stats['afro_promedio'] = stats['afro_promedio'].round(2)
    
    stats = stats.sort_values('total_infraestructura', ascending=False)
    
    return stats


def get_provincias():
    """
    Obtiene lista única de provincias.
    Equivalente a QUERY_PROVINCIAS.
    """
    df = load_parroquias_completo()
    
    if df.empty:
        return pd.DataFrame()
    
    provincias = df[['nombre_provincia']].drop_duplicates().sort_values('nombre_provincia')
    
    return provincias


def get_datos_por_provincia(provincia=None):
    """
    Obtiene datos filtrados por provincia.
    Equivalente a QUERY_FILTRO_PROVINCIA.
    """
    df = load_parroquias_completo()
    
    if df.empty:
        return pd.DataFrame()
    
    if provincia and provincia != 'Todas':
        df = df[df['nombre_provincia'] == provincia].copy()
    
    df_result = df[[
        'nombre_parroquia', 'nombre_canton', 'nombre_provincia',
        'infraestructura', 'pozos', 'contaminacion',
        'salud_10k', 'pct_afro', 'poblacion_total'
    ]].copy()
    
    # Mantener nombres de columnas consistentes
    df_result = df_result.rename(columns={
        'poblacion_total': 'poblacion'
    })
    
    df_result = df_result.sort_values('infraestructura', ascending=False)
    
    return df_result


def get_afro_con_petroleo(limit=10, min_pct_afro=5):
    """
    Obtiene parroquias con población afro y petróleo.
    """
    df = load_parroquias_completo()
    
    if df.empty:
        return pd.DataFrame()
    
    df_afro = df[
        (df['pct_afro'] > min_pct_afro) & 
        (df['infraestructura'] > 0)
    ].copy()
    
    df_afro = df_afro[[
        'nombre_parroquia', 'nombre_provincia',
        'pct_afro', 'infraestructura', 'salud_10k'
    ]].copy()
    
    df_afro.columns = [
        'nombre_parroquia', 'nombre_provincia',
        'pct_poblacion_afro', 'num_infraestructura_petrolera',
        'establecimientos_por_10k_hab'
    ]
    
    df_afro = df_afro.sort_values('pct_poblacion_afro', ascending=False).head(limit)
    
    return df_afro


# ═══════════════════════════════════════════════════════════════════════
# FUNCIÓN DE PRUEBA
# ═══════════════════════════════════════════════════════════════════════

def test_data_loading():
    """
    Prueba la carga de datos y muestra información.
    
    Returns:
        bool: True si todo funciona correctamente
    """
    try:
        df = load_parroquias_completo()
        
        if df.empty:
            st.error("❌ No se pudieron cargar los datos")
            return False
        
        st.success(f"""
        ✅ **Datos cargados correctamente**
        - Total parroquias: {len(df):,}
        - Columnas: {len(df.columns)}
        - Con clusters: {df['cluster'].notna().sum():,}
        - Con petróleo: {(df['tiene_petroleo'] == 1).sum():,}
        - Memoria: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB
        """)
        
        return True
        
    except Exception as e:
        st.error(f"❌ Error cargando datos: {e}")
        return False

