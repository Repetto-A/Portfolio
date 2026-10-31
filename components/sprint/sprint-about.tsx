import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintCriaLink, SprintNexaLink } from "./sprint-ext-link"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS, TRAINED_PEOPLE_STAT } from "@/lib/sprint/constants"
import { SPRINT_AWARDS } from "@/lib/sprint/proof"

const HIGHLIGHTS = [
  {
    stat: TRAINED_PEOPLE_STAT,
    label:
      "Personas capacitadas en IA entre CRIA y la Diplomatura de IA aplicada al ejercicio profesional (UCEL)",
  },
  {
    stat: "+3M",
    label: "Personas conectadas a través de NEXA, la red que fundé con +50 comunidades tech",
  },
  {
    stat: "En prod",
    label: "Agentes y RAG corriendo en empresas, no en demos",
  },
] as const

const FACTS = [
  <>
    Capacito equipos técnicos y ejecutivos en adopción de IA junto a <SprintCriaLink />, y doy
    clases en la Diplomatura de IA aplicada al ejercicio profesional (UCEL). También trabajo de
    forma directa con las empresas.
  </>,
  <>
    Soy SpaceXSI Ambassador. El stack con el que trabajo arranca en Cursor y Grok Bot. También di
    capacitaciones con Copilot y otras herramientas.
  </>,
  <>
    Fundé <SprintNexaLink />: +50 comunidades y +3M de personas. Soy host de Builders Off The Record
    y miembro de SupaSquad (Supabase).
  </>,
  <>
    Soy embajador de Rosario Tech Week y organizo Shippear y NASA Space Apps Rosario. Organicé 4
    hackathons en 3 meses, con +50 personas por evento. En una hackathon reciente, los equipos
    entregaron software a medida a 18 ONGs internacionales como Amnistía, Techo, CELS y el banco de
    alimentos.
  </>,
  <>
    Premios en NASA Space Apps (Local Award Winner y Global Nominee), ETH Global, Vercel Hackathon
    2026 y Platanus Hack 2026. Las hackathons no las miro de afuera: las armo y las compito.
  </>,
] as const

export function SprintAbout() {
  return (
    <SprintSection id={SPRINT_ANCHORS.about} label={SPRINT_SECTION_LABELS.about}>
      <SprintHeading>Lo facilito yo. Lo construye tu equipo.</SprintHeading>
      <SprintProse lead>
        <p>
          Alejandro Repetto. Software Engineer enfocado en IA: la enseño, la bajo a tierra en
          empresas y la pongo a prueba en hackathons. Vengo del deporte competitivo y trabajo igual:
          con deadline y bajo presión.
        </p>
      </SprintProse>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map((h, i) => (
          <div
            key={h.label}
            className={`scroll-reveal-stagger-${i + 1} rounded-xl border border-border bg-card p-6 transition-colors hover:border-[var(--sprint-accent)]/50`}
          >
            <p className="sprint-index text-[2rem] font-semibold tracking-tight text-[var(--sprint-accent)] sm:text-4xl">
              {h.stat}
            </p>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{h.label}</p>
          </div>
        ))}
      </div>

      <ul className="mt-8 space-y-4">
        {FACTS.map((fact, i) => (
          <li key={i} className="flex gap-4 text-sm leading-relaxed">
            <span className="sprint-index text-[var(--sprint-accent)] select-none" aria-hidden>
              +
            </span>
            <span>{fact}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="sprint-kicker text-muted-foreground">Reconocimientos</h3>
          <p className="sprint-index text-xs text-muted-foreground">
            Lo que enseño, lo demuestro en competencias
          </p>
        </div>

        <ul className="mt-5 border-t border-border">
          {SPRINT_AWARDS.map((award) => (
            <li
              key={award.event}
              className="grid gap-1 border-b border-border py-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6"
            >
              <div>
                <span className="text-sm font-medium">{award.event}</span>
                <span className="ml-2 text-xs text-muted-foreground">{award.project}</span>
              </div>
              <span className="sprint-index text-xs text-[var(--sprint-accent)] sm:text-right">
                {award.result}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SprintSection>
  )
}
