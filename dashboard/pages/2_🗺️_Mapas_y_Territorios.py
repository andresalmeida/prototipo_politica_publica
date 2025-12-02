"""
═══════════════════════════════════════════════════════════════════════
PÁGINA: ANÁLISIS ESPACIAL - MAPAS Y CLUSTERING
═══════════════════════════════════════════════════════════════════════
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import sys
from pathlib import Path

# Agregar utils al path
sys.path.append(str(Path(__file__).parent.parent))

from config import PAGE_CONFIG, COLORS
from utils.data_loader import load_parroquias_completo

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
    background: linear-gradient(135deg, #b91c1c 0%, #ef4444 50%, #f87171 100%);
    padding: 2.5rem 2rem;
    border-radius: 16px;
    margin-bottom: 2rem;
    box-shadow: 0 20px 60px rgba(239, 68, 68, 0.3);
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.6s ease-out;
'>
    <div style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);'></div>
    <h1 style='color: white; margin: 0; border: none; position: relative; z-index: 1; font-size: 2.25rem; font-weight: 800;'>🗺️ Mapas y Territorios</h1>
    <p style='color: rgba(255,255,255,0.95); margin-top: 0.75rem; position: relative; z-index: 1; font-size: 1.1rem; font-weight: 500;'>Visualización geoespacial avanzada y clustering territorial</p>
</div>
""", unsafe_allow_html=True)

# ═══════════════════════════════════════════════════════════════════════
# CARGAR DATOS GEOESPACIALES
# ═══════════════════════════════════════════════════════════════════════

df = load_parroquias_completo()

if df.empty:
    st.error("No se pudieron cargar los datos espaciales")
    st.stop()

# ═══════════════════════════════════════════════════════════════════════
# USAR CLUSTERS DEL NOTEBOOK 6
# ═══════════════════════════════════════════════════════════════════════

# Si no hay cluster_kmeans, crear uno temporal (no debería pasar)
if 'cluster_kmeans' not in df.columns:
    st.warning("No se encontraron clusters pre-calculados. Usando clustering temporal.")
    from sklearn.cluster import KMeans
    from sklearn.preprocessing import StandardScaler
    
    features = ['infraestructura', 'salud_10k', 'pct_afro', 'densidad_petroleo']
    df_cluster = df[features].copy().fillna(0)
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df_cluster)
    
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    df['cluster_kmeans'] = kmeans.fit_predict(X_scaled)

# Renombrar para simplicidad en el código
df['cluster'] = df['cluster_kmeans']

# NO filtrar - mantener todas las parroquias (incluso sin cluster)
# El notebook 6 muestra todas las parroquias, solo colorea las que tienen cluster

# Debug: Mostrar cuántas parroquias se cargaron
st.sidebar.markdown("---")
st.sidebar.markdown(f"**Datos cargados:**")
st.sidebar.markdown(f"- Total parroquias: {len(df)}")
st.sidebar.markdown(f"- Con cluster: {df['cluster'].notna().sum()}")
st.sidebar.markdown(f"- Sin cluster: {df['cluster'].isna().sum()}")

# ═══════════════════════════════════════════════════════════════════════
# SECCIÓN 1: 4 MAPAS PRINCIPALES
# ═══════════════════════════════════════════════════════════════════════

st.markdown("### Mapas de Análisis Espacial")

# Crear los 4 mapas en columnas 2x2
col1, col2 = st.columns(2)

# MAPA 1: Acceso a Salud
with col1:
    df_salud = df[df['salud_10k'] > 0].copy()
    
    fig1 = px.scatter_mapbox(
        df_salud,
        lat='lat',
        lon='lon',
        color='salud_10k',
        color_continuous_scale='Greens',
        hover_name='nombre_parroquia',
        hover_data={
            'nombre_provincia': True,
            'salud_10k': ':.2f',
            'lat': False,
            'lon': False
        },
        zoom=5.2,
        height=400,
        labels={'salud_10k': 'Salud (10k hab)'}
    )
    
    fig1.update_layout(
        mapbox_style="carto-positron",
        margin={"r": 0, "t": 30, "l": 0, "b": 0},
        title={
            'text': 'Acceso a Salud (Establecimientos por 10k hab)',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 12}
        }
    )
    
    st.plotly_chart(fig1, use_container_width=True)
    st.markdown(f"""
    <div style='background: white; padding: 0.75rem 1rem; border-radius: 8px; border-left: 3px solid #10b981; margin-top: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);'>
        <p style='margin: 0; color: #475569; font-size: 0.9rem;'>
            <strong style='color: #047857;'>✓</strong> {len(df_salud):,} parroquias con datos de salud. 
            Áreas urbanas (costa y sierra centro) concentran mayor acceso.
        </p>
    </div>
    """, unsafe_allow_html=True)

# MAPA 2: Infraestructura Petrolera
with col2:
    df_petroleo = df[df['infraestructura'] > 0].copy()
    
    fig2 = px.scatter_mapbox(
        df_petroleo,
        lat='lat',
        lon='lon',
        color='infraestructura',
        color_continuous_scale='Reds',
        size='infraestructura',
        size_max=15,
        hover_name='nombre_parroquia',
        hover_data={
            'nombre_provincia': True,
            'infraestructura': True,
            'pozos': True,
            'lat': False,
            'lon': False
        },
        zoom=5.2,
        height=400,
        labels={'infraestructura': 'Infraestructura'}
    )
    
    fig2.update_layout(
        mapbox_style="carto-positron",
        margin={"r": 0, "t": 30, "l": 0, "b": 0},
        title={
            'text': 'Infraestructura Petrolera (conteo)',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 12}
        }
    )
    
    st.plotly_chart(fig2, use_container_width=True)
    st.markdown(f"""
    <div style='background: white; padding: 0.75rem 1rem; border-radius: 8px; border-left: 3px solid #ef4444; margin-top: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);'>
        <p style='margin: 0; color: #475569; font-size: 0.9rem;'>
            <strong style='color: #b91c1c;'>⚠</strong> {len(df_petroleo):,} parroquias con actividad petrolera. 
            Concentración en Amazonía (Sucumbíos, Orellana) y costa (Santa Elena).
        </p>
    </div>
    """, unsafe_allow_html=True)

col3, col4 = st.columns(2)

# MAPA 3: Presencia de Petróleo (Binario)
with col3:
    # Crear etiquetas legibles
    df_map3 = df.copy()
    df_map3['tiene_petroleo_str'] = df_map3['tiene_petroleo'].apply(
        lambda x: 'Con petróleo' if x == 1 else 'Sin petróleo'
    )
    
    # Colores exactos del notebook 6: lightblue (sin) y darkred (con)
    fig3 = px.scatter_mapbox(
        df_map3,
        lat='lat',
        lon='lon',
        color='tiene_petroleo_str',
        color_discrete_map={
            'Sin petróleo': '#add8e6',  # lightblue
            'Con petróleo': '#8b0000'   # darkred
        },
        hover_name='nombre_parroquia',
        hover_data={
            'nombre_provincia': True,
            'infraestructura': True,
            'lat': False,
            'lon': False,
            'tiene_petroleo_str': False
        },
        zoom=5.2,
        height=400,
        labels={'tiene_petroleo_str': ''},
        category_orders={'tiene_petroleo_str': ['Sin petróleo', 'Con petróleo']}
    )
    
    fig3.update_layout(
        mapbox_style="carto-positron",
        margin={"r": 0, "t": 30, "l": 0, "b": 0},
        title={
            'text': 'Presencia de Infraestructura Petrolera (Binario)',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 12}
        },
        showlegend=False  # Quitar leyenda para no tapar el mapa
    )
    
    st.plotly_chart(fig3, use_container_width=True)
    
    con_petroleo = len(df[df['tiene_petroleo'] == 1])
    sin_petroleo = len(df[df['tiene_petroleo'] == 0])
    st.markdown(f"""
    <div style='background: white; padding: 0.75rem 1rem; border-radius: 8px; border-left: 3px solid #3b82f6; margin-top: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);'>
        <p style='margin: 0; color: #475569; font-size: 0.9rem;'>
            <strong style='color: #1e40af;'>📊</strong> Con petróleo: <strong>{con_petroleo:,}</strong> | 
            Sin petróleo: <strong>{sin_petroleo:,}</strong>. 
            Solo el <strong style='color: #ef4444;'>8.6%</strong> tiene actividad petrolera.
        </p>
    </div>
    """, unsafe_allow_html=True)

# MAPA 4: Clusters + Densidad Petrolera
with col4:
    # Convertir cluster a string para colores discretos (manejar NaN)
    df_map4 = df.copy()
    df_map4['cluster_str'] = df_map4['cluster'].apply(
        lambda x: f'Cluster {int(x)}' if pd.notna(x) else 'Sin cluster'
    )
    
    # Crear tamaño de punto: base + densidad (para que todos sean visibles)
    df_map4['size_punto'] = 5 + df_map4['densidad_petroleo'] * 2
    
    # Colores exactos del notebook 6
    cluster_colors = {
        'Cluster 0': 'blue',
        'Cluster 1': 'red',
        'Cluster 2': 'green',
        'Cluster 3': 'orange',
        'Sin cluster': 'lightgray'
    }
    
    fig4 = px.scatter_mapbox(
        df_map4,
        lat='lat',
        lon='lon',
        color='cluster_str',
        color_discrete_map=cluster_colors,
        size='size_punto',
        size_max=20,
        hover_name='nombre_parroquia',
        hover_data={
            'nombre_provincia': True,
            'densidad_petroleo': ':.2f',
            'salud_10k': ':.2f',
            'lat': False,
            'lon': False,
            'cluster_str': True,
            'size_punto': False
        },
        zoom=5.2,
        height=400,
        labels={'cluster_str': 'Cluster', 'densidad_petroleo': 'Densidad'},
        category_orders={'cluster_str': ['Cluster 0', 'Cluster 1', 'Cluster 2', 'Cluster 3', 'Sin cluster']}
    )
    
    fig4.update_layout(
        mapbox_style="carto-positron",
        margin={"r": 0, "t": 30, "l": 0, "b": 0},
        title={
            'text': 'Clusters + Densidad Petrolera (tamaño del punto)',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 12}
        }
    )
    
    st.plotly_chart(fig4, use_container_width=True)
    
    # Contar parroquias por cluster
    c0 = (df['cluster'] == 0).sum()
    c1 = (df['cluster'] == 1).sum()
    c2 = (df['cluster'] == 2).sum()
    c3 = (df['cluster'] == 3).sum()
    sin_cluster = df['cluster'].isna().sum()
    
    st.markdown(f"""
    <div style='
        background: white;
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        border-left: 4px solid #8b5cf6;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        margin-top: 0.5rem;
    '>
        <div style='display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;'>
            <span style='font-size: 1.5rem;'>🎯</span>
            <strong style='color: #6d28d9; font-size: 1rem;'>Clustering Territorial</strong>
        </div>
        <p style='margin: 0; color: #475569; line-height: 1.7;'>
            K-Means identifica <strong>4 grupos distintos</strong>:
        </p>
        <ul style='margin: 0.75rem 0 0 0; padding-left: 1.5rem; color: #475569; line-height: 1.8;'>
            <li><strong style='color: #3b82f6;'>Cluster 0</strong> (n={c0}): Baja actividad petrolera</li>
            <li><strong style='color: #ef4444;'>Cluster 1</strong> (n={c1}): Alta actividad petrolera en Amazonía</li>
            <li><strong style='color: #10b981;'>Cluster 2</strong> (n={c2}): Sin petróleo, mejor salud</li>
            <li><strong style='color: #f59e0b;'>Cluster 3</strong> (n={c3}): Alta población afroecuatoriana (Esmeraldas)</li>
        </ul>
        <p style='margin: 0.75rem 0 0 0; color: #64748b; font-size: 0.85rem; font-style: italic;'>
            El tamaño del punto indica densidad petrolera (infraestructura/km²)
        </p>
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")

# ═══════════════════════════════════════════════════════════════════════
# SECCIÓN 2: PARADOJA EXTRACTIVISTA
# ═══════════════════════════════════════════════════════════════════════

st.markdown("### Paradoja Extractivista: Petróleo vs Salud")

col1, col2, col3 = st.columns(3)

# GRÁFICO 1: Scatter Plot con Tendencia
with col1:
    df_completo = df[(df['infraestructura'] > 0) & (df['salud_10k'] > 0)].copy()
    
    fig_scatter = px.scatter(
        df_completo,
        x='infraestructura',
        y='salud_10k',
        opacity=0.6,
        labels={
            'infraestructura': 'Núm. Infraestructura Petrolera',
            'salud_10k': 'Establecimientos por 10k hab'
        },
        hover_data=['nombre_parroquia', 'nombre_provincia']
    )
    
    # Añadir línea de tendencia
    from scipy import stats
    slope, intercept, r_value, p_value, std_err = stats.linregress(
        df_completo['infraestructura'], 
        df_completo['salud_10k']
    )
    
    line_x = [df_completo['infraestructura'].min(), df_completo['infraestructura'].max()]
    line_y = [slope * x + intercept for x in line_x]
    
    fig_scatter.add_trace(
        go.Scatter(
            x=line_x,
            y=line_y,
            mode='lines',
            name='Tendencia',
            line=dict(color='red', dash='dash'),
            showlegend=False
        )
    )
    
    # Añadir anotación con correlación
    fig_scatter.add_annotation(
        x=0.05,
        y=0.95,
        xref='paper',
        yref='paper',
        text=f'r = {r_value:.3f}<br>p = {p_value:.5f}',
        showarrow=False,
        bgcolor='white',
        bordercolor='black',
        borderwidth=1,
        font=dict(size=10)
    )
    
    fig_scatter.update_layout(
        title={
            'text': 'Paradoja Extractivista: Petróleo vs Salud',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 12}
        },
        height=400,
        showlegend=False
    )
    
    st.plotly_chart(fig_scatter, use_container_width=True)
    st.markdown(f"""
    <div style='background: white; padding: 0.75rem 1rem; border-radius: 8px; border-left: 3px solid #ef4444; margin-top: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);'>
        <p style='margin: 0; color: #475569; font-size: 0.9rem;'>
            <strong style='color: #b91c1c;'>📉</strong> Correlación negativa (r={r_value:.3f}). 
            A mayor infraestructura petrolera, <strong>menor acceso a salud</strong>. 
            La línea roja muestra la relación inversa.
        </p>
    </div>
    """, unsafe_allow_html=True)

# GRÁFICO 2: Boxplot por Cluster
with col2:
    # Filtrar solo parroquias con cluster válido para el boxplot
    df_box = df[df['cluster'].notna()].copy()
    df_box['cluster_str'] = 'C' + df_box['cluster'].astype(int).astype(str)
    
    fig_box = px.box(
        df_box,
        x='cluster_str',
        y='salud_10k',
        color='cluster_str',
        labels={
            'cluster_str': 'Cluster',
            'salud_10k': 'Establecimientos por 10k hab'
        },
        color_discrete_map={'C0': 'blue', 'C1': 'red', 'C2': 'green', 'C3': 'orange'},
        category_orders={'cluster_str': ['C0', 'C1', 'C2', 'C3']}
    )
    
    fig_box.update_layout(
        title={
            'text': 'Acceso a Salud por Cluster',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 12}
        },
        height=400,
        showlegend=False
    )
    
    st.plotly_chart(fig_box, use_container_width=True)
    
    # Identificar cluster petrolero
    cluster_stats = df.groupby('cluster')['infraestructura'].mean()
    cluster_petrolero = cluster_stats.idxmax()
    
    st.markdown(f"""
    <div style='background: white; padding: 0.75rem 1rem; border-radius: 8px; border-left: 3px solid #3b82f6; margin-top: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);'>
        <p style='margin: 0; color: #475569; font-size: 0.9rem;'>
            <strong style='color: #1e40af;'>📊</strong> Cluster <strong>{int(cluster_petrolero)}</strong> (petrolero) 
            tiene la mediana más baja. Outliers = capitales provinciales.
        </p>
    </div>
    """, unsafe_allow_html=True)

# GRÁFICO 3: Barras Comparativas
with col3:
    cluster_comparison = df.groupby('cluster').agg({
        'densidad_petroleo': 'mean',
        'salud_10k': 'mean'
    }).reset_index()
    
    # Normalizar para comparación visual
    cluster_comparison['densidad_norm'] = cluster_comparison['densidad_petroleo'] / cluster_comparison['densidad_petroleo'].max() * 20
    cluster_comparison['salud_norm'] = cluster_comparison['salud_10k']
    
    fig_bar = go.Figure()
    
    fig_bar.add_trace(go.Bar(
        x=cluster_comparison['cluster'],
        y=cluster_comparison['densidad_norm'],
        name='Densidad Petrolera (norm)',
        marker_color='#991b1b'
    ))
    
    fig_bar.add_trace(go.Bar(
        x=cluster_comparison['cluster'],
        y=cluster_comparison['salud_norm'],
        name='Establecimientos/10k hab',
        marker_color='#10b981'
    ))
    
    fig_bar.update_layout(
        title={
            'text': 'Paradoja: Petróleo Alto = Salud Baja',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 12}
        },
        xaxis_title='Cluster',
        yaxis_title='Valor',
        height=400,
        barmode='group',
        legend=dict(
            orientation='h',
            yanchor='bottom',
            y=1.02,
            xanchor='center',
            x=0.5,
            font=dict(size=9)
        )
    )
    
    st.plotly_chart(fig_bar, use_container_width=True)
    st.markdown(f"""
    <div style='background: white; padding: 0.75rem 1rem; border-radius: 8px; border-left: 3px solid #f59e0b; margin-top: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);'>
        <p style='margin: 0; color: #475569; font-size: 0.9rem;'>
            <strong style='color: #d97706;'>⚖️</strong> Cluster <strong>{int(cluster_petrolero)}</strong>: 
            alta densidad petrolera (rojo) pero <strong style='color: #ef4444;'>baja salud</strong> (verde). 
            Paradoja extractivista evidente.
        </p>
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")

# ═══════════════════════════════════════════════════════════════════════
# SECCIÓN 3: CARACTERIZACIÓN DE CLUSTERS
# ═══════════════════════════════════════════════════════════════════════

st.markdown("### Caracterización de Clusters")

# Calcular estadísticas por cluster (solo clusters válidos)
df_clusters_valid = df[df['cluster'].notna()].copy()
cluster_stats_full = df_clusters_valid.groupby('cluster').agg({
    'nombre_parroquia': 'count',
    'infraestructura': 'mean',
    'salud_10k': 'mean',
    'pct_afro': 'mean',
    'densidad_petroleo': 'mean'
}).round(2)

cluster_stats_full.columns = ['Num. Parroquias', 'Infraestructura Promedio', 'Salud Promedio', '% Afro Promedio', 'Densidad Petróleo']

st.dataframe(cluster_stats_full, use_container_width=True)

# Identificar características de cada cluster
cluster_petrolero = cluster_stats_full['Infraestructura Promedio'].idxmax()
cluster_salud = cluster_stats_full['Salud Promedio'].idxmax()
cluster_afro = cluster_stats_full['% Afro Promedio'].idxmax()

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown(f"""
    <div style='background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 1.25rem; border-radius: 10px; border-top: 3px solid #3b82f6; box-shadow: 0 2px 8px rgba(0,0,0,0.08);'>
        <div style='color: #1e40af; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.75rem;'>Cluster 0</div>
        <div style='font-size: 2rem; font-weight: 700; color: #3b82f6; margin-bottom: 0.5rem;'>{int(cluster_stats_full.loc[0, 'Num. Parroquias'])}</div>
        <div style='color: #64748b; font-size: 0.85rem; margin-bottom: 0.75rem;'>parroquias</div>
        <div style='background: white; padding: 0.5rem; border-radius: 6px; margin-bottom: 0.5rem;'>
            <div style='color: #64748b; font-size: 0.75rem;'>Infraestructura</div>
            <div style='color: #0f172a; font-weight: 600;'>{cluster_stats_full.loc[0, 'Infraestructura Promedio']:.2f}</div>
        </div>
        <div style='background: white; padding: 0.5rem; border-radius: 6px;'>
            <div style='color: #64748b; font-size: 0.75rem;'>Salud/10k hab</div>
            <div style='color: #0f172a; font-weight: 600;'>{cluster_stats_full.loc[0, 'Salud Promedio']:.2f}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown(f"""
    <div style='background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 1.25rem; border-radius: 10px; border-top: 3px solid #ef4444; box-shadow: 0 2px 8px rgba(0,0,0,0.08);'>
        <div style='color: #b91c1c; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.75rem;'>Cluster 1 🔴</div>
        <div style='font-size: 2rem; font-weight: 700; color: #ef4444; margin-bottom: 0.5rem;'>{int(cluster_stats_full.loc[1, 'Num. Parroquias'])}</div>
        <div style='color: #64748b; font-size: 0.85rem; margin-bottom: 0.75rem;'>parroquias petroleras</div>
        <div style='background: white; padding: 0.5rem; border-radius: 6px; margin-bottom: 0.5rem;'>
            <div style='color: #64748b; font-size: 0.75rem;'>Infraestructura</div>
            <div style='color: #0f172a; font-weight: 600;'>{cluster_stats_full.loc[1, 'Infraestructura Promedio']:.2f}</div>
        </div>
        <div style='background: white; padding: 0.5rem; border-radius: 6px;'>
            <div style='color: #64748b; font-size: 0.75rem;'>Salud/10k hab</div>
            <div style='color: #0f172a; font-weight: 600;'>{cluster_stats_full.loc[1, 'Salud Promedio']:.2f}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown(f"""
    <div style='background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 1.25rem; border-radius: 10px; border-top: 3px solid #10b981; box-shadow: 0 2px 8px rgba(0,0,0,0.08);'>
        <div style='color: #047857; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.75rem;'>Cluster 2 ✅</div>
        <div style='font-size: 2rem; font-weight: 700; color: #10b981; margin-bottom: 0.5rem;'>{int(cluster_stats_full.loc[2, 'Num. Parroquias'])}</div>
        <div style='color: #64748b; font-size: 0.85rem; margin-bottom: 0.75rem;'>mejor salud</div>
        <div style='background: white; padding: 0.5rem; border-radius: 6px; margin-bottom: 0.5rem;'>
            <div style='color: #64748b; font-size: 0.75rem;'>Infraestructura</div>
            <div style='color: #0f172a; font-weight: 600;'>{cluster_stats_full.loc[2, 'Infraestructura Promedio']:.2f}</div>
        </div>
        <div style='background: white; padding: 0.5rem; border-radius: 6px;'>
            <div style='color: #64748b; font-size: 0.75rem;'>Salud/10k hab</div>
            <div style='color: #0f172a; font-weight: 600;'>{cluster_stats_full.loc[2, 'Salud Promedio']:.2f}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

with col4:
    st.markdown(f"""
    <div style='background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 1.25rem; border-radius: 10px; border-top: 3px solid #f59e0b; box-shadow: 0 2px 8px rgba(0,0,0,0.08);'>
        <div style='color: #d97706; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.75rem;'>Cluster 3 👥</div>
        <div style='font-size: 2rem; font-weight: 700; color: #f59e0b; margin-bottom: 0.5rem;'>{int(cluster_stats_full.loc[3, 'Num. Parroquias'])}</div>
        <div style='color: #64748b; font-size: 0.85rem; margin-bottom: 0.75rem;'>comunidades afro</div>
        <div style='background: white; padding: 0.5rem; border-radius: 6px; margin-bottom: 0.5rem;'>
            <div style='color: #64748b; font-size: 0.75rem;'>Infraestructura</div>
            <div style='color: #0f172a; font-weight: 600;'>{cluster_stats_full.loc[3, 'Infraestructura Promedio']:.2f}</div>
        </div>
        <div style='background: white; padding: 0.5rem; border-radius: 6px;'>
            <div style='color: #64748b; font-size: 0.75rem;'>Salud/10k hab</div>
            <div style='color: #0f172a; font-weight: 600;'>{cluster_stats_full.loc[3, 'Salud Promedio']:.2f}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# Interpretación final
st.markdown(f"""
<div style='
    background: white;
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    border-left: 4px solid #3b82f6;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    margin-top: 1.5rem;
'>
    <div style='display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;'>
        <span style='font-size: 1.5rem;'>🎯</span>
        <strong style='color: #1e40af; font-size: 1rem;'>Conclusiones del Análisis Espacial</strong>
    </div>
    <p style='margin: 0; color: #475569; line-height: 1.7;'>
        <strong style='color: #ef4444;'>Cluster {int(cluster_petrolero)}</strong> concentra la mayor actividad petrolera en Amazonía. 
        <strong style='color: #10b981;'>Cluster {int(cluster_salud)}</strong> tiene el mejor acceso a salud sin petróleo. 
        <strong style='color: #f59e0b;'>Cluster {int(cluster_afro)}</strong> presenta la mayor población afroecuatoriana (Esmeraldas). 
        Cluster 0 representa parroquias con características intermedias.
    </p>
</div>
""", unsafe_allow_html=True)

st.markdown("---")
st.markdown("""
<div style='text-align: center; padding: 2rem 0; color: #64748b; font-size: 0.9rem;'>
    <strong style='color: #1e293b;'>Prototipo de Dashboard Analítico</strong><br>
    Análisis de Política Pública • 2025
</div>
""", unsafe_allow_html=True)
