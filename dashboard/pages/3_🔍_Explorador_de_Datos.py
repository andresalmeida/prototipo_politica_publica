"""
═══════════════════════════════════════════════════════════════════════
PÁGINA: EXPLORADOR DE DATOS
═══════════════════════════════════════════════════════════════════════
"""

import streamlit as st
import pandas as pd
import sys
from pathlib import Path

# Agregar utils al path
sys.path.append(str(Path(__file__).parent.parent))

from config import PAGE_CONFIG
from utils.data_loader import get_provincias, get_datos_por_provincia

# ═══════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════════════════

st.set_page_config(**PAGE_CONFIG)

# Header de la página
st.markdown("""
<div style='background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem;'>
    <h1 style='color: white; margin: 0; border: none;'>🔍 Explorador de Datos</h1>
    <p style='color: rgba(255,255,255,0.9); margin-top: 0.5rem;'>Filtros personalizados y descarga de información territorial</p>
</div>
""", unsafe_allow_html=True)

# ═══════════════════════════════════════════════════════════════════════
# FILTROS
# ═══════════════════════════════════════════════════════════════════════

st.sidebar.markdown("### Filtros")

# Obtener lista de provincias
df_provincias = get_provincias()

if not df_provincias.empty:
    provincias_list = ['Todas'] + sorted(df_provincias['nombre_provincia'].tolist())
    
    provincia_seleccionada = st.sidebar.selectbox(
        "Provincia",
        provincias_list
    )
else:
    provincia_seleccionada = 'Todas'

# Filtros adicionales
st.sidebar.markdown("---")

filtro_petroleo = st.sidebar.checkbox("Solo con petróleo", value=False)
filtro_afro = st.sidebar.slider("% Mínimo Población Afro", 0.0, 100.0, 0.0, 1.0)
filtro_salud = st.sidebar.slider("Salud Mínima (estab/10k)", 0.0, 50.0, 0.0, 1.0)

# ═══════════════════════════════════════════════════════════════════════
# DATOS FILTRADOS
# ═══════════════════════════════════════════════════════════════════════

st.markdown("### Datos Filtrados")

# Cargar datos
df_datos = get_datos_por_provincia(provincia_seleccionada)

# Aplicar filtros
if not df_datos.empty:
    df_filtrado = df_datos.copy()
    
    if filtro_petroleo:
        df_filtrado = df_filtrado[df_filtrado['infraestructura'] > 0]
    
    if filtro_afro > 0:
        df_filtrado = df_filtrado[df_filtrado['pct_afro'] >= filtro_afro]
    
    if filtro_salud > 0:
        df_filtrado = df_filtrado[df_filtrado['salud_10k'] >= filtro_salud]
    
    # Mostrar métricas
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Parroquias", f"{len(df_filtrado):,}")
    
    with col2:
        total_infra = df_filtrado['infraestructura'].sum()
        st.metric("Infraestructura Total", f"{total_infra:,.0f}")
    
    with col3:
        salud_promedio = df_filtrado['salud_10k'].mean()
        st.metric("Salud Promedio", f"{salud_promedio:.2f}")
    
    with col4:
        poblacion_total = df_filtrado['poblacion'].sum()
        st.metric("Población Total", f"{poblacion_total:,.0f}")
    
    st.markdown("---")
    
    # Tabla de datos
    st.markdown("### Tabla de Datos")
    
    # Preparar columnas
    df_display = df_filtrado[[
        'nombre_parroquia',
        'nombre_canton',
        'nombre_provincia',
        'infraestructura',
        'pozos',
        'contaminacion',
        'salud_10k',
        'pct_afro',
        'poblacion'
    ]].copy()
    
    df_display.columns = [
        'Parroquia',
        'Cantón',
        'Provincia',
        'Infraestructura',
        'Pozos',
        'Contaminación',
        'Salud (10k hab)',
        '% Afro',
        'Población'
    ]
    
    # Ordenar por infraestructura
    df_display = df_display.sort_values('Infraestructura', ascending=False)
    
    # Mostrar tabla
    st.dataframe(df_display, use_container_width=True, hide_index=True, height=400)
    
    # Botón de descarga
    csv = df_display.to_csv(index=False).encode('utf-8')
    
    st.download_button(
        label="Descargar CSV",
        data=csv,
        file_name=f"datos_{provincia_seleccionada}.csv",
        mime="text/csv"
    )

else:
    st.warning("No hay datos disponibles con los filtros seleccionados")

st.markdown("---")

# Estadísticas descriptivas
if not df_filtrado.empty:
    st.markdown("### Estadísticas Descriptivas")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Estadísticas básicas
        stats = df_filtrado[['infraestructura', 'salud_10k', 'pct_afro', 'poblacion']].describe().T
        stats = stats[['mean', 'std', 'min', 'max']]
        stats.columns = ['Promedio', 'Desv. Estándar', 'Mínimo', 'Máximo']
        stats = stats.round(2)
        
        st.dataframe(stats, use_container_width=True)
    
    with col2:
        # Conteos
        st.markdown("**Conteos**")
        
        con_petroleo = len(df_filtrado[df_filtrado['infraestructura'] > 0])
        st.metric("Con Petróleo", f"{con_petroleo:,}")
        
        con_afro = len(df_filtrado[df_filtrado['pct_afro'] > 5])
        st.metric("Con >5% Población Afro", f"{con_afro:,}")
        
        sin_salud = len(df_filtrado[df_filtrado['salud_10k'] == 0])
        st.metric("Sin Acceso a Salud", f"{sin_salud:,}")

st.markdown("---")
st.caption("**Prototipo de Dashboard Analítico** • Análisis de Política Pública • 2025")

