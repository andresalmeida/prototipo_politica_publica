"""
═══════════════════════════════════════════════════════════════════════
ESTILOS PREMIUM PARA VISUALIZACIONES PLOTLY
═══════════════════════════════════════════════════════════════════════

Templates y configuraciones profesionales para gráficos.
"""

import plotly.graph_objects as go
import plotly.express as px

# ═══════════════════════════════════════════════════════════════════════
# TEMPLATE PREMIUM PERSONALIZADO
# ═══════════════════════════════════════════════════════════════════════

PREMIUM_TEMPLATE = go.layout.Template(
    layout=go.Layout(
        # Colores y fuentes
        font=dict(
            family="Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            size=13,
            color="#334155"
        ),
        
        # Título
        title=dict(
            font=dict(size=18, color="#0f172a", family="Inter"),
            x=0.5,
            xanchor="center",
            y=0.98,
            yanchor="top",
            pad=dict(t=10, b=10)
        ),
        
        # Fondo
        paper_bgcolor="white",
        plot_bgcolor="rgba(248, 250, 252, 0.5)",
        
        # Ejes
        xaxis=dict(
            showgrid=True,
            gridwidth=1,
            gridcolor="rgba(226, 232, 240, 0.5)",
            showline=True,
            linewidth=2,
            linecolor="rgba(203, 213, 225, 0.8)",
            zeroline=False,
            title=dict(font=dict(size=12, color="#64748b")),
            tickfont=dict(size=11, color="#64748b")
        ),
        
        yaxis=dict(
            showgrid=True,
            gridwidth=1,
            gridcolor="rgba(226, 232, 240, 0.5)",
            showline=True,
            linewidth=2,
            linecolor="rgba(203, 213, 225, 0.8)",
            zeroline=False,
            title=dict(font=dict(size=12, color="#64748b")),
            tickfont=dict(size=11, color="#64748b")
        ),
        
        # Leyenda
        legend=dict(
            bgcolor="rgba(255, 255, 255, 0.95)",
            bordercolor="rgba(226, 232, 240, 0.8)",
            borderwidth=1,
            font=dict(size=11, color="#475569"),
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        ),
        
        # Hover
        hoverlabel=dict(
            bgcolor="white",
            font=dict(size=12, family="Inter", color="#334155"),
            bordercolor="rgba(59, 130, 246, 0.3)",
            align="left"
        ),
        
        # Márgenes
        margin=dict(l=60, r=40, t=80, b=60)
    )
)

# ═══════════════════════════════════════════════════════════════════════
# PALETAS DE COLORES PROFESIONALES
# ═══════════════════════════════════════════════════════════════════════

COLOR_PALETTES = {
    'primary': ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
    'success': ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
    'danger': ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
    'warning': ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
    'purple': ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
    'gradient_blue': ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    'gradient_green': ['#047857', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
    'gradient_red': ['#b91c1c', '#ef4444', '#f87171', '#fca5a5', '#fecaca']
}

# ═══════════════════════════════════════════════════════════════════════
# FUNCIONES DE ESTILO PARA GRÁFICOS
# ═══════════════════════════════════════════════════════════════════════

def apply_premium_style(fig, title=None, height=None):
    """
    Aplica el estilo premium a cualquier figura de Plotly.
    
    Args:
        fig: Figura de Plotly
        title: Título opcional
        height: Altura opcional
    
    Returns:
        Figura con estilo aplicado
    """
    fig.update_layout(
        template=PREMIUM_TEMPLATE,
        title=title,
        height=height or 500,
        hovermode='closest',
        showlegend=True
    )
    
    return fig


def style_scatter(fig, title="", height=500):
    """Estilo específico para scatter plots."""
    fig.update_traces(
        marker=dict(
            line=dict(width=1.5, color='rgba(255, 255, 255, 0.8)'),
            opacity=0.75
        ),
        hovertemplate="<b>%{hovertext}</b><br>" +
                      "Infraestructura: %{x}<br>" +
                      "Salud: %{y:.2f}<br>" +
                      "<extra></extra>"
    )
    
    return apply_premium_style(fig, title, height)


def style_bar(fig, title="", height=500, color_palette='primary'):
    """Estilo específico para gráficos de barras."""
    colors = COLOR_PALETTES.get(color_palette, COLOR_PALETTES['primary'])
    
    fig.update_traces(
        marker=dict(
            line=dict(width=0),
            opacity=0.9
        ),
        hovertemplate="<b>%{label}</b><br>" +
                      "Valor: %{value:,.0f}<br>" +
                      "<extra></extra>"
    )
    
    return apply_premium_style(fig, title, height)


def style_line(fig, title="", height=500):
    """Estilo específico para gráficos de líneas."""
    fig.update_traces(
        mode='lines+markers',
        line=dict(width=3),
        marker=dict(size=8, line=dict(width=2, color='white')),
        hovertemplate="<b>%{x}</b><br>" +
                      "Valor: %{y:,.2f}<br>" +
                      "<extra></extra>"
    )
    
    return apply_premium_style(fig, title, height)


def create_kpi_card_html(label, value, delta=None, icon="📊", color="#3b82f6"):
    """
    Crea una tarjeta KPI en HTML con estilo premium.
    
    Args:
        label: Etiqueta del KPI
        value: Valor del KPI
        delta: Cambio/delta opcional
        icon: Emoji del icono
        color: Color del acento
    
    Returns:
        HTML string
    """
    delta_html = ""
    if delta:
        delta_color = "#10b981" if "+" in str(delta) else "#ef4444"
        delta_html = f"""
        <div style='
            display: inline-block;
            background: rgba(16, 185, 129, 0.1);
            color: {delta_color};
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-top: 0.5rem;
        '>
            {delta}
        </div>
        """
    
    return f"""
    <div style='
        background: white;
        padding: 1.75rem;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    ' onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 20px 25px rgba(59, 130, 246, 0.1)'" 
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.05)'">
        <div style='position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: {color};'></div>
        <div style='margin-left: 0.5rem;'>
            <div style='font-size: 2rem; margin-bottom: 0.5rem;'>{icon}</div>
            <div style='
                color: #64748b;
                font-size: 0.7rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                margin-bottom: 0.75rem;
            '>{label}</div>
            <div style='
                font-size: 2.5rem;
                font-weight: 800;
                color: {color};
                font-family: "JetBrains Mono", monospace;
                line-height: 1;
            '>{value}</div>
            {delta_html}
        </div>
    </div>
    """


def create_section_divider(title="", subtitle=""):
    """Crea un divider elegante entre secciones."""
    return f"""
    <div style='
        margin: 3rem 0 2rem 0;
        text-align: center;
        position: relative;
    '>
        <div style='
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
        '></div>
        <div style='
            position: relative;
            display: inline-block;
            background: white;
            padding: 0 2rem;
        '>
            <h3 style='
                color: #0f172a;
                font-size: 1.5rem;
                font-weight: 700;
                margin: 0;
            '>{title}</h3>
            {f"<p style='color: #64748b; font-size: 0.9rem; margin: 0.5rem 0 0 0;'>{subtitle}</p>" if subtitle else ""}
        </div>
    </div>
    """

