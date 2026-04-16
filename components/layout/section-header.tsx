import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
  align?: "left" | "center"
  eyebrow?: string
}

export function SectionHeader({
  title,
  description,
  children,
  className,
  align = "center",
  eyebrow,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center" : "text-left"
  const eyebrowAlign = align === "center" ? "justify-center" : "justify-start"

  return (
    <div className={cn("space-y-3 mb-16", alignClass, className)}>
      {eyebrow && (
        <div className={cn("flex items-center gap-2.5", eyebrowAlign)}>
          <div className="h-px w-8 bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            {eyebrow}
          </span>
          <div className="h-px w-8 bg-primary" />
        </div>
      )}
      <h2
        className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground text-balance"
        style={{ lineHeight: "1.15", letterSpacing: "-0.035em" }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed pt-1">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
