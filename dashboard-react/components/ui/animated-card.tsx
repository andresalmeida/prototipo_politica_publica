"use client"

import { motion } from "framer-motion"
import { cn } from "../../lib"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  hover?: boolean
  onClick?: () => void
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  hover = true,
  onClick,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={
        hover
          ? {
              y: -4,
              scale: 1.01,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50",
        "bg-gradient-to-br from-card/90 to-card/60",
        "backdrop-blur-sm shadow-lg",
        hover && "cursor-pointer",
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    positive: boolean
  }
  delay?: number
  gradient?: "blue" | "green" | "orange" | "red" | "purple"
}

const gradientMap = {
  blue: "from-blue-500/20 to-indigo-500/20",
  green: "from-emerald-500/20 to-teal-500/20",
  orange: "from-orange-500/20 to-amber-500/20",
  red: "from-red-500/20 to-rose-500/20",
  purple: "from-violet-500/20 to-purple-500/20",
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  delay = 0,
  gradient = "blue",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        "bg-gradient-to-br from-card/90 to-card/60",
        "backdrop-blur-sm border border-border/50 shadow-lg"
      )}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br blur-3xl opacity-50",
          gradientMap[gradient]
        )}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <motion.h3
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.1, type: "spring" }}
              className="mt-2 text-3xl font-bold tracking-tight"
            >
              {value}
            </motion.h3>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div
                className={cn(
                  "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  trend.positive
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-red-500/10 text-red-600"
                )}
              >
                {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              "bg-gradient-to-br shadow-lg",
              gradientMap[gradient].replace("/20", "").replace("/20", "")
            )}
          >
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
