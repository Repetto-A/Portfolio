import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintDirectContact } from "./sprint-direct-contact"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"

export function SprintCtaFinal() {
  return (
    <SprintSection id={SPRINT_ANCHORS.cta} label={SPRINT_SECTION_LABELS.cta}>
      <SprintHeading>En 20 minutos sabés si esto tiene sentido para tu empresa.</SprintHeading>
      <SprintProse lead>
        <p>
          En la llamada de diagnóstico detecto si hay oportunidades concretas de IA en tu operación
          y si el sprint aplica a tu caso. Sin compromiso. Si no aplica, te lo digo y te llevás
          igual un par de ideas accionables.
        </p>
      </SprintProse>

      <div className="mt-10">
        <SprintDirectContact location="footer" />
      </div>
    </SprintSection>
  )
}
