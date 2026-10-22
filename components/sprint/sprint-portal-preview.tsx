/**
 * Vista previa estática del portal del sprint (sin captura real).
 * Warm paper + bento, alineado al DESIGN.md del portal Academy.
 */

const BENTO_TILES = [
  {
    title: "Grabaciones",
    description: "Sesiones del sprint disponibles para repaso cuando las necesitás.",
  },
  {
    title: "Prompts y plantillas",
    description: "Biblioteca de prompts listos para usar en tu rol o equipo.",
  },
  {
    title: "Progreso del equipo",
    description: "Seguimiento de quién completó cada módulo y ejercicio.",
    progress: 67,
  },
  {
    title: "Reporte de adopción",
    description: "Métricas exportables para sponsors y responsables internos.",
  },
] as const

export function SprintPortalPreview() {
  return (
    <div
      className="mt-6 overflow-hidden rounded-lg border border-[oklch(0.88_0.014_75)] bg-[oklch(0.985_0.006_75)] shadow-sm"
      aria-hidden
    >
      <div className="border-b border-[oklch(0.88_0.014_75)] px-5 py-4">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[var(--sprint-accent)]">
          Portal del sprint
        </p>
        <p className="mt-2 font-serif text-lg font-semibold tracking-tight text-[oklch(0.22_0.03_255)]">
          El material de tu sprint, en un solo lugar
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Grabaciones, prompts y ejercicios con acceso provisionado por tu empresa.
        </p>
      </div>

      <div className="px-5 py-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--sprint-accent)]">
          Qué incluye
        </p>
        <ul className="grid list-none gap-4 sm:grid-cols-2">
          {BENTO_TILES.map((tile) => (
            <li key={tile.title}>
              <article className="flex h-full flex-col rounded-lg border border-border bg-card/80 p-4 transition-[border-color,box-shadow] hover:border-[var(--sprint-accent)]/40 hover:shadow-sm">
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold tracking-tight">
                  <span
                    className="h-px w-4 shrink-0 bg-[var(--sprint-accent)]"
                    aria-hidden
                  />
                  {tile.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {tile.description}
                </p>
                {"progress" in tile && tile.progress != null ? (
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[oklch(0.945_0.012_75)]">
                    <div
                      className="h-full rounded-full bg-[var(--sprint-accent)]"
                      style={{ width: `${tile.progress}%` }}
                    />
                  </div>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[oklch(0.88_0.014_75)] px-5 py-2.5">
        <p className="font-mono text-[10px] text-muted-foreground/80">
          portal.repetto-a.com · acceso provisionado por la empresa
        </p>
      </div>
    </div>
  )
}
