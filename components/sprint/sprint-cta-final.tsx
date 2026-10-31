import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintDirectContact } from "./sprint-direct-contact"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"

export function SprintCtaFinal() {
  return (
    <SprintSection id={SPRINT_ANCHORS.cta} label={SPRINT_SECTION_LABELS.cta}>
      <SprintHeading>Hablemos.</SprintHeading>
      <SprintProse lead>
        <p>
          El siguiente paso es una charla de 20 minutos. Vemos si hay oportunidades concretas de IA
          en tu operación y si el sprint aplica. Sin compromiso. Si no aplica, te lo digo y te
          llevás igual un par de ideas accionables.
        </p>
      </SprintProse>

      <div className="mt-10">
        <SprintDirectContact location="footer" showWhatsApp />
      </div>
    </SprintSection>
  )
}
