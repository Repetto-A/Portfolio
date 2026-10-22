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
 * Estética "spec sheet": etiqueta mono con marca de acento arriba, contenido a la
 * izquierda. La prosa se lee en columna angosta; la estructura respira más ancho.
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
        spacing === "default" ? "py-20 sm:py-28" : "py-14 sm:py-20",
        "scroll-mt-16",
        tint && "bg-muted/[0.4] dark:bg-muted/[0.15]",
        className
      )}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {label ? (
          <div className="mb-6 flex items-center gap-3">
            <span aria-hidden className="sprint-label-line h-px w-8 bg-[var(--sprint-accent)]" />
            <span className="font-mono text-xs font-medium tracking-[0.2em] text-[var(--sprint-accent)] uppercase">
              {label}
            </span>
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}

/**
 * Título de sección dominante. Escala por debajo del h1 del hero, pero muy por
 * encima del body: el ojo sabe que arranca un bloque nuevo.
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
        "text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]",
        className
      )}
    >
      {children}
    </h2>
  )
}

/**
 * Prosa de apoyo. Se mantiene en columna de lectura aunque la sección sea "wide".
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
        "space-y-4 text-muted-foreground",
        lead
          ? "mt-5 text-lg leading-relaxed text-pretty"
          : "mt-6 text-base leading-relaxed",
        className
      )}
    >
      {children}
    </div>
  )
}
