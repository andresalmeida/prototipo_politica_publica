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

# Header de la página con estilo premium
st.markdown("""
<style>
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
<div style='
    background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #a78bfa 100%);
    padding: 2.5rem 2rem;
    border-radius: 16px;
    margin-bottom: 2rem;
    box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.6s ease-out;
'>
    <div style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%);'></div>
    <h1 style='color: white; margin: 0; border: none; position: relative; z-index: 1; font-size: 2.25rem; font-weight: 800;'>🔍 Explorador de Datos</h1>
    <p style='color: rgba(255,255,255,0.95); margin-top: 0.75rem; position: relative; z-index: 1; font-size: 1.1rem; font-weight: 500;'>Filtros interactivos y descarga de información territorial</p>
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

st.markdown("""
<div style='background: linear-gradient(90deg, #6d28d9, #8b5cf6); height: 3px; border-radius: 10px; margin: 2rem 0 1.5rem 0;'></div>
<h3 style='color: #1e293b; font-weight: 700; margin-bottom: 1rem;'>
    📊 Datos Filtrados
</h3>
""", unsafe_allow_html=True)

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
    st.markdown("""
    <div style='background: linear-gradient(90deg, #6d28d9, #8b5cf6); height: 3px; border-radius: 10px; margin: 2rem 0 1.5rem 0;'></div>
    <h3 style='color: #1e293b; font-weight: 700; margin-bottom: 1rem;'>
        📋 Tabla de Datos
    </h3>
    """, unsafe_allow_html=True)
    
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
    st.markdown("""
    <div style='background: linear-gradient(90deg, #6d28d9, #8b5cf6); height: 3px; border-radius: 10px; margin: 2rem 0 1.5rem 0;'></div>
    <h3 style='color: #1e293b; font-weight: 700; margin-bottom: 1rem;'>
        📈 Estadísticas Descriptivas
    </h3>
    """, unsafe_allow_html=True)
    
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
st.markdown("""
<div style='text-align: center; padding: 2rem 0; color: #64748b; font-size: 0.9rem;'>
    <strong style='color: #1e293b;'>Prototipo de Dashboard Analítico</strong><br>
    Análisis de Política Pública • 2025
</div>
""", unsafe_allow_html=True)

