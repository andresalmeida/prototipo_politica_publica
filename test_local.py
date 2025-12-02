#!/usr/bin/env python3
"""
Script de prueba para verificar que la migración funciona correctamente.
Ejecuta este script ANTES de hacer el deploy para verificar que todo está bien.
"""

import sys
from pathlib import Path

# Añadir dashboard al path
sys.path.insert(0, str(Path(__file__).parent / 'dashboard'))

print("=" * 70)
print("TEST DE MIGRACIÓN - PostgreSQL → CSV")
print("=" * 70)
print()

# Test 1: Importar módulos
print("✓ Test 1: Importando módulos...")
try:
    from utils.data_loader import (
        load_parroquias_completo,
        get_metricas_generales,
        get_top_petroleras,
        get_scatter_data,
        get_stats_provincia,
        get_provincias,
        get_datos_por_provincia,
        get_afro_con_petroleo
    )
    print("  ✅ Todos los módulos importados correctamente")
except Exception as e:
    print(f"  ❌ Error importando módulos: {e}")
    sys.exit(1)

print()

# Test 2: Cargar datos principales
print("✓ Test 2: Cargando datos principales...")
try:
    df = load_parroquias_completo()
    if df.empty:
        print("  ❌ DataFrame vacío")
        sys.exit(1)
    print(f"  ✅ Datos cargados: {len(df):,} parroquias")
    print(f"  ✅ Columnas: {len(df.columns)}")
    print(f"  ✅ Memoria: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
except Exception as e:
    print(f"  ❌ Error cargando datos: {e}")
    sys.exit(1)

print()

# Test 3: Métricas generales
print("✓ Test 3: Calculando métricas generales...")
try:
    df_metricas = get_metricas_generales()
    if df_metricas.empty:
        print("  ❌ Métricas vacías")
        sys.exit(1)
    
    metricas = df_metricas.iloc[0]
    print(f"  ✅ Total parroquias: {int(metricas['total_parroquias']):,}")
    print(f"  ✅ Con petróleo: {int(metricas['parroquias_con_petroleo']):,}")
    print(f"  ✅ Salud sin petróleo: {metricas['salud_sin_petroleo']:.2f}")
    print(f"  ✅ Salud con petróleo: {metricas['salud_con_petroleo']:.2f}")
    
    # Calcular diferencia
    diferencia = ((metricas['salud_con_petroleo'] - metricas['salud_sin_petroleo']) 
                  / metricas['salud_sin_petroleo'] * 100)
    print(f"  ✅ Diferencia: {diferencia:.1f}%")
except Exception as e:
    print(f"  ❌ Error calculando métricas: {e}")
    sys.exit(1)

print()

# Test 4: Top petroleras
print("✓ Test 4: Obteniendo top petroleras...")
try:
    df_top = get_top_petroleras(limit=5)
    if df_top.empty:
        print("  ❌ Top petroleras vacío")
        sys.exit(1)
    print(f"  ✅ Top 5 cargado: {len(df_top)} parroquias")
    print(f"  ✅ Parroquia #1: {df_top.iloc[0]['nombre_parroquia']}")
except Exception as e:
    print(f"  ❌ Error obteniendo top petroleras: {e}")
    sys.exit(1)

print()

# Test 5: Scatter data
print("✓ Test 5: Datos para scatter plot...")
try:
    df_scatter = get_scatter_data()
    if df_scatter.empty:
        print("  ❌ Scatter data vacío")
        sys.exit(1)
    print(f"  ✅ Scatter data: {len(df_scatter):,} registros")
    con_petroleo = (df_scatter['tiene_petroleo'] == 1).sum()
    sin_petroleo = (df_scatter['tiene_petroleo'] == 0).sum()
    print(f"  ✅ Con petróleo: {con_petroleo:,}")
    print(f"  ✅ Sin petróleo: {sin_petroleo:,}")
except Exception as e:
    print(f"  ❌ Error obteniendo scatter data: {e}")
    sys.exit(1)

print()

# Test 6: Stats por provincia
print("✓ Test 6: Estadísticas por provincia...")
try:
    df_provincias = get_stats_provincia()
    if df_provincias.empty:
        print("  ❌ Stats provincia vacío")
        sys.exit(1)
    print(f"  ✅ Provincias: {len(df_provincias)}")
    top_prov = df_provincias.iloc[0]
    print(f"  ✅ Provincia #1: {top_prov['nombre_provincia']}")
    print(f"  ✅ Infraestructura: {int(top_prov['total_infraestructura']):,}")
except Exception as e:
    print(f"  ❌ Error obteniendo stats provincia: {e}")
    sys.exit(1)

print()

# Test 7: Lista de provincias
print("✓ Test 7: Lista de provincias...")
try:
    df_prov = get_provincias()
    if df_prov.empty:
        print("  ❌ Lista provincias vacía")
        sys.exit(1)
    print(f"  ✅ Total provincias: {len(df_prov)}")
except Exception as e:
    print(f"  ❌ Error obteniendo lista provincias: {e}")
    sys.exit(1)

print()

# Test 8: Datos por provincia
print("✓ Test 8: Datos filtrados por provincia...")
try:
    df_datos = get_datos_por_provincia(provincia='PICHINCHA')
    if df_datos.empty:
        print("  ⚠️  No hay datos para Pichincha (puede ser normal)")
    else:
        print(f"  ✅ Pichincha: {len(df_datos)} parroquias")
except Exception as e:
    print(f"  ❌ Error filtrando por provincia: {e}")
    sys.exit(1)

print()

# Test 9: Afro con petróleo
print("✓ Test 9: Comunidades afro con petróleo...")
try:
    df_afro = get_afro_con_petroleo(limit=5, min_pct_afro=5)
    if df_afro.empty:
        print("  ⚠️  No hay comunidades afro con petróleo >5% (puede ser normal)")
    else:
        print(f"  ✅ Comunidades afro: {len(df_afro)}")
except Exception as e:
    print(f"  ❌ Error obteniendo afro con petróleo: {e}")
    sys.exit(1)

print()
print("=" * 70)
print("✅ TODOS LOS TESTS PASARON CORRECTAMENTE")
print("=" * 70)
print()
print("Próximos pasos:")
print("1. Ejecutar el dashboard localmente:")
print("   cd dashboard && streamlit run app.py")
print()
print("2. Si todo funciona, hacer deploy:")
print("   - Lee DEPLOY.md para instrucciones detalladas")
print("   - Sube a GitHub")
print("   - Deploy en Streamlit Cloud")
print()

