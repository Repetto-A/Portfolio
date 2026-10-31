import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

type Format = {
  tier: string
  name: string
  stage: string
  includes: string | readonly string[]
  duration: string
  core?: boolean
}

const FORMATS: Format[] = [
  {
    tier: "Lite",
    name: "Executive Briefing",
    stage: "Dirección quiere entender antes de invertir",
    includes: "Sesión ejecutiva + mapa inicial de oportunidades",
    duration: "2-4 horas",
  },
  {
    tier: "Core",
    name: "AI Training para equipos",
    stage: "Un área técnica o ejecutiva quiere capacitarse en serio",
    includes:
      "Track técnico (automatización, agentes, RAG) o ejecutivo (criterio, casos y costos) + workflows por rol",
    duration: "3-6 sesiones",
  },
  {
    tier: "Build",
    name: "Hackathon interna",
    stage: "Querés que tu equipo construya sobre problemas reales, con deadline",
    includes: "Desafíos definidos con tu empresa + mentoría + demo day con prototipos",
    duration: "1-2 días",
  },
  {
    tier: "Pro",
    name: "AI Execution Sprint",
    stage: "Querés adopción real con prototipos",
    includes: [
      "Diagnóstico + capacitación",
      "Laboratorio + hackathon interna",
      "Prototipos funcionales",
      "Marco de gobernanza de IA",
      "Roadmap de 90 días",
    ],
    duration: "3-5 semanas",
    core: true,
  },
  {
    tier: "Partner",
    name: "Implementation",
    stage: "Ya hiciste el sprint y querés implementar",
    includes: "Acompañamiento mensual continuo",
    duration: "Mensual",
  },
]

function FormatIncludes({
  includes,
  core,
}: {
  includes: string | readonly string[]
  core?: boolean
}) {
  if (Array.isArray(includes)) {
    return (
      <ul className={cn("mt-3 space-y-2", core && "sm:columns-2 sm:gap-x-8")}>
        {includes.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed break-inside-avoid">
            <Check className="mt-0.5 size-4 shrink-0 text-[var(--sprint-accent)]" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  return <p className="mt-1 text-sm leading-relaxed">{includes}</p>
}

function FormatRow({ format: f }: { format: Format }) {
  if (f.core) {
    return (
      <div className="sprint-recommended relative my-6 rounded-xl border border-[var(--sprint-accent)]/50 bg-card p-6 shadow-md ring-1 ring-[var(--sprint-accent)]/20 sm:p-8">
        <span className="sprint-kicker absolute -top-2.5 left-6 rounded-full bg-[color-mix(in_oklab,var(--sprint-accent),black_28%)] px-2.5 py-0.5 text-[var(--sprint-accent-foreground)]">
          Recomendado
        </span>

        <div className="grid gap-4 sm:grid-cols-[110px_1fr_110px] sm:gap-6">
          <span className="sprint-kicker pt-1 text-[var(--sprint-accent)]">{f.tier}</span>
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{f.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.stage}</p>
            <FormatIncludes includes={f.includes} core />
          </div>
          <span className="sprint-index text-xs text-muted-foreground sm:pt-1 sm:text-right">
            <span className="sm:hidden">Duración · </span>
            {f.duration}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-2 border-t border-border py-5 sm:grid-cols-[110px_1fr_110px] sm:gap-6">
      <span className="sprint-kicker pt-1 text-muted-foreground">{f.tier}</span>
      <div>
        <h3 className="font-semibold tracking-tight">{f.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.stage}</p>
        <FormatIncludes includes={f.includes} />
      </div>
      <span className="sprint-index text-xs text-muted-foreground sm:pt-1 sm:text-right">
        <span className="sm:hidden">Duración · </span>
        {f.duration}
      </span>
    </div>
  )
}

export function SprintFormats() {
  return (
    <SprintSection
      id={SPRINT_ANCHORS.formats}
      label={SPRINT_SECTION_LABELS.formats}
      spacing="compact"
    >
      <SprintHeading>El sprint completo es el formato. Hay puntos de entrada.</SprintHeading>
      <SprintProse lead>
        <p>
          Si todavía no estás para 30 días, arrancamos por un briefing o una capacitación. Si ya
          hiciste el sprint, sigue el acompañamiento de implementación.
        </p>
      </SprintProse>

      <div className="mt-10">
        <div className="hidden grid-cols-[110px_1fr_110px] gap-6 pb-3 sm:grid">
          <span className="sprint-kicker text-muted-foreground">Formato</span>
          <span className="sprint-kicker text-muted-foreground">Para quién / qué incluye</span>
          <span className="sprint-kicker text-muted-foreground sm:text-right">Duración</span>
        </div>

        {FORMATS.map((f) => (
          <FormatRow key={f.tier} format={f} />
        ))}

        <div className="border-b border-border" />
      </div>
    </SprintSection>
  )
}
