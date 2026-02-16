import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  variant?: "default" | "muted" | "gradient"
  spacing?: "default" | "compact" | "relaxed"
}

const variantClasses = {
  default: "bg-background",
  muted: "bg-muted/30",
  gradient: "bg-gradient-to-b from-background to-muted/20",
}

const spacingClasses = {
  default: "py-24",
  compact: "py-16",
  relaxed: "py-32",
}

export function Section({ children, className, id, variant = "default", spacing = "default" }: SectionProps) {
  return (
    <section id={id} className={cn(variantClasses[variant], spacingClasses[spacing], className)}>
      {children}
    </section>
  )
}
