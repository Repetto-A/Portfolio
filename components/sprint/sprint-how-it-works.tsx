import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintTimeline } from "./sprint-timeline"
import { SprintCurriculum } from "./sprint-curriculum"
import { SprintPaces } from "./sprint-paces"
import { SPRINT_CURRICULUM } from "@/lib/sprint/curriculum"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"

const STEPS = [
  {
    tag: "Semana 1",
    title: "Diagnóstico",
    body: "Entrevisto a tus líderes, mapeo procesos y detecto dónde la IA tiene sentido real. Los priorizo por impacto y esfuerzo.",
    deliverable: "Mapa de oportunidades priorizado",
  },
  {
    tag: "Semana 2",
    title: "Capacitación aplicada",
    body: "Tu equipo se lleva criterio real sobre cómo aplicar IA: desde escribir buenos prompts hasta armar asistentes que recuerdan el contexto de tu operación. Siempre con ejemplos de tus propios procesos.",
    deliverable: "Equipo con criterio + toolkit adaptado a tu contexto",
  },
  {
    tag: "Semana 3",
    title: "Laboratorio guiado",
    body: "Los equipos prototipan sobre casos reales, con mi mentoría directa. Se prueba, se descarta lo que no sirve y se itera.",
    deliverable: "Prototipos en borrador, validados sobre casos reales",
  },
  {
    tag: "Semana 4",
    title: "Hackathon interna + Demo Day",
    body: "Uno o dos días intensivos donde los equipos construyen y presentan sus prototipos ante el liderazgo.",
    deliverable: "Prototipos funcionales presentados al liderazgo",
  },
  {
    tag: "Cierre",
    title: "Roadmap de implementación",
    body: "Cierro consolidando qué avanzar, con qué prioridad y con qué reglas de uso, costos y visibilidad. Queda un plan concreto.",
    deliverable: "Roadmap de 90 días + marco de gobernanza + informe ejecutivo",
  },
] as const

const CURRICULUM = SPRINT_CURRICULUM.map((module) => ({
  title: module.title.es,
  summary: module.summary.es,
  topics: module.topics,
}))

export function SprintHowItWorks() {
  return (
    <SprintSection id={SPRINT_ANCHORS.howItWorks} label={SPRINT_SECTION_LABELS.howItWorks}>
      <SprintHeading>Cinco etapas. Un objetivo: que quede algo construido.</SprintHeading>
      <SprintProse lead>
        <p>
          Secuencia fija de 30 días. En cada etapa el equipo aprende y lo aplica sobre sus procesos.
        </p>
      </SprintProse>

      <SprintTimeline steps={STEPS} />

      <SprintPaces />

      <div id="programa" className="mt-16 scroll-mt-20">
        <h3 className="sprint-kicker text-muted-foreground">Programa modular</h3>

        <p className="sprint-measure mt-5 text-sm leading-relaxed text-muted-foreground">
          La empresa elige los módulos. No los vemos todos: arrancamos por lo que le sirve al
          equipo, según el diagnóstico. El stack lo lidera SpaceXAI (Cursor y Grok Bot). También
          Claude Code, Copilot y otras herramientas.
        </p>

        <SprintCurriculum modules={CURRICULUM} />
      </div>
    </SprintSection>
  )
}
