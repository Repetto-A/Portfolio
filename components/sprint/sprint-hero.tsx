import { SprintCriaLink } from "./sprint-ext-link"
import { SprintDirectContact } from "./sprint-direct-contact"
import { SPRINT_ANCHORS } from "@/lib/sprint/constants"

const SNAPSHOT = [
  {
    label: "Oferta",
    text: "Sprint de 30 días: diagnóstico, capacitación aplicada y hackathon interna.",
  },
  {
    label: "Para",
    text: "Dirección y equipos ejecutivos que ya hablaron de IA y quieren ejecución.",
  },
  {
    label: "Resultado",
    text: "Entre 2 y 5 prototipos hechos por tu gente, reglas de uso y un roadmap de 90 días.",
  },
] as const

export function SprintHero() {
  return (
    <header data-sprint-hero className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div
        aria-hidden
        className="sprint-hero-glow pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--sprint-accent), transparent)" }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="sprint-enter sprint-kicker text-muted-foreground">
          AI Execution Sprint · Capacitación y hackathons internas
        </p>

        <h1 className="sprint-enter sprint-display mt-7 max-w-[18ch] text-[2.35rem] sm:mt-8 sm:max-w-[20ch] sm:text-[3.15rem] lg:text-[3.65rem]">
          Tu empresa deja de hablar de IA y{" "}
          <span className="text-[var(--sprint-accent)]">empieza a ejecutar con IA</span>. En{" "}
          <span className="whitespace-nowrap">30 días</span>, con tu propio equipo.
        </h1>

        <p className="sprint-enter sprint-enter-2 sprint-measure mt-6 text-[1.0625rem] leading-[1.7] text-pretty text-muted-foreground sm:mt-7 sm:text-lg">
          Capacito a tus equipos técnicos y ejecutivos sobre procesos reales. Cerramos con una
          hackathon interna. No te vas con un PDF: te vas con prototipos funcionando.
        </p>

        <div className="sprint-enter sprint-enter-3 mt-8 flex flex-col gap-3 sm:mt-10">
          <SprintDirectContact location="hero" />
          <a
            href={`#${SPRINT_ANCHORS.audience}`}
            className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium transition-[border-color,background-color,color,transform] duration-200 ease-out hover:border-foreground/40 hover:bg-muted/50 active:scale-[0.98]"
          >
            ¿Es para tu empresa?
            <span aria-hidden>→</span>
          </a>
        </div>

        <dl className="sprint-enter sprint-enter-4 mt-8 grid gap-5 border-t border-border pt-6 sm:mt-10 sm:grid-cols-3 sm:gap-8">
          {SNAPSHOT.map((row) => (
            <div key={row.label}>
              <dt className="sprint-kicker text-[var(--sprint-accent)]">{row.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-foreground">{row.text}</dd>
            </div>
          ))}
        </dl>

        <p className="sprint-enter sprint-enter-4 sprint-measure mt-8 text-sm leading-relaxed text-muted-foreground">
          Ya capacité en IA a +300 personas entre <SprintCriaLink /> y la Diplomatura de UCEL.
          Capacito sobre todo con Cursor y Grok Bot.
        </p>
      </div>
    </header>
  )
}
