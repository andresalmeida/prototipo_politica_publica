import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "../components/layout/Sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Paradoja Extractivista - Ecuador",
  description:
    "Dashboard de análisis geoespacial sobre la relación entre infraestructura petrolera, acceso a salud y población afroecuatoriana en Ecuador",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  )
}