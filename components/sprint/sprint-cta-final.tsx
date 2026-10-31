import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintDirectContact } from "./sprint-direct-contact"
import { SprintContactForm } from "./sprint-contact-form"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"

export function SprintCtaFinal() {
  return (
    <SprintSection id={SPRINT_ANCHORS.cta} label={SPRINT_SECTION_LABELS.cta}>
      <SprintHeading>Hablemos.</SprintHeading>
      <SprintProse lead>
        <p>
          El siguiente paso es una charla diagnóstico de 30 minutos, sin cargo. Vemos si hay
          oportunidades concretas de IA en tu operación y si Intensivo o Sostenido aplican. Sin
          compromiso.
        </p>
      </SprintProse>

      <div className="mt-10">
        <SprintDirectContact location="footer" showWhatsApp hint />
      </div>

      <div className="mt-12 border-t border-border pt-10">
        <h3 className="text-lg font-semibold tracking-tight">O escribime acá</h3>
        <p className="sprint-measure mt-2 text-sm leading-relaxed text-muted-foreground">
          Contame qué te interesa y te respondo.
        </p>
        <div className="mt-6 max-w-xl">
          <SprintContactForm />
        </div>
      </div>
    </SprintSection>
  )
}
