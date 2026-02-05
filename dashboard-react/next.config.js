/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  // Configurar baseUrl para path aliases
  basePath: '',
  
  images: {
    unoptimized: true,
  },
  
  webpack: (config) => {
    // Añadir alias @ para apuntar a la raíz
    config.resolve.alias['@'] = __dirname
    
    // Configurar extensiones
    config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', ...config.resolve.extensions]
    
    return config
  },
  
  typescript: {
    // No ignorar errores de TypeScript en build
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // Ignorar errores de ESLint en build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
