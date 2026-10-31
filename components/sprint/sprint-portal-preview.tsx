/**
 * Vista previa estática del portal del sprint (sin captura real).
 * El encabezado vive afuera, en sprint-deliverables; acá solo el contenido.
 * Colores vía tokens del tema (sirve en light y dark).
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
      className="mt-6 overflow-hidden rounded-lg border border-border bg-background shadow-sm"
      aria-hidden
    >
      <div className="px-5 py-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--sprint-accent)]">
          Qué incluye
        </p>
        <ul className="grid list-none gap-4 sm:grid-cols-2">
          {BENTO_TILES.map((tile) => (
            <li key={tile.title}>
              <article className="flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-[border-color,box-shadow] hover:border-[var(--sprint-accent)]/40 hover:shadow-sm">
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                  <span className="h-px w-4 shrink-0 bg-[var(--sprint-accent)]" aria-hidden />
                  {tile.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {tile.description}
                </p>
                {"progress" in tile && tile.progress != null ? (
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
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
    </div>
  )
}
