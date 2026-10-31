import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintCalendlyButton } from "./sprint-calendly-button"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"

const CRITERIA = [
  {
    label: "Escala",
    text: "Tenés entre 20 y 500 empleados y procesos operativos que se repiten todas las semanas",
  },
  {
    label: "Dirección",
    text: "Sabés que conviene moverte con IA, pero todavía no tenés un mapa claro de por dónde",
  },
  {
    label: "Equipo",
    text: "Al menos 5 personas pueden dedicar 3-4 horas semanales al laboratorio y usar las clases para sacarse dudas",
  },
  {
    label: "Compromiso",
    text: "Tu equipo tiene ganas de probar cosas en el trabajo. El sprint no rinde igual si lo vive como una obligación",
  },
  {
    label: "Sponsor",
    text: "Hay alguien interno con poder de decisión que actúa como acelerador y lleva la posta del sprint dentro de la empresa",
  },
] as const

const EXIT_SIGNALS = [
  "La prioridad es marcar el casillero de capacitación en IA, no que el equipo cambie cómo trabaja",
  "Querés tercerizar la IA y que tu equipo no tenga que meter mano",
  "Nadie puede dedicarle horas semanales al laboratorio y la hackathon",
  "No hay nadie de dirección dispuesto a involucrarse",
] as const

export function SprintAudience() {
  return (
    <SprintSection id={SPRINT_ANCHORS.audience} label={SPRINT_SECTION_LABELS.audience}>
      <SprintHeading>
        Si tu empresa ya habló de IA y ahora quiere ejecutar, esto aplica.
      </SprintHeading>
      <SprintProse lead>
        <p>
          El sprint pide tiempo del equipo y un sponsor interno con poder de decisión. Si eso no
          está, no vas a sacar el provecho que deberías. Mejor hablarlo en el diagnóstico, antes de
          arrancar.
        </p>
      </SprintProse>

      <div className="mt-10 border-t border-border">
        <div className="hidden grid-cols-[5.5rem_1fr] gap-6 py-3 sm:grid">
          <span className="sprint-kicker text-muted-foreground">Requisito</span>
          <span className="sprint-kicker text-muted-foreground">Qué tiene que pasar</span>
        </div>

        <ul>
          {CRITERIA.map((item, i) => (
            <li
              key={item.label}
              className="grid gap-3 border-b border-border py-5 sm:grid-cols-[5.5rem_1fr] sm:items-start sm:gap-6"
            >
              <div className="flex flex-col gap-1">
                <span className="sprint-index text-[11px] leading-none text-muted-foreground select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="sprint-kicker leading-tight text-[var(--sprint-accent)]">
                  {item.label}
                </span>
              </div>
              <p className="text-sm leading-relaxed sm:pt-0.5">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <p className="sprint-kicker text-muted-foreground">Señales de que no es el momento</p>

        <ul className="mt-5 space-y-0 rounded-lg border border-dashed border-border/80 bg-muted/20">
          {EXIT_SIGNALS.map((item) => (
            <li
              key={item}
              className="flex gap-4 border-b border-dashed border-border/60 px-4 py-4 text-sm leading-relaxed text-muted-foreground last:border-b-0 sm:px-5"
            >
              <span
                className="sprint-index text-sm text-muted-foreground/70 select-none"
                aria-hidden
              >
                ×
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 flex flex-col gap-6 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Si estás en el límite entre los dos bloques, el diagnóstico de 20 minutos sirve para
          ubicarnos sin compromiso.
        </p>
        <SprintCalendlyButton
          location="audience"
          className="shrink-0 justify-center sm:justify-start"
        >
          Agendar diagnóstico gratuito
        </SprintCalendlyButton>
      </div>
    </SprintSection>
  )
}
