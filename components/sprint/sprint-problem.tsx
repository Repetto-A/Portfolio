import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SPRINT_ANCHORS } from "@/lib/sprint/constants"

const FAILED_ATTEMPTS = [
  "El proyecto de IA que sistemas nunca prioriza.",
  "Cada área probando ChatGPT por su cuenta, sin criterio ni coordinación.",
  "Licencias de copilotos que se pagan hace meses y casi nadie usa bien.",
  "Un piloto que costó tres meses y terminó en un PDF prolijo que nadie volvió a abrir.",
]

export function SprintProblem() {
  return (
    <SprintSection id={SPRINT_ANCHORS.problem} label="01 / El problema">
      <SprintHeading>
        Tu empresa ya probó algo de IA, pero tu operación sigue igual.
      </SprintHeading>
      <SprintProse>
        <p>
          A veces fue una charla, un curso o una consultoría que no escaló. Otras veces
          es tu equipo usando ChatGPT por su cuenta, sin coordinación ni impacto en los
          procesos. En ambos casos, el trabajo diario no cambió. ¿Cuántos de estos ya
          viviste?
        </p>
      </SprintProse>

      <ul className="mt-8 space-y-0 border-t border-border">
        {FAILED_ATTEMPTS.map((item, i) => (
          <li
            key={i}
            className={`scroll-reveal-stagger-${i + 1} flex gap-4 border-b border-border py-4 text-sm leading-relaxed`}
          >
            <span className="font-mono text-xs text-muted-foreground pt-0.5 select-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-foreground">{item}</span>
          </li>
        ))}
      </ul>

      <blockquote className="scroll-reveal mt-10 border-l-2 border-[var(--sprint-accent)] pl-6 text-xl leading-snug font-medium tracking-tight text-balance text-foreground sm:text-2xl">
        El problema no es la tecnología. Es que nadie cierra el ciclo entre aprender
        algo y construir algo con eso.
      </blockquote>

      <SprintProse>
        <p>
          Mientras no haya criterios, cada área prueba por su cuenta. Dirección se entera tarde:
          cuando algo sale mal o cuando llega la factura de licencias que casi nadie usa bien.
        </p>
      </SprintProse>
    </SprintSection>
  )
}
