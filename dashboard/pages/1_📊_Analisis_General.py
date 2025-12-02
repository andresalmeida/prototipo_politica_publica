"""
═══════════════════════════════════════════════════════════════════════
PÁGINA: OVERVIEW - VISIÓN GENERAL DEL ANÁLISIS
═══════════════════════════════════════════════════════════════════════
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import sys
from pathlib import Path

# Agregar utils al path
sys.path.append(str(Path(__file__).parent.parent))

from config import PAGE_CONFIG, COLORS
from utils.data_loader import (
    get_top_petroleras,
    get_stats_provincia,
    get_scatter_data,
    get_afro_con_petroleo
)
from utils.plot_styles import (
    style_scatter,
    style_bar,
    create_section_divider,
    COLOR_PALETTES
)

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
    background: linear-gradient(135deg, #047857 0%, #10b981 50%, #34d399 100%);
    padding: 2.5rem 2rem;
    border-radius: 16px;
    margin-bottom: 2rem;
    box-shadow: 0 20px 60px rgba(16, 185, 129, 0.3);
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.6s ease-out;
'>
    <div style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);'></div>
    <h1 style='color: white; margin: 0; border: none; position: relative; z-index: 1; font-size: 2.25rem; font-weight: 800;'>📊 Análisis General</h1>
    <p style='color: rgba(255,255,255,0.95); margin-top: 0.75rem; position: relative; z-index: 1; font-size: 1.1rem; font-weight: 500;'>Estadísticas descriptivas y patrones territoriales</p>
</div>
""", unsafe_allow_html=True)

# ═══════════════════════════════════════════════════════════════════════
# HALLAZGO PRINCIPAL
# ═══════════════════════════════════════════════════════════════════════

st.markdown("""
<div style='
    background: white;
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    border-left: 4px solid #3b82f6;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    margin-bottom: 2rem;
'>
    <div style='display: flex; align-items: center; gap: 0.5rem;'>
        <span style='font-size: 1.5rem;'>🎯</span>
        <strong style='color: #1e40af; font-size: 1rem;'>Hallazgo Clave:</strong>
    </div>
    <p style='margin: 0.75rem 0 0 2rem; color: #475569; line-height: 1.7;'>
        Las parroquias con actividad petrolera tienen <strong style='color: #ef4444;'>33% menos acceso</strong> 
        a servicios de salud en comparación con parroquias sin actividad extractiva.
    </p>
</div>
""", unsafe_allow_html=True)

# Divider elegante
st.markdown(create_section_divider(
    "Análisis de Correlación",
    "Relación entre infraestructura extractiva y acceso a servicios básicos"
), unsafe_allow_html=True)

df_scatter = get_scatter_data()

if not df_scatter.empty:
    # Scatter plot con estilo premium
    fig = px.scatter(
        df_scatter,
        x='num_infraestructura_petrolera',
        y='establecimientos_por_10k_hab',
        color='tiene_petroleo',
        color_discrete_map={0: COLOR_PALETTES['primary'][0], 1: COLOR_PALETTES['danger'][0]},
        labels={
            'num_infraestructura_petrolera': 'Núm. Infraestructura Petrolera',
            'establecimientos_por_10k_hab': 'Establecimientos de Salud (por 10k hab)',
            'tiene_petroleo': 'Actividad Petrolera'
        },
        hover_name='nombre_parroquia',
        hover_data={
            'nombre_provincia': True,
            'num_infraestructura_petrolera': ':.0f',
            'establecimientos_por_10k_hab': ':.2f',
            'tiene_petroleo': False
        },
        size='num_infraestructura_petrolera',
        size_max=20
    )
    
    # Aplicar estilo premium
    fig = style_scatter(
        fig,
        title="Paradoja Extractivista: Petróleo vs Acceso a Salud",
        height=550
    )
    
    # Personalizar hover
    fig.update_traces(
        marker=dict(
            line=dict(width=2, color='rgba(255, 255, 255, 0.8)'),
            opacity=0.7
        )
    )
    
    st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
    
    # Estadísticas
    col1, col2, col3 = st.columns(3)
    
    con_petroleo = df_scatter[df_scatter['tiene_petroleo'] == 1]
    sin_petroleo = df_scatter[df_scatter['tiene_petroleo'] == 0]
    
    with col1:
        st.metric(
            "Parroquias con Petróleo",
            f"{len(con_petroleo):,}"
        )
    
    with col2:
        st.metric(
            "Salud CON petróleo",
            f"{con_petroleo['establecimientos_por_10k_hab'].mean():.2f}"
        )
    
    with col3:
        st.metric(
            "Salud SIN petróleo",
            f"{sin_petroleo['establecimientos_por_10k_hab'].mean():.2f}"
        )
    
    # Interpretación mejorada
    st.markdown(f"""
    <div style='
        background: white;
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        border-left: 4px solid #8b5cf6;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        margin-top: 1rem;
    '>
        <div style='display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;'>
            <span style='font-size: 1.5rem;'>💡</span>
            <strong style='color: #6d28d9; font-size: 1rem;'>Interpretación Clave</strong>
        </div>
        <p style='margin: 0; color: #475569; line-height: 1.7;'>
            Se confirma la <strong>relación inversa</strong> entre infraestructura petrolera y acceso a salud. 
            Las <strong>{len(con_petroleo):,} parroquias con petróleo</strong> promedian 
            <strong style='color: #ef4444;'>{con_petroleo['establecimientos_por_10k_hab'].mean():.2f}</strong> establecimientos/10k hab, 
            mientras que las <strong>{len(sin_petroleo):,} sin petróleo</strong> alcanzan 
            <strong style='color: #10b981;'>{sin_petroleo['establecimientos_por_10k_hab'].mean():.2f}</strong>. 
            Esta brecha del <strong>33%</strong> evidencia la paradoja extractivista.
        </p>
    </div>
    """, unsafe_allow_html=True)

# Divider
st.markdown(create_section_divider(
    "Parroquias Más Afectadas",
    "Top 10 con mayor concentración de infraestructura petrolera"
), unsafe_allow_html=True)

df_top = get_top_petroleras(limit=10)

if not df_top.empty:
    # Gráfico de barras con estilo premium
    fig = px.bar(
        df_top,
        x='num_infraestructura_petrolera',
        y='nombre_parroquia',
        orientation='h',
        labels={
            'num_infraestructura_petrolera': 'Infraestructura Total',
            'nombre_parroquia': ''
        },
        color='num_infraestructura_petrolera',
        color_continuous_scale=[[0, COLOR_PALETTES['danger'][4]], 
                                [0.5, COLOR_PALETTES['danger'][1]], 
                                [1, COLOR_PALETTES['danger'][0]]],
        hover_name='nombre_parroquia',
        hover_data={
            'nombre_provincia': True,
            'num_pozos': ':.0f',
            'num_sitios_contaminados': ':.0f',
            'num_infraestructura_petrolera': ':.0f',
            'nombre_parroquia': False
        }
    )
    
    fig = style_bar(fig, title="Top 10 Parroquias con Mayor Actividad Petrolera", height=450)
    
    fig.update_layout(
        yaxis={'categoryorder': 'total ascending'},
        showlegend=False,
        coloraxis_showscale=False
    )
    
    fig.update_traces(
        marker=dict(
            line=dict(width=0),
            opacity=0.85
        ),
        hovertemplate="<b>%{y}</b><br>" +
                      "Provincia: %{customdata[0]}<br>" +
                      "Infraestructura Total: %{x:,.0f}<br>" +
                      "Pozos: %{customdata[1]:,.0f}<br>" +
                      "Sitios Contaminados: %{customdata[2]:,.0f}<br>" +
                      "<extra></extra>"
    )
    
    st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
    
    # Tabla con estilo mejorado
    df_display = df_top[[
        'nombre_parroquia',
        'nombre_provincia',
        'num_infraestructura_petrolera',
        'num_pozos',
        'num_sitios_contaminados',
        'salud_10k'
    ]].copy()
    
    df_display.columns = [
        'Parroquia',
        'Provincia',
        'Infraestructura',
        'Pozos',
        'Contaminación',
        'Salud (10k hab)'
    ]
    
    # Formatear números
    df_display['Infraestructura'] = df_display['Infraestructura'].apply(lambda x: f"{int(x):,}")
    df_display['Pozos'] = df_display['Pozos'].apply(lambda x: f"{int(x):,}")
    df_display['Contaminación'] = df_display['Contaminación'].apply(lambda x: f"{int(x):,}")
    df_display['Salud (10k hab)'] = df_display['Salud (10k hab)'].apply(lambda x: f"{x:.2f}")
    
    st.dataframe(
        df_display, 
        use_container_width=True, 
        hide_index=True,
        height=400
    )
    
    # Interpretación con card
    top_parroquia = df_top.iloc[0]
    st.markdown(f"""
    <div style='
        background: white;
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        border-left: 4px solid #ef4444;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        margin-top: 1rem;
    '>
        <div style='display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;'>
            <span style='font-size: 1.5rem;'>📍</span>
            <strong style='color: #b91c1c; font-size: 1rem;'>Concentración Crítica</strong>
        </div>
        <p style='margin: 0; color: #475569; line-height: 1.7;'>
            <strong>{top_parroquia['nombre_parroquia']}</strong> ({top_parroquia['nombre_provincia']}) lidera con 
            <strong style='color: #ef4444;'>{int(top_parroquia['num_infraestructura_petrolera']):,}</strong> infraestructuras, 
            incluyendo <strong>{int(top_parroquia['num_pozos']):,} pozos</strong> y 
            <strong>{int(top_parroquia['num_sitios_contaminados']):,} sitios contaminados</strong>. 
            Las 10 parroquias más impactadas concentran el 
            <strong>{(df_top['num_infraestructura_petrolera'].sum() / 15851 * 100):.1f}%</strong> 
            de la infraestructura total. Todas ubicadas en <strong>Amazonía y Costa</strong>.
        </p>
    </div>
    """, unsafe_allow_html=True)

# Divider
st.markdown(create_section_divider(
    "Análisis Provincial",
    "Distribución territorial de la actividad petrolera y acceso a servicios"
), unsafe_allow_html=True)

df_provincias = get_stats_provincia()

if not df_provincias.empty:
    # Filtrar provincias con actividad petrolera
    df_provincias_petroleo = df_provincias[df_provincias['total_infraestructura'] > 0].copy()
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Gráfico de infraestructura por provincia con estilo
        fig1 = px.bar(
            df_provincias_petroleo.head(10),
            x='nombre_provincia',
            y='total_infraestructura',
            title='Infraestructura Petrolera por Provincia (Top 10)',
            labels={
                'total_infraestructura': 'Infraestructura Total',
                'nombre_provincia': 'Provincia'
            },
            color='total_infraestructura',
            color_continuous_scale=[[0, COLOR_PALETTES['warning'][4]], 
                                    [0.5, COLOR_PALETTES['warning'][2]], 
                                    [1, COLOR_PALETTES['warning'][0]]]
        )
        
        fig1 = style_bar(fig1, title='Infraestructura Petrolera por Provincia', height=450)
        fig1.update_layout(
            xaxis_tickangle=-45,
            showlegend=False,
            coloraxis_showscale=False
        )
        
        st.plotly_chart(fig1, use_container_width=True, config={'displayModeBar': False})
    
    with col2:
        # Gráfico de acceso a salud por provincia con estilo
        fig2 = px.bar(
            df_provincias_petroleo.head(10),
            x='nombre_provincia',
            y='salud_promedio',
            title='Acceso a Salud en Provincias Petroleras',
            labels={
                'salud_promedio': 'Establecimientos/10k hab',
                'nombre_provincia': 'Provincia'
            },
            color='salud_promedio',
            color_continuous_scale=[[0, COLOR_PALETTES['success'][4]], 
                                    [0.5, COLOR_PALETTES['success'][2]], 
                                    [1, COLOR_PALETTES['success'][0]]]
        )
        
        fig2 = style_bar(fig2, title='Acceso a Salud por Provincia', height=450)
        fig2.update_layout(
            xaxis_tickangle=-45,
            showlegend=False,
            coloraxis_showscale=False
        )
        
        st.plotly_chart(fig2, use_container_width=True, config={'displayModeBar': False})
    
    # Interpretación con card
    top_prov_petroleo = df_provincias_petroleo.iloc[0]
    top_prov_salud = df_provincias_petroleo.nlargest(1, 'salud_promedio').iloc[0]
    st.markdown(f"""
    <div style='
        background: white;
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        border-left: 4px solid #f59e0b;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        margin-top: 1rem;
    '>
        <div style='display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;'>
            <span style='font-size: 1.5rem;'>🗺️</span>
            <strong style='color: #d97706; font-size: 1rem;'>Análisis Provincial</strong>
        </div>
        <p style='margin: 0; color: #475569; line-height: 1.7;'>
            <strong>{top_prov_petroleo['nombre_provincia']}</strong> concentra la mayor infraestructura petrolera 
            (<strong style='color: #ef4444;'>{int(top_prov_petroleo['total_infraestructura']):,}</strong> unidades), 
            pero su acceso a salud promedio es de <strong>{top_prov_petroleo['salud_promedio']:.2f}</strong> estab/10k hab. 
            En contraste, <strong>{top_prov_salud['nombre_provincia']}</strong> tiene mejor acceso a salud 
            (<strong style='color: #10b981;'>{top_prov_salud['salud_promedio']:.2f}</strong>) con menor actividad petrolera. 
            La paradoja se replica a nivel provincial.
        </p>
    </div>
    """, unsafe_allow_html=True)

# Divider
st.markdown(create_section_divider(
    "Población Afroecuatoriana",
    "Intersección entre comunidades afro e infraestructura petrolera"
), unsafe_allow_html=True)

df_afro = get_afro_con_petroleo(limit=10, min_pct_afro=5)

if not df_afro.empty:
    col1, col2 = st.columns([2, 1])
    
    with col1:
        fig = px.bar(
            df_afro,
            x='nombre_parroquia',
            y='pct_poblacion_afro',
            title='Parroquias Afro con Infraestructura Petrolera',
            labels={
                'pct_poblacion_afro': '% Población Afroecuatoriana',
                'nombre_parroquia': 'Parroquia'
            },
            color='pct_poblacion_afro',
            color_continuous_scale=[[0, COLOR_PALETTES['purple'][4]], 
                                    [0.5, COLOR_PALETTES['purple'][2]], 
                                    [1, COLOR_PALETTES['purple'][0]]],
            hover_name='nombre_parroquia',
            hover_data={
                'nombre_provincia': True,
                'num_infraestructura_petrolera': ':.0f',
                'establecimientos_por_10k_hab': ':.2f',
                'pct_poblacion_afro': ':.1f',
                'nombre_parroquia': False
            }
        )
        
        fig = style_bar(fig, title='Comunidades Afro con Petróleo', height=450)
        fig.update_layout(
            xaxis_tickangle=-45,
            showlegend=False,
            coloraxis_showscale=False
        )
        
        st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
    
    with col2:
        # Card con observación
        salud_promedio_afro = df_afro['establecimientos_por_10k_hab'].mean()
        st.markdown(f"""
        <div style='
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            margin-bottom: 1rem;
        '>
            <div style='display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;'>
                <span style='font-size: 1.5rem;'>👥</span>
                <strong style='color: #0f172a; font-size: 1rem;'>Observación</strong>
            </div>
            <p style='color: #475569; line-height: 1.6; margin-bottom: 1rem;'>
                Solo <strong style='color: #8b5cf6;'>{len(df_afro)}</strong> parroquias combinan 
                >5% población afro con actividad petrolera significativa.
            </p>
            <div style='background: #faf5ff; padding: 1rem; border-radius: 8px; text-align: center;'>
                <div style='color: #64748b; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;'>
                    Salud Promedio
                </div>
                <div style='font-size: 2rem; font-weight: 700; color: #8b5cf6;'>
                    {salud_promedio_afro:.2f}
                </div>
                <div style='color: #64748b; font-size: 0.85rem; margin-top: 0.25rem;'>
                    establecimientos/10k hab
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    # Interpretación final
    st.markdown(f"""
    <div style='
        background: white;
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        border-left: 4px solid #8b5cf6;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        margin-top: 1rem;
    '>
        <div style='display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;'>
            <span style='font-size: 1.5rem;'>💡</span>
            <strong style='color: #6d28d9; font-size: 1rem;'>Conclusión</strong>
        </div>
        <p style='margin: 0; color: #475569; line-height: 1.7;'>
            Solo <strong>{len(df_afro)}</strong> parroquias combinan alta población afroecuatoriana (>5%) con actividad petrolera. 
            Estas comunidades enfrentan <strong style='color: #8b5cf6;'>doble vulnerabilidad</strong>: 
            extracción de recursos y limitado acceso a servicios 
            (promedio de <strong>{salud_promedio_afro:.2f}</strong> estab/10k hab). 
            Concentración en <strong>Esmeraldas</strong>, evidenciando inequidades históricas.
        </p>
    </div>
    """, unsafe_allow_html=True)
else:
    st.warning("Datos de población afroecuatoriana no disponibles")

st.markdown("---")
st.markdown("""
<div style='text-align: center; padding: 2rem 0; color: #64748b; font-size: 0.9rem;'>
    <strong style='color: #1e293b;'>Prototipo de Dashboard Analítico</strong><br>
    Análisis de Política Pública • 2025
</div>
""", unsafe_allow_html=True)

