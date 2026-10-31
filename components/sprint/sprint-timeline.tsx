"use client"

import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/use-in-view"

export type SprintStep = {
  tag: string
  title: string
  body: string
  deliverable: string
}

const STEP_MS = 170

export function SprintTimeline({ steps }: { steps: readonly SprintStep[] }) {
  const [ref, inView] = useInView<HTMLOListElement>({ threshold: 0.1 })

  return (
    <ol ref={ref} className="mt-12 space-y-5">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const base = i * STEP_MS
        return (
          <li key={step.title} className="grid grid-cols-[2.25rem_1fr] gap-4 sm:gap-6">
            <div className="relative flex justify-center">
              <span
                className={cn(
                  "sprint-index z-10 flex size-9 items-center justify-center rounded-full border border-[var(--sprint-accent)]/40 bg-card text-sm font-medium text-[var(--sprint-accent)]",
                  "transition-[transform,opacity] duration-500 ease-[var(--sprint-ease-out)] motion-reduce:transition-none",
                  inView ? "scale-100 opacity-100" : "scale-75 opacity-0"
                )}
                style={{ transitionDelay: `${base}ms` }}
              >
                {i + 1}
              </span>
              {!isLast ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-9 bottom-[-1.25rem] w-px origin-top bg-border",
                    "transition-transform duration-500 ease-[var(--sprint-ease-out)] motion-reduce:transition-none",
                    inView ? "scale-y-100" : "scale-y-0"
                  )}
                  style={{ transitionDelay: `${base + 120}ms` }}
                />
              ) : null}
            </div>

            <div
              className={cn(
                "rounded-xl border border-border bg-card p-5 transition-[transform,opacity,border-color] duration-500 ease-[var(--sprint-ease-out)] hover:border-foreground/20 motion-reduce:transition-none sm:grid sm:grid-cols-[1fr_15rem] sm:gap-6 sm:p-6",
                inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: `${base + 80}ms` }}
            >
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{step.title}</h3>
                  <span className="sprint-kicker shrink-0 text-muted-foreground">{step.tag}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
              <div className="mt-4 flex flex-col justify-center gap-1.5 border-t border-border pt-3 sm:mt-0 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                <span className="sprint-kicker text-[var(--sprint-accent)]">Entregable</span>
                <span className="text-sm font-medium leading-snug">{step.deliverable}</span>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
