"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type CurriculumTopic = string | { label: string; href: string }
export type CurriculumModule = { title: string; topics: readonly CurriculumTopic[] }

export function SprintCurriculum({ modules }: { modules: readonly CurriculumModule[] }) {
  const [open, setOpen] = useState(false)
  const totalTopics = modules.reduce((n, m) => n + m.topics.length, 0)

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-[var(--sprint-accent)]/40 bg-[var(--sprint-accent)]/[0.04]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="sprint-curriculum-panel"
        className="flex w-full cursor-pointer items-center justify-between gap-6 p-6 text-left transition-colors hover:bg-[var(--sprint-accent)]/[0.06] sm:p-8"
      >
        <div>
          <span className="sprint-kicker text-[var(--sprint-accent)]">Temario completo</span>
          <p className="mt-1.5 text-lg font-semibold tracking-tight sm:text-xl">
            {modules.length} módulos · +{totalTopics} temas
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Del prompting y el harness engineering a MCPs, automatizaciones e infraestructura
            on-premise.
          </p>
        </div>
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--sprint-accent)]/40 text-[var(--sprint-accent)] transition-transform duration-300",
            open && "rotate-180"
          )}
        >
          <ChevronDown className="size-5" aria-hidden />
        </span>
      </button>

      <div
        id="sprint-curriculum-panel"
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[var(--sprint-ease-out)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="divide-y divide-border border-t border-[var(--sprint-accent)]/40 bg-card">
            {modules.map((module, i) => (
              <div key={module.title} className="p-5 sm:p-6">
                <div className="flex items-baseline gap-3">
                  <span className="sprint-index text-xs text-[var(--sprint-accent)] select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="text-sm font-semibold sm:text-base">{module.title}</h4>
                </div>
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
                            className="inline-flex items-center gap-1 rounded-full border border-[var(--sprint-accent)]/40 bg-background px-3 py-1 text-xs leading-relaxed text-muted-foreground underline decoration-[var(--sprint-accent)]/50 underline-offset-2 transition-colors hover:text-foreground"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
