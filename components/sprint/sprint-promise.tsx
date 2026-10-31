import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"

const BLOCKS = [
  {
    title: "Diagnóstico + capacitación por rol",
    body: "Equipos técnicos: automatización, agentes y RAG sobre tus sistemas. Equipos ejecutivos: criterio para decidir qué casos valen la pena, con qué datos y a qué costo. Todo sobre tus procesos, no sobre ejemplos genéricos.",
  },
  {
    title: "Laboratorio + hackathon interna",
    body: "Tu gente construye con mi mentoría, con deadline y en equipo. Lo que se arma queda en tu empresa.",
  },
  {
    title: "Gobernanza + roadmap",
    body: "Reglas claras de qué usar, con qué datos y a qué costo, y un plan de 90 días para llevar los prototipos a producción.",
  },
]

export function SprintPromise() {
  return (
    <SprintSection id={SPRINT_ANCHORS.promise} label={SPRINT_SECTION_LABELS.promise} tint>
      <SprintHeading>Un sprint de 30 días. Tu equipo termina construyendo.</SprintHeading>
      <SprintProse>
        <p>
          En una sola secuencia: diagnóstico, capacitación aplicada y hackathon interna. Al final
          quedan prototipos funcionando, un equipo que sabe usarlos y reglas para escalar.
        </p>
      </SprintProse>

      <ul className="mt-10 space-y-0 border-t border-border">
        {BLOCKS.map((block, i) => (
          <li
            key={i}
            className={`scroll-reveal-stagger-${i + 1} flex gap-4 border-b border-border py-5 sm:py-6`}
          >
            <span className="sprint-index pt-0.5 text-xs text-muted-foreground select-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-[0.9375rem] font-medium tracking-tight text-foreground">
                {block.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{block.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </SprintSection>
  )
}
