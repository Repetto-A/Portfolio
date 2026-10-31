import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintCalendlyButton } from "./sprint-calendly-button"
import { CTA_COPY, SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"

export function SprintGuarantee() {
  return (
    <SprintSection id={SPRINT_ANCHORS.guarantee} label={SPRINT_SECTION_LABELS.guarantee}>
      <div className="rounded-xl border-2 border-[var(--sprint-accent)] bg-background p-6 sm:p-10">
        <SprintHeading>Te vas con un prototipo funcionando. Garantizado.</SprintHeading>
        <SprintProse>
          <p>
            Estoy tan convencido del formato que lo pongo por escrito: si al final del sprint tu
            equipo no queda con al menos un prototipo funcional sobre un proceso real de tu empresa,
            sigo trabajando sin costo adicional hasta lograrlo.
          </p>
          <p>
            La única condición es la que hace que esto funcione: un sponsor interno comprometido y
            un equipo que participe de las sesiones. Lo confirmo con vos en el diagnóstico, antes de
            arrancar.
          </p>
        </SprintProse>
        <div className="mt-8">
          <SprintCalendlyButton location="guarantee" className="w-full sm:w-auto">
            {CTA_COPY.primary}
          </SprintCalendlyButton>
        </div>
      </div>
    </SprintSection>
  )
}
