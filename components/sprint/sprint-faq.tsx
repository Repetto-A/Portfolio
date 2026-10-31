import { SprintSection, SprintHeading } from "./sprint-section"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"
import { generateSprintFaqSchema, SPRINT_FAQS } from "@/lib/sprint/offer"

export function SprintFaq() {
  const schema = generateSprintFaqSchema()

  return (
    <SprintSection id={SPRINT_ANCHORS.faq} label={SPRINT_SECTION_LABELS.faq} spacing="compact" tint>
      <SprintHeading>Lo que pregunta dirección antes de agendar</SprintHeading>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mt-10 divide-y divide-border border-y border-border">
        {SPRINT_FAQS.map((faq) => (
          <details key={faq.q} className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-medium tracking-tight outline-none marker:content-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--sprint-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
              {faq.q}
              <span
                aria-hidden
                className="sprint-index shrink-0 text-xs text-muted-foreground transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pb-4 text-sm leading-[1.7] text-muted-foreground">{faq.a}</p>
          </details>
        ))}
      </div>
    </SprintSection>
  )
}
