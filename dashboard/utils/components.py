"""
═══════════════════════════════════════════════════════════════════════
MÓDULO: COMPONENTES REUTILIZABLES
Componentes HTML/CSS para mantener consistencia visual
═══════════════════════════════════════════════════════════════════════
"""

def create_section_divider(title: str, subtitle: str = "") -> str:
    """
    Crea un divisor de sección elegante con título y subtítulo.
    
    Args:
        title: Título de la sección
        subtitle: Subtítulo opcional
    
    Returns:
        HTML string del divisor
    """
    subtitle_html = f"<p style='color: #64748b; font-size: 1rem; margin: 0.5rem 0 0 0;'>{subtitle}</p>" if subtitle else ""
    
    return f"""
    <div style='background: linear-gradient(90deg, #3b82f6, #8b5cf6); height: 3px; border-radius: 10px; margin: 2.5rem 0 1.5rem 0;'></div>
    <h2 style='color: #1e293b; font-weight: 700; margin-bottom: 0.5rem;'>{title}</h2>
    {subtitle_html}
    """

def create_info_card(icon: str, title: str, content: str, border_color: str = "#3b82f6") -> str:
    """
    Crea una card informativa con icono, título y contenido.
    
    Args:
        icon: Emoji o icono
        title: Título de la card
        content: Contenido HTML
        border_color: Color del borde izquierdo (hex)
    
    Returns:
        HTML string de la card
    """
    return f"""
    <div style='
        background: white;
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        border-left: 4px solid {border_color};
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        margin-bottom: 1.5rem;
    '>
        <div style='display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;'>
            <span style='font-size: 1.5rem;'>{icon}</span>
            <strong style='color: {border_color}; font-size: 1rem;'>{title}</strong>
        </div>
        {content}
    </div>
    """

def create_metric_card(label: str, value: str, subtitle: str = "", color: str = "#3b82f6", bg_gradient: str = "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)") -> str:
    """
    Crea una card de métrica con valor destacado.
    
    Args:
        label: Label de la métrica
        value: Valor a mostrar
        subtitle: Texto adicional opcional
        color: Color del valor (hex)
        bg_gradient: Gradiente de fondo
    
    Returns:
        HTML string de la card
    """
    subtitle_html = f"<div style='color: #64748b; font-size: 0.85rem; margin-top: 0.25rem;'>{subtitle}</div>" if subtitle else ""
    
    return f"""
    <div style='
        background: {bg_gradient};
        padding: 1.5rem;
        border-radius: 12px;
        border-top: 3px solid {color};
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        text-align: center;
    '>
        <div style='color: #64748b; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;'>
            {label}
        </div>
        <div style='font-size: 2.5rem; font-weight: 700; color: {color};'>
            {value}
        </div>
        {subtitle_html}
    </div>
    """

def create_cluster_card(cluster_num: int, num_parroquias: int, infraestructura: float, salud: float, 
                        emoji: str = "", label: str = "", color: str = "#3b82f6", 
                        bg_gradient: str = "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)") -> str:
    """
    Crea una card para caracterización de clusters.
    
    Args:
        cluster_num: Número del cluster
        num_parroquias: Cantidad de parroquias
        infraestructura: Promedio de infraestructura
        salud: Promedio de salud
        emoji: Emoji descriptivo opcional
        label: Label descriptivo opcional
        color: Color del cluster (hex)
        bg_gradient: Gradiente de fondo
    
    Returns:
        HTML string de la card
    """
    emoji_html = f" {emoji}" if emoji else ""
    label_html = f"<div style='color: #64748b; font-size: 0.85rem; margin-bottom: 0.75rem;'>{label}</div>" if label else ""
    
    return f"""
    <div style='
        background: {bg_gradient};
        padding: 1.25rem;
        border-radius: 10px;
        border-top: 3px solid {color};
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    '>
        <div style='color: {color}; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.75rem;'>
            Cluster {cluster_num}{emoji_html}
        </div>
        <div style='font-size: 2rem; font-weight: 700; color: {color}; margin-bottom: 0.5rem;'>
            {num_parroquias}
        </div>
        {label_html}
        <div style='background: white; padding: 0.5rem; border-radius: 6px; margin-bottom: 0.5rem;'>
            <div style='color: #64748b; font-size: 0.75rem;'>Infraestructura</div>
            <div style='color: #0f172a; font-weight: 600;'>{infraestructura:.2f}</div>
        </div>
        <div style='background: white; padding: 0.5rem; border-radius: 6px;'>
            <div style='color: #64748b; font-size: 0.75rem;'>Salud/10k hab</div>
            <div style='color: #0f172a; font-weight: 600;'>{salud:.2f}</div>
        </div>
    </div>
    """

def create_mini_card(icon: str, content: str, border_color: str = "#3b82f6") -> str:
    """
    Crea una mini card compacta para interpretaciones breves.
    
    Args:
        icon: Emoji o icono
        content: Contenido HTML
        border_color: Color del borde izquierdo (hex)
    
    Returns:
        HTML string de la mini card
    """
    return f"""
    <div style='
        background: white;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        border-left: 3px solid {border_color};
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        margin-top: 0.5rem;
    '>
        <p style='margin: 0; color: #475569; font-size: 0.9rem;'>
            <strong style='color: {border_color};'>{icon}</strong> {content}
        </p>
    </div>
    """

def create_footer() -> str:
    """
    Crea el footer estándar del dashboard.
    
    Returns:
        HTML string del footer
    """
    return """
    <div style='text-align: center; padding: 2rem 0; color: #64748b; font-size: 0.9rem;'>
        <strong style='color: #1e293b;'>Prototipo de Dashboard Analítico</strong><br>
        Análisis de Política Pública • 2025
    </div>
    """

def create_page_header(emoji: str, title: str, subtitle: str, gradient: str = "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #a78bfa 100%)") -> str:
    """
    Crea el header de una página con estilo premium.
    
    Args:
        emoji: Emoji del título
        title: Título de la página
        subtitle: Subtítulo
        gradient: Gradiente de fondo (CSS)
    
    Returns:
        HTML string del header
    """
    return f"""
    <style>
        @keyframes fadeIn {{ from {{ opacity: 0; transform: translateY(10px); }} to {{ opacity: 1; transform: translateY(0); }} }}
    </style>
    <div style='
        background: {gradient};
        padding: 2.5rem 2rem;
        border-radius: 16px;
        margin-bottom: 2rem;
        box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3);
        position: relative;
        overflow: hidden;
        animation: fadeIn 0.6s ease-out;
    '>
        <div style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%);'></div>
        <h1 style='color: white; margin: 0; border: none; position: relative; z-index: 1; font-size: 2.25rem; font-weight: 800;'>{emoji} {title}</h1>
        <p style='color: rgba(255,255,255,0.95); margin-top: 0.75rem; position: relative; z-index: 1; font-size: 1.1rem; font-weight: 500;'>{subtitle}</p>
    </div>
    """

# Constantes de colores por tipo
CARD_COLORS = {
    'primary': '#3b82f6',
    'success': '#10b981',
    'danger': '#ef4444',
    'warning': '#f59e0b',
    'purple': '#8b5cf6',
    'info': '#06b6d4'
}

CARD_GRADIENTS = {
    'blue': 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    'green': 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    'red': 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    'yellow': 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    'purple': 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    'cyan': 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)'
}

