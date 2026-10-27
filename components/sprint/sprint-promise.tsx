import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"

const BLOCKS = [
  {
    title: "Diagnóstico + capacitación por rol",
    body: "Equipos técnicos: automatización, agentes y RAG sobre tus sistemas. Equipos ejecutivos: criterio para decidir qué casos valen la pena, con qué datos y a qué costo. Todo sobre tus procesos, no sobre ejemplos genéricos.",
  },
  {
    title: "Laboratorio + hackathon interna",
    body: "Tu gente construye con mi mentoría, con deadline y en equipo, como en una hackathon de verdad. Lo que se arma queda en tu empresa.",
  },
  {
    title: "Gobernanza + roadmap",
    body: "Reglas claras de qué usar, con qué datos y a qué costo, y un plan de 90 días para llevar los prototipos a producción. Dirección deja de enterarse tarde.",
  },
]

export function SprintPromise() {
  return (
    <SprintSection id={SPRINT_ANCHORS.promise} label={SPRINT_SECTION_LABELS.promise} tint>
      <SprintHeading>Menos charlas de innovación. Más equipos construyendo cosas.</SprintHeading>
      <SprintProse>
        <p>
          El AI Execution Sprint junta en una sola secuencia de 30 días tres cosas que normalmente
          contratás por separado: el curso, la consultora y el comité de IA. La diferencia es que
          acá tu equipo termina construyendo.
        </p>
      </SprintProse>

      <ul className="mt-8 space-y-0 border-t border-border">
        {BLOCKS.map((block, i) => (
          <li
            key={i}
            className={`scroll-reveal-stagger-${i + 1} flex gap-4 border-b border-border py-5`}
          >
            <span className="font-mono text-xs text-muted-foreground pt-0.5 select-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{block.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{block.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-10 font-mono text-sm tracking-wide text-[var(--sprint-accent)]">
        &gt; Resultado: prototipos funcionando, un equipo que sabe usarlos y reglas claras para
        escalar.
      </p>
    </SprintSection>
  )
}
