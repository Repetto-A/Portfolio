"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { useTranslations, getTranslation } from "@/lib/i18n-context"
import { SPRINT_CURRICULUM } from "@/lib/sprint/curriculum"
import { SprintCalendlyButton } from "@/components/sprint/sprint-calendly-button"
import { OfferLadder } from "@/components/sprint/offer-ladder-body"

export function TrainingsSection() {
  const [translations, locale] = useTranslations()
  const lang = locale === "es" ? "es" : "en"

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

        <div className="mt-12">
          <OfferLadder locale={lang} />
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

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <SprintCalendlyButton location="home-trainings" className="w-full sm:w-auto">
            {getTranslation(translations, "trainings.talk")}
          </SprintCalendlyButton>
          <Link
            href="/sprint"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium transition-[border-color,background-color,transform] duration-200 ease-out hover:border-foreground/40 hover:bg-muted/50 active:scale-[0.98] sm:w-auto"
          >
            {getTranslation(translations, "trainings.cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {getTranslation(translations, "trainings.ctaHint")}
        </p>
      </Container>
    </Section>
  )
}
