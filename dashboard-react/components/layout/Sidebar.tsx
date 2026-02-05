"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Home,
  BarChart3,
  Map,
  Search,
  Menu,
  X,
  Droplets,
  HeartPulse,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/store"

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/analisis", label: "Análisis General", icon: BarChart3 },
  { href: "/mapas", label: "Mapas y Territorios", icon: Map },
  { href: "/explorador", label: "Explorador de Datos", icon: Search },
]

const stats = [
  { label: "Parroquias", value: "847", icon: Map },
  { label: "Con Petróleo", value: "512", icon: Droplets },
  { label: "Est. Salud", value: "2,638", icon: HeartPulse },
  { label: "Población Afro", value: "9.2%", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 280 : 0,
          opacity: sidebarOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border overflow-hidden",
          "lg:relative lg:w-72 lg:opacity-100"
        )}
      >
        <div className="flex flex-col h-full w-72">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">
                  Paradoja Extractivista
                </h1>
                <p className="text-xs text-muted-foreground">Ecuador</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-current"
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* Stats */}
          <div className="p-4 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="p-3 rounded-lg bg-muted/50"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground mb-1" />
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
            TFM - Análisis de Datos Masivos
          </div>
        </div>
      </motion.aside>
    </>
  )
}