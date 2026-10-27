import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintTimeline } from "./sprint-timeline"
import { SprintCurriculum, type CurriculumTopic } from "./sprint-curriculum"
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

const CURRICULUM: { title: string; topics: CurriculumTopic[] }[] = [
  {
    title: "Cambio de paradigma",
    topics: [
      "Prompt engineering",
      "Context engineering",
      "Harness engineering",
      "Spec Driven Development",
      "Frameworks para SDD",
      "IDEs agénticos",
      "Orquestación de múltiples agentes",
      "Loops engineering",
    ],
  },
  {
    title: "Darle buen contexto a la IA y optimizar costos haciéndolo",
    topics: [
      "RAG",
      "CAG",
      "Engrams",
      "Knowledge graphs",
      "Skills y rules",
      "MCPs",
      "Crear tus propios MCPs",
      "Optimización de tokens",
    ],
  },
  {
    title: "Automatizaciones útiles para el día a día",
    topics: [
      "Cronjobs",
      "Playwright y Selenium",
      "Agentes de IA usando tu navegador",
      "Scraping y crawlers",
    ],
  },
  {
    title: "Infraestructura y costos",
    topics: [
      "Correr IA en local",
      "Open source vs. frontera",
      "Servidores on-premise",
      "Anonimización de datos",
    ],
  },
]

export function SprintHowItWorks() {
  return (
    <SprintSection id={SPRINT_ANCHORS.howItWorks} label={SPRINT_SECTION_LABELS.howItWorks}>
      <SprintHeading>Cinco etapas. Un objetivo: que quede algo construido.</SprintHeading>
      <SprintProse lead>
        <p>
          El sprint sigue una secuencia fija de 30 días. En cada etapa tu equipo incorpora nuevas
          herramientas y conocimientos.
        </p>
      </SprintProse>

      <SprintTimeline steps={STEPS} />

      <div className="mt-16">
        <h3 className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
          Temas que me suelen pedir
        </h3>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          No los vemos todos en cada sprint. Es lo que las empresas suelen pedirme; en tu caso
          elegimos lo que le sirve a tu equipo según lo que salga del diagnóstico.
        </p>

        <SprintCurriculum modules={CURRICULUM} />
      </div>
    </SprintSection>
  )
}
