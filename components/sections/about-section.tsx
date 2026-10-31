"use client"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

export function AboutSection() {
  const [translations] = useTranslations()

  return (
    <Section id="about" variant="default" spacing="compact">
      <Container maxWidth="4xl">
        <div className="space-y-14">
          <div>
            <SectionHeader
              className="mb-5 sm:mb-6"
              eyebrow={getTranslation(translations, "about.eyebrow")}
              title={getTranslation(translations, "about.title")}
              description={getTranslation(translations, "about.bio.short")}
            />
            <ul className="list-none">
              <li className="text-sm leading-relaxed text-muted-foreground">
                {getTranslation(translations, "about.credential")}
              </li>
            </ul>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-[var(--sprint-accent)]" />
                <h3 className="sprint-kicker text-[var(--sprint-accent)]">
                  {getTranslation(translations, "about.bio.background.title")}
                </h3>
              </div>
              <div className="space-y-4 pl-0 text-[0.9375rem] leading-[1.7] text-muted-foreground sm:pl-11">
                {getTranslation(translations, "about.bio.background.text")
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-[var(--sprint-accent)]" />
                <h3 className="sprint-kicker text-[var(--sprint-accent)]">
                  {getTranslation(translations, "about.bio.approach.title")}
                </h3>
              </div>
              <div className="space-y-4 pl-0 text-[0.9375rem] leading-[1.7] text-muted-foreground sm:pl-11">
                {getTranslation(translations, "about.bio.approach.text")
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
