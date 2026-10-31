import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SprintSectionProps {
  children: ReactNode
  id?: string
  className?: string
  /** Etiqueta monospace numerada, ej. "01 / PROBLEMA" */
  label?: string
  spacing?: "default" | "compact"
  /** Fondo tenue full-bleed para variar el ritmo entre secciones. */
  tint?: boolean
}

/**
 * Wrapper de sección para /sprint.
 * Estética spec sheet + editorial: kicker mono con marca de acento, título
 * en serif de display, prosa en columna de lectura.
 */
export function SprintSection({
  children,
  id,
  className,
  label,
  spacing = "default",
  tint = false,
}: SprintSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        spacing === "default" ? "py-24 sm:py-32" : "py-16 sm:py-24",
        "scroll-mt-20",
        tint && "bg-[var(--sprint-tint)]",
        className
      )}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {label ? (
          <div className="mb-8 flex items-center gap-3 sm:mb-10">
            <span aria-hidden className="sprint-label-line h-px w-10 bg-[var(--sprint-accent)]" />
            <span className="sprint-kicker text-[var(--sprint-accent)]">{label}</span>
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}

/**
 * Título de sección dominante. Serif de display, por debajo del h1 del hero
 * y muy por encima del body: el ojo sabe que arranca un bloque nuevo.
 */
export function SprintHeading({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "sprint-display sprint-heading-measure text-[1.875rem] sm:text-[2.375rem] lg:text-[2.625rem]",
        className
      )}
    >
      {children}
    </h2>
  )
}

/**
 * Prosa de apoyo. Se mantiene en columna de lectura aunque la sección sea wide.
 * `lead` la usa como bajada del título (más grande y con más aire).
 */
export function SprintProse({
  children,
  className,
  lead = false,
}: {
  children: ReactNode
  className?: string
  lead?: boolean
}) {
  return (
    <div
      className={cn(
        "sprint-measure space-y-4 text-muted-foreground",
        lead
          ? "mt-6 text-lg leading-[1.7] text-pretty"
          : "mt-7 text-[0.9375rem] leading-[1.7] sm:text-base",
        className
      )}
    >
      {children}
    </div>
  )
}
