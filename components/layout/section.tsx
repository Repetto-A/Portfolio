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
  gradient: "bg-muted/15",
}

const spacingClasses = {
  default: "py-24 sm:py-32",
  compact: "py-16 sm:py-24",
  relaxed: "py-28 sm:py-36",
}

export function Section({
  children,
  className,
  id,
  variant = "default",
  spacing = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20", variantClasses[variant], spacingClasses[spacing], className)}
    >
      {children}
    </section>
  )
}
