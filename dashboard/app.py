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
    /* Dashboard limpio y profesional */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Header limpio y elegante */
    .main-header {
        background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        padding: 2rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }
    
    .main-header h1 {
        color: white !important;
        font-weight: 700;
        margin: 0;
        border: none !important;
        padding: 0 !important;
        font-size: 2rem;
    }
    
    .main-header p {
        color: rgba(255, 255, 255, 0.95);
        font-size: 1rem;
        margin-top: 0.5rem;
        font-weight: 400;
    }
    
    /* Métricas limpias y elegantes */
    [data-testid="stMetricValue"] {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1e40af !important;
    }
    
    [data-testid="stMetricLabel"] {
        color: #64748b !important;
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    [data-testid="stMetricDelta"] {
        color: #64748b !important;
        font-weight: 500;
        font-size: 0.875rem;
    }
    
    /* Contenedor de métricas simple */
    [data-testid="stMetric"] {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;
    }
    
    [data-testid="stMetric"]:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        transform: translateY(-2px);
    }
    
    /* Títulos limpios */
    h1 {
        color: #0f172a;
        font-weight: 700;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid #3b82f6;
        margin-bottom: 1.5rem;
    }
    
    h2 {
        color: #1e293b;
        font-weight: 600;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }
    
    h3 {
        color: #334155;
        font-weight: 600;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    
    /* Alertas simples */
    .stAlert {
        border-radius: 8px;
        border-left: 4px solid;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    [data-testid="stAlert"] {
        padding: 1rem 1.25rem;
        font-weight: 500;
        line-height: 1.6;
    }
    
    /* Fondo principal limpio */
    .main {
        background-color: #ffffff !important;
    }
    
    .stApp {
        background-color: #ffffff !important;
    }
    
    section.main > div {
        background-color: #ffffff !important;
    }
    
    /* Bloques de código */
    .stCodeBlock {
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    /* Badges simples */
    .source-badge {
        display: inline-block;
        background: #f1f5f9;
        color: #475569;
        padding: 0.35rem 0.85rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        border: 1px solid #e2e8f0;
    }
    
    /* Sidebar limpio */
    [data-testid="stSidebar"] {
        background: #f8fafc !important;
        border-right: 1px solid #e2e8f0 !important;
    }
    
    [data-testid="stSidebar"] * {
        color: #1e293b !important;
    }
    
    [data-testid="stSidebar"] h3 {
        color: #0f172a !important;
        font-weight: 700;
    }
    
    [data-testid="stSidebar"] h4 {
        color: #3b82f6 !important;
        font-weight: 600;
        font-size: 0.85rem;
    }
    
    [data-testid="stSidebar"] hr {
        border: none;
        height: 1px;
        background: #e2e8f0;
        margin: 1rem 0;
    }
    
    /* Expander en sidebar */
    [data-testid="stSidebar"] [data-testid="stExpander"] {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
    }
    
    /* Botones en sidebar */
    [data-testid="stSidebar"] button {
        background: #3b82f6 !important;
        color: white !important;
        border: none !important;
        border-radius: 6px !important;
        font-weight: 600 !important;
    }
    
    [data-testid="stSidebar"] button:hover {
        background: #2563eb !important;
    }
    
    /* Footer simple */
    .footer {
        margin-top: 3rem;
        padding: 2rem 0;
        border-top: 1px solid #e2e8f0;
        text-align: center;
        color: #64748b;
    }
    
    .footer strong {
        color: #1e293b;
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

# Header limpio
st.markdown("""
<div class="main-header">
    <h1>Análisis Geoespacial - Evaluación de Política Pública</h1>
    <p>Análisis Geoespacial: Infraestructura Petrolera vs. Acceso a Servicios de Salud</p>
</div>
""", unsafe_allow_html=True)

# Badges de fuentes
st.markdown("""
<div style='margin-bottom: 1.5rem;'>
    <span class='source-badge'>📊 CONALI</span>
    <span class='source-badge'>📊 INEC 2022</span>
    <span class='source-badge'>🏥 MSP</span>
    <span class='source-badge'>🛢️ MAATE</span>
    <span class='source-badge'>📍 1,236 Parroquias</span>
</div>
""", unsafe_allow_html=True)

# Hallazgos principales con cards profesionales
st.markdown("### 🎯 Hallazgos Principales del Análisis")
st.markdown("")

col1, col2 = st.columns(2, gap="large")

with col1:
    st.markdown("""
    <div style='
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        border-left: 4px solid #ef4444;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        height: 100%;
    '>
        <div style='display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;'>
            <div style='font-size: 2rem;'>⚠️</div>
            <h4 style='margin: 0; color: #0f172a; font-size: 1.1rem; font-weight: 700;'>
                Paradoja Extractivista Confirmada
            </h4>
        </div>
        <p style='color: #475569; line-height: 1.7; margin-bottom: 1rem;'>
            Las parroquias con actividad petrolera presentan <strong style='color: #ef4444;'>33% menos acceso</strong> a servicios de salud:
        </p>
        <div style='background: #fef2f2; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;'>
            <div style='display: flex; justify-content: space-between; margin-bottom: 0.5rem;'>
                <span style='color: #64748b; font-size: 0.9rem;'>Con petróleo:</span>
                <strong style='color: #ef4444; font-size: 1.1rem;'>5.87</strong>
            </div>
            <div style='display: flex; justify-content: space-between;'>
                <span style='color: #64748b; font-size: 0.9rem;'>Sin petróleo:</span>
                <strong style='color: #10b981; font-size: 1.1rem;'>8.88</strong>
            </div>
            <div style='margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #fee2e2;'>
                <span style='color: #64748b; font-size: 0.85rem;'>Establecimientos por 10,000 habitantes</span>
            </div>
        </div>
        <p style='color: #64748b; font-size: 0.9rem; font-style: italic; margin: 0;'>
            La extracción de recursos no se traduce en mejor bienestar local.
        </p>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
    <div style='
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        border-left: 4px solid #3b82f6;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        height: 100%;
    '>
        <div style='display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;'>
            <div style='font-size: 2rem;'>📍</div>
            <h4 style='margin: 0; color: #0f172a; font-size: 1.1rem; font-weight: 700;'>
                Distribución Étnico-Territorial
            </h4>
        </div>
        <p style='color: #475569; line-height: 1.7; margin-bottom: 1rem;'>
            Las comunidades afroecuatorianas <strong style='color: #3b82f6;'>NO están expuestas</strong> a actividad petrolera significativa:
        </p>
        <div style='background: #eff6ff; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;'>
            <div style='margin-bottom: 0.75rem;'>
                <div style='color: #1e40af; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem;'>
                    ✓ Sin intersección geográfica fuerte
                </div>
                <div style='color: #64748b; font-size: 0.85rem; padding-left: 1.25rem;'>
                    Zonas afro vs. zonas petroleras separadas
                </div>
            </div>
            <div>
                <div style='color: #1e40af; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem;'>
                    ✓ Concentración diferenciada
                </div>
                <div style='color: #64748b; font-size: 0.85rem; padding-left: 1.25rem;'>
                    Esmeraldas (costa) ≠ Amazonía (petróleo)
                </div>
            </div>
        </div>
        <p style='color: #64748b; font-size: 0.9rem; font-style: italic; margin: 0;'>
            Contrario a percepciones comunes sobre impacto desproporcional.
        </p>
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")

st.markdown("### 📊 Métricas Clave")
st.markdown("---")

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
    st.markdown("### ⚖️ Comparación: Acceso a Salud")
    
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

# Footer simple
st.markdown("""
<div class='footer'>
    <strong>Prototipo de Dashboard Analítico</strong><br>
    Sistema de análisis geoespacial para evaluación de política pública<br>
    <small>Datos oficiales • Periodo 2020-2022 • CONALI, INEC, MSP, MAATE</small>
</div>
""", unsafe_allow_html=True)

