"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  className?: string
  gradient?: "default" | "blue" | "green" | "orange" | "red"
}

const gradients = {
  default: "from-slate-500 to-slate-700",
  blue: "from-blue-500 to-blue-700",
  green: "from-emerald-500 to-emerald-700",
  orange: "from-orange-500 to-orange-700",
  red: "from-red-500 to-red-700",
}

export function Header({
  title,
  subtitle,
  icon,
  className,
  gradient = "blue",
}: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-r p-8 text-white shadow-lg",
        gradients[gradient],
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
      </div>

      <div className="relative z-10 flex items-start gap-4">
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            {icon}
          </div>
        )}
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl font-bold tracking-tight"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-2 text-white/80"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  )
}