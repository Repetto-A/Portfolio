"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { useTranslations, getTranslation } from "@/lib/i18n-context"
import { SPRINT_CURRICULUM } from "@/lib/sprint/curriculum"

export function TrainingsSection() {
  const [translations, locale] = useTranslations()
  const lang = locale === "es" ? "es" : "en"

  const paces = [
    {
      name: getTranslation(translations, "trainings.paceIntensivo"),
      detail: getTranslation(translations, "trainings.paceIntensivoDetail"),
    },
    {
      name: getTranslation(translations, "trainings.paceSostenido"),
      detail: getTranslation(translations, "trainings.paceSostenidoDetail"),
    },
  ]

  return (
    <Section id="trainings" variant="muted" spacing="default">
      <Container maxWidth="4xl">
        <SectionHeader
          eyebrow={getTranslation(translations, "trainings.eyebrow")}
          title={getTranslation(translations, "trainings.title")}
          description={getTranslation(translations, "trainings.lead")}
        />

        <p className="sprint-measure text-[0.9375rem] leading-[1.7] text-muted-foreground">
          {getTranslation(translations, "trainings.proof")}
        </p>

        <h3 className="sprint-display mt-12 text-[1.5rem] sm:text-[1.875rem]">
          {getTranslation(translations, "trainings.pacesHeadline")}
        </h3>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {paces.map((pace, i) => (
            <div key={pace.name} className="rounded-xl border border-border bg-card p-6 sm:p-7">
              <div className="flex items-baseline gap-3">
                <span className="sprint-index select-none text-xs text-[var(--sprint-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="text-base font-semibold tracking-tight">{pace.name}</h4>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pace.detail}</p>
            </div>
          ))}
        </div>

        <div id="trainings-program" className="mt-12 scroll-mt-20">
          <p className="sprint-kicker text-muted-foreground">
            {getTranslation(translations, "trainings.programKicker")}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {getTranslation(translations, "trainings.programLead")}
          </p>

          <ol className="mt-5 divide-y divide-border border-y border-border">
            {SPRINT_CURRICULUM.map((module, i) => (
              <li key={module.title.es} className="flex gap-4 py-4">
                <span className="sprint-index mt-0.5 select-none text-xs text-[var(--sprint-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold tracking-tight">{module.title[lang]}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {module.summary[lang]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10">
          <Link
            href="/sprint"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-[background-color,transform] duration-200 ease-out hover:bg-primary/90 active:scale-[0.98]"
          >
            {getTranslation(translations, "trainings.cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            {getTranslation(translations, "trainings.ctaHint")}
          </p>
        </div>
      </Container>
    </Section>
  )
}
