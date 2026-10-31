"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { CALENDLY_URL, CTA_COPY, type CTALocation } from "@/lib/sprint/constants"
import { captureCTA } from "@/lib/sprint/analytics"
import { ArrowUpRight } from "lucide-react"

interface SprintCalendlyButtonProps {
  location: CTALocation
  className?: string
  children?: ReactNode
}

const DEFAULT_LABEL = CTA_COPY.primary

export function SprintCalendlyButton({
  location,
  className,
  children = DEFAULT_LABEL,
}: SprintCalendlyButtonProps) {
  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => captureCTA("cta_calendly_click", { location })}
      className={cn(
        "group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md px-4 py-3 text-center sm:px-6",
        "bg-foreground text-background font-medium",
        "transition-[background-color,color,transform] duration-200 ease-out",
        "hover:bg-[var(--sprint-accent)] hover:text-[var(--sprint-accent-foreground)] active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sprint-accent)]",
        className
      )}
    >
      {children}
      <ArrowUpRight
        className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden
      />
    </a>
  )
}
