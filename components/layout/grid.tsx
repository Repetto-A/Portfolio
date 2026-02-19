import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GridProps {
  children: ReactNode
  className?: string
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: "sm" | "md" | "lg" | "xl"
}

const gapClasses = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
}

export function Grid({ children, className, cols, gap = "md" }: GridProps) {
  const gridCols = {
    default: cols?.default ? `grid-cols-${cols.default}` : "",
    sm: cols?.sm ? `sm:grid-cols-${cols.sm}` : "",
    md: cols?.md ? `md:grid-cols-${cols.md}` : "",
    lg: cols?.lg ? `lg:grid-cols-${cols.lg}` : "",
    xl: cols?.xl ? `xl:grid-cols-${cols.xl}` : "",
  }

  return (
    <div
      className={cn(
        "grid",
        gridCols.default,
        gridCols.sm,
        gridCols.md,
        gridCols.lg,
        gridCols.xl,
        gapClasses[gap],
        className,
      )}
    >
      {children}
    </div>
  )
}
