# 🚀 Guía de Deploy - Streamlit Cloud (GRATIS)

## ✅ Pre-requisitos

- Cuenta de GitHub (gratis)
- Cuenta de Streamlit Cloud (gratis) - [share.streamlit.io](https://share.streamlit.io)
- Git instalado en tu computadora

## 📋 Paso a Paso

### 1. Preparar el Repositorio en GitHub

```bash
# Navega a la carpeta del proyecto
cd /Users/mackbookandres/Desktop/prototipo_tfm

# Inicializa Git (si no lo has hecho)
git init

# Añade todos los archivos
git add .

# Haz commit
git commit -m "Initial commit: Dashboard Paradoja Extractivista"

# Crea el repositorio en GitHub y conecta
# Ve a github.com y crea un nuevo repositorio (por ejemplo: tfm-ecuador-dashboard)
git branch -M main
git remote add origin https://github.com/TU_USUARIO/tfm-ecuador-dashboard.git
git push -u origin main
```

### 2. Deploy en Streamlit Cloud

1. **Ve a**: [share.streamlit.io](https://share.streamlit.io)

2. **Conecta tu cuenta de GitHub**:
   - Click en "Sign in with GitHub"
   - Autoriza a Streamlit

3. **Crea un nuevo app**:
   - Click en "New app"
   - Selecciona tu repositorio: `tfm-ecuador-dashboard`
   - Branch: `main`
   - Main file path: `dashboard/app.py` ⚠️ **IMPORTANTE**
   - App URL: elige un nombre único (ej: `tfm-ecuador`)

4. **Click en "Deploy"**:
   - Streamlit instalará las dependencias automáticamente
   - En 2-3 minutos tu app estará lista
   - URL final: `https://tfm-ecuador.streamlit.app`

### 3. Configuración Adicional (Opcional)

Si necesitas variables de entorno:
1. En Streamlit Cloud, ve a "Settings" > "Secrets"
2. Añade tus variables (por ahora no las necesitas)

## 🔧 Solución de Problemas

### Error: "File not found: app.py"
**Solución**: Verifica que el "Main file path" sea `dashboard/app.py` (no solo `app.py`)

### Error: "No module named 'geopandas'"
**Solución**: Verifica que `requirements.txt` esté en la raíz del proyecto

### Error: "Cannot find parroquias_con_clusters.csv"
**Solución**: Verifica que la carpeta `data/` esté incluida en el repositorio

### El dashboard carga lento
**Solución**: Streamlit cachea los datos automáticamente con `@st.cache_data`

## 📊 Recursos Gratuitos de Streamlit Cloud

- **Apps públicas**: Ilimitadas
- **Recursos**: 1 GB RAM, 1 CPU
- **Storage**: Suficiente para CSVs y GeoJSONs
- **Actualizaciones**: Automáticas al hacer push a GitHub

## 🔄 Actualizar el Dashboard

```bash
# Haz cambios en tu código local
# ...

# Añade y commitea cambios
git add .
git commit -m "Actualización: descripción de cambios"

# Push a GitHub
git push

# Streamlit Cloud detectará los cambios y redesplegará automáticamente
```

## 🎯 Siguiente Paso

Una vez desplegado, comparte tu URL:
- En tu CV
- En tu TFM
- En LinkedIn
- Con tu director/a de tesis

## 💡 Tips Pro

1. **Dominio personalizado**: Puedes usar tu propio dominio (configuración en Streamlit Cloud)
2. **Apps privadas**: Requiere plan de pago (~$20/mes)
3. **Analytics**: Usa Google Analytics si quieres trackear visitas
4. **Performance**: Los datos CSV ya están optimizados con caché

## 📧 Soporte

- **Documentación**: [docs.streamlit.io](https://docs.streamlit.io)
- **Comunidad**: [discuss.streamlit.io](https://discuss.streamlit.io)
- **GitHub Issues**: [github.com/streamlit/streamlit](https://github.com/streamlit/streamlit/issues)

---

**¡Tu dashboard estará online en menos de 5 minutos!** 🎉

