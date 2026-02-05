/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  // Nota: Las variables de entorno con NEXT_PUBLIC_ ya están disponibles
  // automáticamente en el cliente. No es necesario definirlas aquí.
  // Configúralas en Vercel/Netlify o en tu archivo .env.local local
}

module.exports = nextConfig