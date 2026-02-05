/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname)
    return config
  },
  // Nota: Las variables de entorno con NEXT_PUBLIC_ ya están disponibles
  // automáticamente en el cliente. No es necesario definirlas aquí.
  // Configúralas en Vercel/Netlify o en tu archivo .env.local local
}

module.exports = nextConfig