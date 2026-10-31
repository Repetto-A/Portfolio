import { TRAINED_PEOPLE_STAT } from "@/lib/sprint/constants"
import { SPRINT_CLIENTS, TRAINED_PEOPLE_LABEL } from "@/lib/sprint/offer"
import { cn } from "@/lib/utils"

type SprintClientsBandProps = {
  locale?: "es" | "en"
  embedded?: boolean
}

export function SprintClientsBand({ locale = "es", embedded = false }: SprintClientsBandProps) {
  const statLabel = TRAINED_PEOPLE_LABEL[locale]
  const aria =
    locale === "es"
      ? `${TRAINED_PEOPLE_STAT} ${statLabel}. Empresas: ${SPRINT_CLIENTS.join(", ")}`
      : `${TRAINED_PEOPLE_STAT} ${statLabel}. Companies: ${SPRINT_CLIENTS.join(", ")}`

  const inner = (
    <div
      className={cn(
        "flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-9",
        embedded ? "" : "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
      )}
    >
      <p className="flex shrink-0 items-baseline gap-2">
        <span className="sprint-index text-2xl font-semibold tracking-tight text-[var(--sprint-accent)]">
          {TRAINED_PEOPLE_STAT}
        </span>
        <span className="text-sm text-muted-foreground">{statLabel}</span>
      </p>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:justify-end sm:gap-x-7">
        {SPRINT_CLIENTS.map((name) => (
          <li
            key={name}
            className="sprint-display text-[1.05rem] font-medium tracking-[-0.02em] text-foreground"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  )

  if (embedded) {
    return (
      <div role="region" aria-label={aria} className="border-t border-border">
        {inner}
      </div>
    )
  }

  return (
    <section aria-label={aria} className="border-t border-border">
      {inner}
    </section>
  )
}
