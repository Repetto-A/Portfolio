import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintCurriculum } from "./sprint-curriculum"
import { SprintDirectContact } from "./sprint-direct-contact"
import { SPRINT_CURRICULUM } from "@/lib/sprint/curriculum"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"
import { SPRINT_HOW_STEPS } from "@/lib/sprint/offer"

const CURRICULUM = SPRINT_CURRICULUM.map((module) => ({
  title: module.title.es,
  summary: module.summary.es,
  topics: module.topics,
}))

export function SprintHowItWorks() {
  return (
    <SprintSection id={SPRINT_ANCHORS.howItWorks} label={SPRINT_SECTION_LABELS.howItWorks}>
      <SprintHeading>Tres pasos. El equipo termina construyendo.</SprintHeading>
      <SprintProse lead>
        <p>Diagnóstico, un bloque de 1.5 h por equipo por semana, y casos reales funcionando.</p>
      </SprintProse>

      <ol className="mt-12 list-none space-y-4 p-0">
        {SPRINT_HOW_STEPS.map((step, i) => (
          <li
            key={step.title}
            className="grid grid-cols-[2.25rem_1fr] gap-4 rounded-xl border border-border bg-card p-5 sm:gap-6 sm:p-6"
          >
            <span className="sprint-index flex size-9 items-center justify-center rounded-full border border-[var(--sprint-accent)]/40 text-sm font-medium text-[var(--sprint-accent)]">
              {i + 1}
            </span>
            <div>
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div id="programa" className="mt-16 scroll-mt-20">
        <h3 className="sprint-kicker text-muted-foreground">Programa modular</h3>

        <p className="sprint-measure mt-5 text-sm leading-relaxed text-muted-foreground">
          Cinco módulos. La empresa elige. No los vemos todos: arrancamos por lo que le sirve al
          equipo, según el diagnóstico. El stack arranca en Cursor y Grok Bot. También Claude Code,
          Copilot y otras herramientas.
        </p>

        <SprintCurriculum modules={CURRICULUM} />
      </div>

      <div
        id="talk-after-program"
        className="mt-12 scroll-mt-24 border-t border-border pt-10 sm:mt-14 sm:pt-12"
      >
        <p className="sprint-display text-[1.5rem] sm:text-[1.875rem]">
          El programa te cierra? El siguiente paso es una charla.
        </p>
        <p className="sprint-measure mt-3 text-sm leading-relaxed text-muted-foreground">
          Treinta minutos, sin cargo. Vemos si aplica.
        </p>
        <SprintDirectContact location="program" className="mt-6" />
      </div>
    </SprintSection>
  )
}
