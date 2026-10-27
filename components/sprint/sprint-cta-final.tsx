import { SprintSection } from "./sprint-section"
import { SprintDirectContact } from "./sprint-direct-contact"
import { SPRINT_ANCHORS } from "@/lib/sprint/constants"

export function SprintCtaFinal() {
  return (
    <SprintSection id={SPRINT_ANCHORS.cta} label="13 / Siguiente paso">
      <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
        En 20 minutos sabés si esto tiene sentido para tu empresa.
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
        En la llamada de diagnóstico detecto si hay oportunidades concretas de IA en tu operación y
        si el sprint aplica a tu caso. Sin compromiso. Si no aplica, te lo digo y te llevás igual un
        par de ideas accionables.
      </p>

      <div className="mt-10">
        <SprintDirectContact location="footer" />
      </div>
    </SprintSection>
  )
}
