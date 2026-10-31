import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintPortalPreview } from "./sprint-portal-preview"
import { SHOW_SPRINT_PORTAL, SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"
import {
  GraduationCap,
  Target,
  Boxes,
  Route,
  ShieldCheck,
  Sparkles,
  MonitorPlay,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const OUTCOMES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: GraduationCap,
    title: "Equipo capacitado",
    body: "Tu gente sabe qué automatizar, con qué herramientas y con qué criterio.",
  },
  {
    icon: Target,
    title: "Oportunidades priorizadas",
    body: "Un mapa de casos de IA de tu operación, ordenado por impacto y esfuerzo.",
  },
  {
    icon: Boxes,
    title: "Prototipos funcionales",
    body: "Entre 2 y 5, construidos por tu equipo sobre procesos reales.",
  },
  {
    icon: Route,
    title: "Roadmap de implementación",
    body: "Plan de 90 días para llevar lo que sirve a producción.",
  },
  {
    icon: ShieldCheck,
    title: "Marco de gobernanza",
    body: "Políticas de uso, permisos, criterios de costo y visibilidad de quién usa qué.",
  },
  {
    icon: Sparkles,
    title: "Equipo que ya construyó",
    body: "Gente que comprobó que puede construir con IA, no quedarse en la teoría.",
  },
]

export function SprintDeliverables() {
  return (
    <SprintSection id={SPRINT_ANCHORS.deliverables} label={SPRINT_SECTION_LABELS.deliverables} tint>
      <SprintHeading>Qué se queda en tu empresa cuando me voy</SprintHeading>
      <SprintProse lead>
        <p>Prototipos, criterio y reglas. En tu infraestructura, con tu equipo.</p>
      </SprintProse>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OUTCOMES.map(({ icon: Icon, title, body }, i) => (
          <li
            key={title}
            className={`scroll-reveal-stagger-${(i % 3) + 1} group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-[var(--sprint-accent)]/50`}
          >
            <span
              className="sprint-index absolute right-5 top-5 select-none text-xs text-muted-foreground"
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <Icon
              className="size-7 text-[var(--sprint-accent)] transition-transform group-hover:-translate-y-0.5"
              aria-hidden
            />
            <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>

      {/* Portal oculto: la plataforma no está lista. Reactivar con SHOW_SPRINT_PORTAL. */}
      {SHOW_SPRINT_PORTAL ? (
        <div className="scroll-reveal mt-12 rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <MonitorPlay className="size-8 shrink-0 text-[var(--sprint-accent)]" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--sprint-accent)]">
                Portal del sprint
              </p>
              <h3 className="mt-2 font-serif text-lg font-semibold tracking-tight text-foreground">
                El material de tu sprint, en un solo lugar
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Grabaciones, prompts y ejercicios con acceso provisionado por tu empresa. El sponsor
                consulta adopción y exporta métricas desde el panel, sin link público ni material
                perdido en un drive.
              </p>
              <SprintPortalPreview />
            </div>
          </div>
        </div>
      ) : null}
    </SprintSection>
  )
}
