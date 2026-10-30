import { SprintCriaLink } from "./sprint-ext-link"
import { SprintDirectContact } from "./sprint-direct-contact"
import { SPRINT_ANCHORS } from "@/lib/sprint/constants"

export function SprintHero() {
  return (
    <header className="relative overflow-hidden pt-28 pb-24 sm:pt-36 sm:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl"
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

        <p className="sprint-enter sprint-enter-2 sprint-measure mt-7 text-[1.0625rem] leading-[1.7] text-pretty text-muted-foreground sm:mt-8 sm:text-lg">
          Capacito a tus equipos técnicos y ejecutivos sobre sus procesos reales y cerramos con una
          hackathon interna. Al final quedan entre 2 y 5 prototipos hechos por tu gente, reglas
          claras de uso y un roadmap para llevarlos a producción. Nada de un PDF que nadie vuelve a
          abrir.
        </p>

        <div className="sprint-enter sprint-enter-3 mt-10 flex flex-col gap-3 sm:mt-12">
          <SprintDirectContact
            location="hero"
            calendlyLabel={
              <>
                Agendar diagnóstico de <span className="whitespace-nowrap">20 min</span>
              </>
            }
          />
          <a
            href={`#${SPRINT_ANCHORS.howItWorks}`}
            className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium transition-[border-color,background-color,color,transform] duration-200 ease-out hover:border-foreground/40 hover:bg-muted/50 active:scale-[0.98]"
          >
            Ver cómo funciona
            <span aria-hidden>→</span>
          </a>
        </div>

        <p className="sprint-enter sprint-enter-4 sprint-measure mt-14 border-l-2 border-[var(--sprint-accent)] pl-5 text-[0.9375rem] leading-[1.7] text-muted-foreground sm:mt-16">
          Soy Software Engineer enfocado en IA. Doy clases en la Diplomatura de IA aplicada al
          ejercicio profesional (UCEL), capacito y asesoro equipos en <SprintCriaLink />, fundé NEXA
          (+3M de personas en +50 comunidades) y soy SpaceXAI Ambassador.
          <br />
          Ya capacité en IA a más de 500 personas entre CRIA y la Diplomatura de UCEL. Vengo del
          deporte competitivo: ahí aprendí que bajo presión se ve quién ejecuta.
        </p>
      </div>
    </header>
  )
}
