"""
═══════════════════════════════════════════════════════════════════════
DASHBOARD PRINCIPAL - PARADOJA EXTRACTIVISTA EN ECUADOR
═══════════════════════════════════════════════════════════════════════

TFM - Máster en Análisis de Datos Masivos
Autor: [Tu Nombre]
Año: 2025

Análisis geoespacial de la relación entre infraestructura petrolera,
acceso a salud y población afroecuatoriana en Ecuador.
"""

import streamlit as st
import sys
from pathlib import Path

# Agregar utils al path
sys.path.append(str(Path(__file__).parent))

from config import PAGE_CONFIG, MENSAJES, COLORS, METRICAS_CLAVE
from utils.data_loader import get_metricas_generales, test_data_loading

# ═══════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN DE LA PÁGINA
# ═══════════════════════════════════════════════════════════════════════

st.set_page_config(**PAGE_CONFIG)

# ═══════════════════════════════════════════════════════════════════════
# ESTILOS CSS PERSONALIZADOS - TEMA INSTITUCIONAL
# ═══════════════════════════════════════════════════════════════════════

st.markdown("""
<style>
    /* Tema institucional Ecuador */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Header principal */
    .main-header {
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        padding: 2rem 2rem 1.5rem 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .main-header h1 {
        color: white !important;
        font-weight: 700;
        margin: 0;
        border: none !important;
        padding: 0 !important;
    }
    
    .main-header p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.1rem;
        margin-top: 0.5rem;
    }
    
    /* Métricas mejoradas - optimizadas para fondo claro */
    [data-testid="stMetricValue"] {
        font-size: 2.25rem;
        font-weight: 700;
        color: #1e40af !important;
    }
    
    [data-testid="stMetricLabel"] {
        color: #475569 !important;
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }
    
    [data-testid="stMetricDelta"] {
        color: #64748b !important;
        font-weight: 600;
        font-size: 0.875rem;
    }
    
    /* Contenedor de métricas con fondo sutil */
    [data-testid="stMetric"] {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        padding: 1.25rem;
        border-radius: 12px;
        border: 2px solid #e2e8f0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
    }
    
    [data-testid="stMetric"]:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        transform: translateY(-2px);
    }
    
    /* Títulos profesionales */
    h1 {
        color: #0f172a;
        font-weight: 700;
        padding-bottom: 0.75rem;
        border-bottom: 3px solid #3b82f6;
        margin-bottom: 1.5rem;
    }
    
    h2 {
        color: #1e293b;
        font-weight: 600;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
    }
    
    h3 {
        color: #334155;
        font-weight: 600;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    }
    
    /* Alertas y cajas mejoradas */
    .stAlert {
        border-radius: 10px;
        border-left: 4px solid;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    [data-testid="stAlert"] {
        padding: 1rem 1.25rem;
        font-weight: 500;
    }
    
    /* Fondo principal */
    .main {
        background-color: #ffffff;
    }
    
    /* Bloques de código y elementos */
    .stCodeBlock {
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    }
    
    /* Badge de fuentes oficiales */
    .source-badge {
        display: inline-block;
        background: #f1f5f9;
        color: #475569;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-right: 0.5rem;
        margin-top: 0.25rem;
    }
    
    /* Sidebar mejorado - tema claro profesional */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        border-right: 2px solid #e2e8f0;
    }
    
    [data-testid="stSidebar"] h3 {
        color: #1e293b !important;
        font-weight: 700;
    }
    
    [data-testid="stSidebar"] h4 {
        color: #334155 !important;
        font-weight: 600;
    }
    
    [data-testid="stSidebar"] p,
    [data-testid="stSidebar"] div,
    [data-testid="stSidebar"] span,
    [data-testid="stSidebar"] li {
        color: #475569 !important;
    }
    
    [data-testid="stSidebar"] hr {
        border-color: #cbd5e1 !important;
        margin: 1rem 0;
    }
    
    /* Expander en sidebar */
    [data-testid="stSidebar"] [data-testid="stExpander"] {
        background-color: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
    }
    
    /* Botones en sidebar */
    [data-testid="stSidebar"] button {
        background-color: #3b82f6 !important;
        color: white !important;
        border: none;
        border-radius: 6px;
        font-weight: 600;
    }
    
    [data-testid="stSidebar"] button:hover {
        background-color: #2563eb !important;
    }
    
    /* Footer institucional */
    .footer {
        margin-top: 3rem;
        padding: 2rem 0 1rem 0;
        border-top: 2px solid #e2e8f0;
        text-align: center;
        color: #64748b;
    }
</style>
""", unsafe_allow_html=True)

# ═══════════════════════════════════════════════════════════════════════
# SIDEBAR - NAVEGACIÓN E INFORMACIÓN
# ═══════════════════════════════════════════════════════════════════════

with st.sidebar:
    # Header del sidebar
    st.markdown("### 🗺️ Análisis Geoespacial")
    st.markdown("**Ecuador** • Periodo 2020-2022")
    st.markdown("---")
    
    # Fuentes de datos oficiales
    st.markdown("#### 📋 Fuentes de Datos")
    st.markdown("""
    <div style='font-size: 0.85rem; line-height: 1.6;'>
    • <b>CONALI</b>: Límites territoriales<br>
    • <b>INEC</b>: Censo poblacional 2022<br>
    • <b>MSP</b>: Registro establecimientos<br>
    • <b>MAATE</b>: Infraestructura petrolera
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Información del proyecto
    st.markdown("#### ℹ️ Sobre este análisis")
    st.caption("Dashboard interactivo para visualizar la relación entre actividad extractiva y acceso a servicios básicos en Ecuador.")
    
    st.markdown("---")
    
    # Test de carga de datos (colapsado por defecto)
    with st.expander("🔧 Diagnóstico Técnico"):
        if st.button("Verificar Datos"):
            test_data_loading()
    
    st.markdown("---")
    
    # Footer del sidebar
    st.caption("**Prototipo de Análisis**")
    st.caption("Dashboard para análisis de política pública")

# ═══════════════════════════════════════════════════════════════════════
# CONTENIDO PRINCIPAL
# ═══════════════════════════════════════════════════════════════════════

# Header principal con diseño institucional
st.markdown("""
<div class="main-header">
    <h1>🛢️ Paradoja Extractivista en Ecuador</h1>
    <p>Análisis Geoespacial • Infraestructura Petrolera vs. Acceso a Servicios de Salud</p>
</div>
""", unsafe_allow_html=True)

# Badges de fuentes oficiales
st.markdown("""
<div style='margin-bottom: 1.5rem;'>
    <span class='source-badge'>📊 CONALI</span>
    <span class='source-badge'>📊 INEC 2022</span>
    <span class='source-badge'>🏥 MSP</span>
    <span class='source-badge'>🛢️ MAATE</span>
    <span class='source-badge'>📍 1,236 Parroquias</span>
</div>
""", unsafe_allow_html=True)

# Hallazgo principal destacado
st.markdown("### 🎯 Hallazgo Principal")

col1, col2 = st.columns(2)

with col1:
    st.info("**⚠️ Paradoja Extractivista**: Las parroquias con actividad petrolera tienen **33% menos acceso** a servicios de salud (5.87 vs 8.88 establecimientos por 10,000 habitantes).")

with col2:
    st.success("**✓ Hallazgo Relevante**: Las comunidades afroecuatorianas (principalmente en Esmeraldas) **NO están expuestas** a actividad petrolera significativa, contrario a percepciones comunes.")

st.markdown("---")

st.markdown("### Métricas Clave")

# Obtener métricas desde archivos CSV
df_metricas = get_metricas_generales()

if not df_metricas.empty:
    metricas = df_metricas.iloc[0]
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="Total Parroquias",
            value=f"{int(metricas['total_parroquias']):,}"
        )
    
    with col2:
        st.metric(
            label="Parroquias con Petróleo",
            value=f"{int(metricas['parroquias_con_petroleo']):,}",
            delta=f"{int(metricas['parroquias_con_petroleo'])/int(metricas['total_parroquias'])*100:.1f}%"
        )
    
    with col3:
        st.metric(
            label="Pozos Petroleros",
            value=f"{int(metricas['total_pozos']):,}"
        )
    
    with col4:
        st.metric(
            label="Sitios Contaminados",
            value=f"{int(metricas['total_sitios_contaminados']):,}"
        )
    
    st.markdown("---")
    
    # Comparación de salud
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric(
            label="Salud SIN Petróleo",
            value=f"{metricas['salud_sin_petroleo']:.2f}",
            help="Establecimientos/10k hab"
        )
    
    with col2:
        st.metric(
            label="Salud CON Petróleo",
            value=f"{metricas['salud_con_petroleo']:.2f}",
            delta=f"{(metricas['salud_con_petroleo'] - metricas['salud_sin_petroleo']) / metricas['salud_sin_petroleo'] * 100:.1f}%",
            delta_color="inverse",
            help="Establecimientos/10k hab"
        )
    
    with col3:
        diferencia = ((metricas['salud_con_petroleo'] - metricas['salud_sin_petroleo']) / metricas['salud_sin_petroleo'] * 100)
        st.metric(
            label="Diferencia",
            value=f"{abs(diferencia):.1f}%",
            delta="menos acceso",
            delta_color="inverse"
        )

else:
    st.error("❌ No se pudieron cargar los datos. Verifica la configuración.")

st.markdown("---")

st.markdown("---")

# Contexto metodológico
with st.expander("📖 Metodología y Fuentes de Datos Oficiales"):
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        **📊 Fuentes de Datos:**
        - **CONALI**: Límites parroquiales oficiales (1,236 parroquias)
        - **INEC**: Censo de población y autoidentificación étnica (2022)
        - **MSP**: Registro de Establecimientos de Salud (RAS 2020)
        - **MAATE**: Catastro de infraestructura petrolera y sitios contaminados
        """)
    
    with col2:
        st.markdown("""
        **🔬 Métodos de Análisis:**
        - Proceso ETL con validación de calidad (7 notebooks)
        - Análisis espacial con intersecciones geométricas
        - Clustering K-Means (4 grupos territoriales)
        - Estadística inferencial (correlaciones, pruebas no paramétricas)
        """)

# Footer institucional
st.markdown("""
<div class='footer'>
    <strong>Prototipo de Dashboard Analítico</strong><br>
    Sistema de análisis geoespacial para evaluación de política pública<br>
    <small>Datos oficiales • Periodo 2020-2022</small>
</div>
""", unsafe_allow_html=True)

