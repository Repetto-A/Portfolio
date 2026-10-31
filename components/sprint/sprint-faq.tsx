import type { ReactNode } from "react"
import { SprintSection, SprintHeading } from "./sprint-section"
import { SprintCriaLink } from "./sprint-ext-link"
import { SPRINT_ANCHORS, SPRINT_PACES, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "¿Esto es una capacitación o una consultoría?",
    a: "Las dos cosas, en ese orden. Arranco como capacitación aplicada y termino como consultoría de ejecución: tu equipo aprende haciendo y sale con prototipos y un plan, no con teoría suelta.",
  },
  {
    q: "¿El temario es fijo?",
    a: "No. Es un programa modular: la empresa elige. Hay panorama de IA y seguridad, IA local vs propietaria y Gemini, desarrollo con agentes en Cursor y Grok Bot, datos (RAG, knowledge graphs, Engram) y automatización con n8n, LangChain y LangGraph.",
  },
  {
    q: "¿Necesitamos saber programar?",
    a: "No hace falta. Me adapto al nivel del equipo y trabajamos con no-code, low-code y prompting. Rinde más con equipos mixtos con ganas de probar. Si hay perfiles técnicos, mejor: es mi terreno.",
  },
  {
    q: "¿Qué tipo de prototipos pueden salir?",
    a: "Automatización de tareas repetitivas, asistentes internos sobre tu documentación, clasificación y extracción de datos, borradores y respuestas asistidas, tableros que resumen información. Siempre sobre casos de tu operación.",
  },
  {
    q: "¿Cuánto tiempo requiere del equipo?",
    a: (
      <div className="space-y-2">
        <p>{SPRINT_PACES.headline}.</p>
        <p>Intensivo: {SPRINT_PACES.intensivo.detail}</p>
        <p>Sostenido: {SPRINT_PACES.sostenido.detail}</p>
        <p>Más 1 o 2 días para la hackathon final.</p>
      </div>
    ),
  },
  {
    q: "¿Cómo manejan privacidad, datos sensibles y control de uso?",
    a: "El sprint incluye un marco de gobernanza: políticas de uso, criterios de privacidad, permisos por rol y validación humana de los outputs. También miro costos: qué conviene pagar y cómo medir el gasto real. Si hay equipo técnico, puedo ayudar a configurar trazas o medidores de uso para que dirección vea qué pasa. Local, cloud o no usar IA se decide por sensibilidad de datos, costo y performance, no por moda.",
  },
  {
    q: "¿Qué áreas de la empresa pueden participar?",
    a: "Cualquier área con procesos y datos: operaciones, comercial, finanzas, atención al cliente, RR.HH., marketing. Suele rendir más con equipos mixtos.",
  },
  {
    q: "¿Cómo se eligen los casos internos?",
    a: "En el diagnóstico. Mapeo procesos y los priorizo por impacto y esfuerzo, y elegimos juntos los que dan valor rápido y son factibles en el tiempo del sprint.",
  },
  {
    q: "¿Qué pasa después de la hackathon?",
    a: "Te quedás con los prototipos, un roadmap de 90 días y un informe ejecutivo. Defino qué avanzar y, si querés, acompaño la implementación con el formato Partner.",
  },
  {
    q: "¿Se puede hacer remoto o híbrido?",
    a: "Ambos. La hackathon rinde más presencial, pero se puede hacer híbrida o remota. Lo adapto a tu equipo.",
  },
  {
    q: "¿Trabajás solo o con equipo?",
    a: "Depende del alcance. Facilito yo la mayor parte y sumo especialistas cuando el proyecto lo pide. Siempre hay un responsable único de tu lado y del mío.",
  },
  {
    q: "¿Cómo se relaciona esto con CRIA?",
    a: (
      <>
        Trabajo junto a <SprintCriaLink /> como respaldo institucional, y también de forma directa.
        En el diagnóstico definimos el mejor esquema para tu empresa.
      </>
    ),
  },
  {
    q: "¿Y si todavía no sabemos qué procesos queremos mejorar?",
    a: "Es lo más común, y está previsto. Para eso existe el diagnóstico: no hace falta que llegues con los casos definidos, los encontramos juntos.",
  },
]

export function SprintFaq() {
  return (
    <SprintSection id={SPRINT_ANCHORS.faq} label={SPRINT_SECTION_LABELS.faq} spacing="compact" tint>
      <SprintHeading>Lo que pregunta dirección antes de agendar</SprintHeading>

      <Accordion type="single" collapsible className="mt-10">
        {FAQS.map((faq) => (
          <AccordionItem key={faq.q} value={faq.q}>
            <AccordionTrigger className="text-left text-base font-medium tracking-tight">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-[1.7] text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SprintSection>
  )
}
