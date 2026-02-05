# 🚀 Guía de Deployment

Esta guía te ayudará a desplegar el dashboard en plataformas gratuitas.

---

## 📋 Requisitos Previos

1. **Mapbox Access Token** (GRATUITO)
   - Ve a https://account.mapbox.com/access-tokens/
   - Crea una cuenta o inicia sesión
   - Crea un nuevo token (o usa el token por defecto)
   - El plan gratuito incluye **50,000 cargas de mapa por mes**

---

## 🌟 Opción 1: Vercel (Recomendada)

Vercel es la plataforma creada por los mismos desarrolladores de Next.js.

### Deploy Automático (One-click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deploy Manual

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Navegar al directorio del dashboard
cd dashboard-react

# 3. Configurar variable de entorno para Mapbox
vercel env add NEXT_PUBLIC_MAPBOX_TOKEN
# Cuando te pregunte, ingresa tu token de Mapbox

# 4. Deploy a preview
vercel

# 5. Deploy a producción
vercel --prod
```

### Configuración en Dashboard de Vercel

Si usas la interfaz web:

1. Sube tu código a GitHub/GitLab/Bitbucket
2. Ve a [vercel.com](https://vercel.com) e inicia sesión
3. Click en **"Add New Project"**
4. Importa tu repositorio
5. Configura:
   - **Framework Preset**: Next.js
   - **Root Directory**: `dashboard-react`
   - **Build Command**: `next build`
   - **Output Directory**: `dist`
6. En **Environment Variables**, agrega:
   - Name: `NEXT_PUBLIC_MAPBOX_TOKEN`
   - Value: `pk.tu_token_de_mapbox`
7. Click en **Deploy**

---

## 🌐 Opción 2: Netlify

### Deploy Manual

```bash
# 1. Navegar al directorio
cd dashboard-react

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env.local con tu token
echo "NEXT_PUBLIC_MAPBOX_TOKEN=pk.tu_token_aqui" > .env.local

# 4. Build
npm run build

# 5. Deploy con Netlify CLI
npx netlify deploy --prod --dir=dist
```

### Configuración en Dashboard de Netlify

1. Sube tu código a GitHub
2. Ve a [netlify.com](https://netlify.com)
3. **Add new site** → **Import an existing project**
4. Selecciona tu repositorio
5. Configura:
   - **Base directory**: `dashboard-react`
   - **Build command**: `npm run build`
   - **Publish directory**: `dashboard-react/dist`
6. En **Environment variables**, agrega:
   - Key: `NEXT_PUBLIC_MAPBOX_TOKEN`
   - Value: `pk.tu_token_de_mapbox`
7. Click en **Deploy site**

---

## 🐳 Opción 3: Docker (Self-hosted)

```bash
cd dashboard-react

# Build
docker build -t dashboard-ecuador .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_MAPBOX_TOKEN=pk.tu_token_aqui \
  dashboard-ecuador
```

---

## 🔒 Seguridad Importante

### ❌ NUNCA hagas esto:

- Commitear archivos `.env.local` con tokens reales
- Hardcodear tokens en el código fuente
- Compartir screenshots con tokens visibles

### ✅ SÍ haz esto:

- Usar `.env.local.example` como template
- Configurar tokens en variables de entorno de la plataforma
- Rotar tokens si crees que fueron expuestos
- Monitorear el uso en el dashboard de Mapbox

---

## 🗑️ Si accidentalmente expusiste un token

```bash
# 1. Inmediatamente rota el token en Mapbox Studio
# 2. Elimina el archivo del historial de git (si fue commiteado)
git rm --cached dashboard-react/.env.local
git commit -m "Remove exposed env file"

# 3. Si el token estuvo en commits anteriores, usa BFG Repo-Cleaner
# https://rtyley.github.io/bfg-repo-cleaner/
```

---

## 📊 Monitoreo de Uso (Mapbox)

1. Ve a https://account.mapbox.com/
2. En **Statistics** puedes ver:
   - Cargas de mapa (Map Loads)
   - Upciones de direcciones
   - Otras APIs utilizadas

Con 50,000 cargas/mes gratuitas, un dashboard pequeño/mediano debería estar cubierto.

---

## 🆘 Solución de Problemas

### "Mapbox token required"

Significa que falta configurar la variable de entorno. Verifica:
1. Que agregaste `NEXT_PUBLIC_MAPBOX_TOKEN` en la plataforma
2. Que hiciste redeploy después de agregar la variable
3. Que el token es válido en Mapbox Studio

### "Build failed: Cannot find module"

```bash
# Limpia y reinstala
rm -rf node_modules package-lock.json
npm install
npm run build
```

### "Page not found" en rutas

Este proyecto usa exportación estática (`output: 'export'`). Todas las páginas se generan en build time. No hay SSR.

---

## ✅ Checklist Pre-Deploy

- [ ] Tengo un token de Mapbox válido
- [ ] Configuré la variable `NEXT_PUBLIC_MAPBOX_TOKEN`
- [ ] Hice `npm run build` localmente y no dio errores
- [ ] Verifiqué que no hay tokens en el código fuente
- [ ] El `.gitignore` incluye `.env.local`
