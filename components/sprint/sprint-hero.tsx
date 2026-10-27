import { SprintCriaLink } from "./sprint-ext-link"
import { SprintDirectContact } from "./sprint-direct-contact"
import { ProfilePhoto } from "@/components/profile-photo"
import { SPRINT_ANCHORS } from "@/lib/sprint/constants"

export function SprintHero() {
  return (
    <header className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--sprint-accent), transparent)" }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
          <div>
            <p className="sprint-enter font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
              AI Execution Sprint · Capacitación y hackathons internas
            </p>

            <h1 className="sprint-enter mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              Tu empresa deja de hablar de IA y{" "}
              <span className="text-[var(--sprint-accent)]">empieza a ejecutar con IA</span>. En 30
              días, con tu propio equipo.
            </h1>

            <p className="sprint-enter sprint-enter-2 mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Capacito a tus equipos técnicos y ejecutivos sobre sus procesos reales y cerramos con
              una hackathon interna. Al final quedan entre 2 y 5 prototipos hechos por tu gente,
              reglas claras de uso y un roadmap para llevarlos a producción. Nada de un PDF que
              nadie vuelve a abrir.
            </p>

            <div className="sprint-enter sprint-enter-3 mt-9 flex flex-col gap-3">
              <SprintDirectContact
                location="hero"
                calendlyLabel="Agendar diagnóstico gratuito de 20 min"
              />
              <a
                href={`#${SPRINT_ANCHORS.howItWorks}`}
                className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium transition-[border-color,background-color,color,transform] duration-200 ease-out hover:border-foreground/40 hover:bg-muted/50 active:scale-[0.98]"
              >
                Ver cómo funciona
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <div className="sprint-enter sprint-enter-2 relative mx-auto aspect-[4/5] w-48 overflow-hidden rounded-2xl ring-1 ring-border shadow-xl sm:w-56 lg:w-full">
            <ProfilePhoto
              alt="Alejandro Repetto, Software Engineer"
              sizes="(max-width: 1024px) 224px, 280px"
              priority
            />
          </div>
        </div>

        <p className="sprint-enter sprint-enter-4 mt-12 border-l-2 border-[var(--sprint-accent)] pl-4 text-sm leading-relaxed text-muted-foreground">
          Soy Software Engineer enfocado en IA. Doy clases en la Diplomatura en IA Aplicada al
          Ejercicio Profesional de UCEL, capacito y asesoro equipos en <SprintCriaLink />, fundé
          NEXA (+3M de personas en +50 comunidades) y soy SpaceXAI Ambassador.
          <br />
          Ya capacité en IA a más de 500 personas entre CRIA y la Diplomatura de UCEL. Vengo del
          deporte competitivo: ahí aprendí que bajo presión se ve quién ejecuta.
        </p>
      </div>
    </header>
  )
}
