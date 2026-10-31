import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintCalendlyButton } from "./sprint-calendly-button"
import {
  CALENDLY_URL,
  CTA_COPY,
  SPRINT_ANCHORS,
  SPRINT_SECTION_LABELS,
} from "@/lib/sprint/constants"
import { cn } from "@/lib/utils"
import { Check, ShieldCheck } from "lucide-react"

type Tier = {
  tier: string
  name: string
  price: string
  priceNote?: string
  stage: string
  includes: string[]
  core?: boolean
}

const TIERS: Tier[] = [
  {
    tier: "Core",
    name: "AI Training para equipos",
    price: "USD 2.000 a 6.000",
    stage: "Para que un área técnica o ejecutiva se capacite en serio.",
    includes: ["Track técnico o ejecutivo", "Workflows por rol", "Toolkit adaptado a tu operación"],
  },
  {
    tier: "Pro",
    name: "AI Execution Sprint",
    price: "desde USD 7.500",
    stage: "Adopción real que termina en prototipos.",
    includes: [
      "Diagnóstico + capacitación",
      "Laboratorio + hackathon interna",
      "Prototipos funcionales",
      "Marco de gobernanza de IA",
      "Roadmap de 90 días",
    ],
    core: true,
  },
  {
    tier: "Partner",
    name: "Implementation",
    price: "Mensual · a medida",
    stage: "Para implementar lo que salió del sprint.",
    includes: [
      "Acompañamiento mensual",
      "Prototipos llevados a producción",
      "Seguimiento de implementación",
    ],
  },
]

/**
 * Sección de inversión. No borrar: se oculta con SHOW_SPRINT_PRICING=false.
 */
export function SprintPricing() {
  return (
    <SprintSection
      id={SPRINT_ANCHORS.pricing}
      label={SPRINT_SECTION_LABELS.pricing}
      spacing="compact"
    >
      <SprintHeading>La inversión, según cómo quieras empezar</SprintHeading>
      <SprintProse lead>
        <p>
          El corazón de la propuesta es el sprint completo. Los otros formatos son puntos de
          entrada. Para dimensionarlo: cuesta menos que una consultoría tradicional que termina en
          un informe, y acá te vas con tu equipo capacitado y prototipos funcionando.
        </p>
      </SprintProse>

      <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)_minmax(0,1fr)] sm:items-center sm:gap-5">
        {TIERS.map((t, i) => (
          <div
            key={t.tier}
            className={cn(
              `scroll-reveal-stagger-${i + 1} relative flex flex-col rounded-xl border bg-card p-6`,
              t.core
                ? "z-10 border-[var(--sprint-accent)]/50 p-7 shadow-lg ring-1 ring-[var(--sprint-accent)]/25 sm:-my-2 sm:p-8"
                : "border-border transition-colors hover:border-foreground/20 sm:py-5"
            )}
          >
            {t.core ? (
              <span className="absolute -top-2.5 left-6 rounded-full bg-[var(--sprint-accent)] px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-[0.15em] text-[var(--sprint-accent-foreground)] uppercase">
                Recomendado
              </span>
            ) : null}

            <span className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
              {t.tier}
            </span>
            <h3 className={cn("mt-2 font-semibold", t.core ? "text-xl" : "text-lg")}>{t.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.stage}</p>

            <p
              className={cn(
                "mt-4 font-mono font-medium text-foreground",
                t.core ? "text-lg" : "text-base"
              )}
            >
              {t.price}
            </p>

            <ul className="mt-5 flex-1 space-y-2.5">
              {t.includes.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sprint-accent)]"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {t.core ? (
              <a
                href={`#${SPRINT_ANCHORS.guarantee}`}
                className="mt-5 flex items-start gap-2.5 rounded-lg border border-[var(--sprint-accent)]/30 bg-[var(--sprint-accent)]/[0.06] px-3.5 py-3 text-sm leading-snug transition-[background-color,transform] duration-200 ease-out hover:bg-[var(--sprint-accent)]/[0.1] active:scale-[0.99]"
              >
                <ShieldCheck
                  className="mt-0.5 size-4 shrink-0 text-[var(--sprint-accent)]"
                  aria-hidden
                />
                <span>
                  <span className="font-medium">Garantía por escrito:</span>{" "}
                  <span className="text-muted-foreground">
                    si no salís con un prototipo funcional, sigo sin costo hasta lograrlo.
                  </span>
                </span>
              </a>
            ) : null}

            <div className="mt-6">
              {t.core ? (
                <SprintCalendlyButton location="pricing" className="w-full justify-center">
                  {CTA_COPY.primary}
                </SprintCalendlyButton>
              ) : (
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium transition-[border-color,background-color,transform] duration-200 ease-out hover:border-foreground/40 hover:bg-muted/50 active:scale-[0.98]"
                >
                  Consultar
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        El precio final depende de tres cosas: cuántas personas participan, si es presencial o
        remoto y cuántos procesos atacamos. Lo cerramos en el diagnóstico, por escrito y antes de
        que te comprometas a nada. Si todavía están evaluando, podés arrancar con un Executive
        Briefing de 2 a 4 horas (USD 500 a 1.500) para que la dirección decida con criterio. La
        hackathon interna también se puede contratar suelta: se cotiza a medida.
      </p>
    </SprintSection>
  )
}
