"""
═══════════════════════════════════════════════════════════════════════
CONEXIÓN A BASE DE DATOS (PostGIS)
═══════════════════════════════════════════════════════════════════════
"""

import streamlit as st
from sqlalchemy import create_engine, text
import pandas as pd
import geopandas as gpd
from pathlib import Path
import sys

# Agregar el directorio padre al path para importar config
sys.path.append(str(Path(__file__).parent.parent))
from config import DB_CONFIG


@st.cache_resource
def get_engine():
    """
    Crea y cachea la conexión a PostgreSQL/PostGIS.
    
    Returns:
        SQLAlchemy Engine
    """
    conn_string = (
        f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}"
        f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
    )
    
    try:
        engine = create_engine(conn_string)
        # Test de conexión
        with engine.connect() as conn:
            conn.execute(text("SELECT 1;"))
            conn.commit()
        return engine
    except Exception as e:
        st.error(f"❌ Error de conexión a PostgreSQL: {e}")
        st.info("""
        💡 **Soluciones:**
        1. Verifica que el contenedor Docker esté corriendo: `docker ps`
        2. Verifica las credenciales en `config.py`
        3. Verifica que el puerto 5434 esté disponible
        """)
        return None


@st.cache_data(ttl=600)  # Cache por 10 minutos
def execute_query(_engine, query, params=None):
    """
    Ejecuta un query SQL y retorna un DataFrame.
    
    Args:
        _engine: SQLAlchemy Engine (con _ para evitar hashing en cache)
        query: Query SQL (string)
        params: Parámetros del query (opcional)
    
    Returns:
        pandas DataFrame
    """
    if _engine is None:
        return pd.DataFrame()
    
    try:
        # Convertir string a text() para SQLAlchemy 2.0
        if isinstance(query, str):
            query = text(query)
        return pd.read_sql(query, _engine, params=params)
    except Exception as e:
        st.error(f"❌ Error ejecutando query: {e}")
        return pd.DataFrame()


@st.cache_data(ttl=600)
def execute_geo_query(_engine, query, geom_col='geometry'):
    """
    Ejecuta un query SQL espacial y retorna un GeoDataFrame.
    
    Args:
        _engine: SQLAlchemy Engine
        query: Query SQL con columna geométrica (string)
        geom_col: Nombre de la columna de geometría
    
    Returns:
        geopandas GeoDataFrame
    """
    if _engine is None:
        return gpd.GeoDataFrame()
    
    try:
        # Convertir string a text() para SQLAlchemy 2.0
        if isinstance(query, str):
            query = text(query)
        return gpd.read_postgis(query, _engine, geom_col=geom_col)
    except Exception as e:
        st.error(f"❌ Error ejecutando query espacial: {e}")
        return gpd.GeoDataFrame()


def test_connection():
    """
    Prueba la conexión a la base de datos y muestra información.
    
    Returns:
        bool: True si la conexión es exitosa
    """
    engine = get_engine()
    
    if engine is None:
        return False
    
    try:
        with engine.connect() as conn:
            # Versión de PostgreSQL
            result = conn.execute(text("SELECT version();"))
            pg_version = result.fetchone()[0].split(',')[0]
            
            # Versión de PostGIS
            result = conn.execute(text("SELECT PostGIS_Version();"))
            postgis_version = result.fetchone()[0]
            
            st.success(f"""
            ✅ **Conexión exitosa**
            - PostgreSQL: {pg_version}
            - PostGIS: {postgis_version}
            - Host: {DB_CONFIG['host']}:{DB_CONFIG['port']}
            - Database: {DB_CONFIG['database']}
            """)
            return True
            
    except Exception as e:
        st.error(f"❌ Error de conexión: {e}")
        return False

