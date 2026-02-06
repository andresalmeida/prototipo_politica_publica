"use client"

import { motion } from "framer-motion"
import { type ReactNode } from "react"
import { cn } from "../../lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  color?: "red" | "green" | "blue" | "amber" | "purple" | "emerald"
  delay?: number
}

const colorMap = {
  red: {
    bg: "from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50",
    border: "border-red-200/50 dark:border-red-800/50",
    icon: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400",
    value: "text-red-600 dark:text-red-400",
    trend: "text-red-500 dark:text-red-400",
    glow: "from-red-400/20",
  },
  green: {
    bg: "from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50",
    border: "border-green-200/50 dark:border-green-800/50",
    icon: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400",
    value: "text-green-600 dark:text-green-400",
    trend: "text-green-500 dark:text-green-400",
    glow: "from-green-400/20",
  },
  blue: {
    bg: "from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50",
    border: "border-blue-200/50 dark:border-blue-800/50",
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
    value: "text-blue-600 dark:text-blue-400",
    trend: "text-blue-500 dark:text-blue-400",
    glow: "from-blue-400/20",
  },
  amber: {
    bg: "from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50",
    border: "border-amber-200/50 dark:border-amber-800/50",
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
    value: "text-amber-600 dark:text-amber-400",
    trend: "text-amber-500 dark:text-amber-400",
    glow: "from-amber-400/20",
  },
  purple: {
    bg: "from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50",
    border: "border-purple-200/50 dark:border-purple-800/50",
    icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
    value: "text-purple-600 dark:text-purple-400",
    trend: "text-purple-500 dark:text-purple-400",
    glow: "from-purple-400/20",
  },
  emerald: {
    bg: "from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50",
    border: "border-emerald-200/50 dark:border-emerald-800/50",
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
    value: "text-emerald-600 dark:text-emerald-400",
    trend: "text-emerald-500 dark:text-emerald-400",
    glow: "from-emerald-400/20",
  },
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = "blue",
  delay = 0,
}: StatCardProps) {
  const colors = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br backdrop-blur-xl p-5",
        "shadow-[0_4px_24px_rgba(0,0,0,0.04)]",
        "hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
        "transition-shadow duration-300",
        colors.bg,
        colors.border
      )}
    >
      {/* Decorative glow */}
      <div
        className={cn(
          "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-50",
          `bg-gradient-to-br ${colors.glow} to-transparent`
        )}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          {icon && (
            <div className={cn("p-2 rounded-xl", colors.icon)}>
              {icon}
            </div>
          )}
        </div>

        <div className={cn("text-3xl font-black tracking-tight", colors.value)}>
          {value}
        </div>

        {(subtitle || trendValue) && (
          <div className="flex items-center gap-2 mt-2">
            {trendValue && (
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  trend === "down"
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : trend === "up"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {trend === "down" ? "↓" : trend === "up" ? "↑" : "→"} {trendValue}
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
