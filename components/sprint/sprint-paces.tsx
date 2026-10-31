import { SPRINT_PACES } from "@/lib/sprint/constants"

const PACES = [SPRINT_PACES.intensivo, SPRINT_PACES.sostenido] as const

export function SprintPaces() {
  return (
    <div id="ritmo" className="mt-14 scroll-mt-20">
      <h3 className="sprint-display sprint-heading-measure text-[1.5rem] sm:text-[1.875rem]">
        {SPRINT_PACES.headline}
      </h3>
      <p className="sprint-measure mt-4 text-sm leading-relaxed text-muted-foreground">
        Sin carga fija de horas. Elegís el ritmo de las clases y lo sostenemos durante el sprint.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PACES.map((pace, i) => (
          <div key={pace.name} className="rounded-xl border border-border bg-card p-6 sm:p-7">
            <div className="flex items-baseline gap-3">
              <span className="sprint-index text-xs text-[var(--sprint-accent)] select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="text-base font-semibold tracking-tight">{pace.name}</h4>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pace.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
