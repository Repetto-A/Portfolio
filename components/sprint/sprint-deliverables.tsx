import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintPortalPreview } from "./sprint-portal-preview"
import { SPRINT_ANCHORS } from "@/lib/sprint/constants"
import { GraduationCap, Target, Boxes, Route, ShieldCheck, Sparkles, MonitorPlay } from "lucide-react"
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
    title: "Energía interna",
    body: "Un equipo que comprobó que puede construir con IA, no quedarse en la teoría.",
  },
]

export function SprintDeliverables() {
  return (
    <SprintSection id={SPRINT_ANCHORS.deliverables} label="04 / Entregables" tint>
      <SprintHeading>Qué queda en tu empresa cuando termina el sprint</SprintHeading>
      <SprintProse lead>
        <p>
          Todo lo construido queda en tu infraestructura y con tu equipo. Yo me voy, el
          conocimiento no.
        </p>
      </SprintProse>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OUTCOMES.map(({ icon: Icon, title, body }, i) => (
          <li
            key={title}
            className={`scroll-reveal-stagger-${(i % 3) + 1} group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-[var(--sprint-accent)]/50`}
          >
            <span className="absolute right-5 top-5 font-mono text-xs text-muted-foreground/50 select-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Icon
              className="size-7 text-[var(--sprint-accent)] transition-transform group-hover:-translate-y-0.5"
              aria-hidden
            />
            <h3 className="mt-4 text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>

      <div className="scroll-reveal mt-12 rounded-xl border border-[oklch(0.88_0.014_75)] bg-[oklch(0.985_0.006_75)] p-6 sm:p-8 dark:border-[oklch(0.32_0.012_75)] dark:bg-[oklch(0.2_0.008_75)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <MonitorPlay
            className="size-8 shrink-0 text-[var(--sprint-accent)]"
            aria-hidden
          />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--sprint-accent)]">
              Portal del sprint
            </p>
            <h3 className="mt-2 font-serif text-lg font-semibold tracking-tight">
              El material de tu sprint, en un solo lugar
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Grabaciones, prompts y ejercicios con acceso provisionado por tu empresa.
              El sponsor consulta adopción y exporta métricas desde el panel — sin link
              público ni material perdido en un drive.
            </p>
            <SprintPortalPreview />
          </div>
        </div>
      </div>
    </SprintSection>
  )
}
