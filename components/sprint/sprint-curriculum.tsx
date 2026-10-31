export type CurriculumTopic = string | { label: string; href: string }
export type CurriculumModule = {
  title: string
  summary?: string
  topics: readonly CurriculumTopic[]
}

export function SprintCurriculum({ modules }: { modules: readonly CurriculumModule[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border">
      <div className="border-b border-border bg-[var(--sprint-accent)]/[0.04] px-5 py-5 sm:px-6">
        <span className="sprint-kicker text-[var(--sprint-accent)]">Programa modular</span>
        <p className="mt-1.5 text-lg font-semibold tracking-tight sm:text-xl">
          {modules.length} módulos. La empresa elige.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          El eje es Cursor y Grok Bot. Claude Code también, y Claude Code dedicado a pedido.
        </p>
      </div>

      <ol className="list-none divide-y divide-border bg-card">
        {modules.map((module, i) => (
          <li key={module.title} className="p-5 sm:p-6">
            <div className="flex items-baseline gap-3">
              <span className="sprint-index text-xs text-[var(--sprint-accent)] select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="text-sm font-semibold sm:text-base">{module.title}</h4>
            </div>
            {module.summary ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:pl-8">
                {module.summary}
              </p>
            ) : null}
            <ul className="mt-3.5 flex flex-wrap gap-2 sm:pl-8">
              {module.topics.map((topic) => {
                const isLink = typeof topic !== "string"
                const label = isLink ? topic.label : topic
                return (
                  <li key={label}>
                    {isLink ? (
                      <a
                        href={topic.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-1 rounded-full border border-[var(--sprint-accent)]/40 bg-background px-3 py-1.5 text-xs leading-relaxed text-muted-foreground underline decoration-[var(--sprint-accent)]/50 underline-offset-2 transition-colors hover:text-foreground"
                      >
                        {label}
                      </a>
                    ) : (
                      <span className="inline-block rounded-full border border-border bg-background px-3 py-1 text-xs leading-relaxed text-muted-foreground">
                        {label}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
