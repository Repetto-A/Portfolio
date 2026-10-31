import { SPRINT_OFFER, type SprintOfferCopy } from "@/lib/sprint/offer"

function OfferLadderBody({ copy, nested = false }: { copy: SprintOfferCopy; nested?: boolean }) {
  const Headline = nested ? "h3" : "h2"
  const ItemHeading = nested ? "h4" : "h3"

  return (
    <>
      <Headline
        className={
          nested
            ? "sprint-display sprint-heading-measure text-[1.5rem] sm:text-[1.875rem]"
            : "sprint-display sprint-heading-measure text-[1.875rem] sm:text-[2.375rem] lg:text-[2.625rem]"
        }
      >
        {copy.headline}
      </Headline>
      <p className="sprint-measure mt-6 text-lg leading-[1.7] text-pretty text-muted-foreground">
        {copy.lead}
      </p>

      <p className="sprint-kicker mt-8 text-muted-foreground">{copy.facts}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start">
        <ol className="list-none space-y-3 p-0">
          {copy.rungs.map((rung, i) => (
            <li key={rung.name} className="relative">
              {i < copy.rungs.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute top-11 bottom-[-0.75rem] left-[1.125rem] w-px bg-border"
                />
              ) : null}
              <div className="relative rounded-xl border border-border bg-card p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="sprint-index text-xs text-[var(--sprint-accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="sprint-kicker text-muted-foreground">{rung.tag}</span>
                  {rung.badge ? (
                    <span className="sprint-kicker text-[var(--sprint-accent)]">{rung.badge}</span>
                  ) : null}
                </div>
                <ItemHeading className="mt-2 text-lg font-semibold tracking-tight">
                  {rung.name}
                </ItemHeading>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rung.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <aside className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-5 sm:p-6 lg:mt-0">
          <p className="sprint-kicker text-muted-foreground">{copy.side.tag}</p>
          <ItemHeading className="mt-2 text-lg font-semibold tracking-tight">
            {copy.side.name}
          </ItemHeading>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.side.detail}</p>
        </aside>
      </div>
    </>
  )
}

export function OfferLadder({ locale }: { locale: "es" | "en" }) {
  return <OfferLadderBody copy={SPRINT_OFFER[locale]} nested />
}

export function SprintOfferLadderInner() {
  return <OfferLadderBody copy={SPRINT_OFFER.es} />
}
