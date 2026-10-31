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
  align = "left",
  eyebrow,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center" : "text-left"
  const eyebrowAlign = align === "center" ? "justify-center" : "justify-start"

  return (
    <div className={cn("mb-12 sm:mb-16", alignClass, className)}>
      {eyebrow ? (
        <div className={cn("mb-8 flex items-center gap-3 sm:mb-10", eyebrowAlign)}>
          <span aria-hidden className="sprint-label-line h-px w-10 bg-[var(--sprint-accent)]" />
          <span className="sprint-kicker text-[var(--sprint-accent)]">{eyebrow}</span>
        </div>
      ) : null}
      <h2 className="sprint-display sprint-heading-measure text-[1.875rem] sm:text-[2.375rem] lg:text-[2.625rem]">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "sprint-measure mt-6 text-lg leading-[1.7] text-pretty text-muted-foreground",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
      {children}
    </div>
  )
}
