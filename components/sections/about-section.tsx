"use client"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

export function AboutSection() {
  const [translations] = useTranslations()

  return (
    <Section id="about" variant="default" spacing="default">
      <Container maxWidth="4xl">
        <div className="space-y-12">
          <SectionHeader
            title={getTranslation(translations, "about.title")}
            description={getTranslation(translations, "about.bio.short")}
          />

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Background */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                {getTranslation(translations, "about.bio.background.title")}
              </h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {getTranslation(translations, "about.bio.background.text")
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </div>

            {/* Approach */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                {getTranslation(translations, "about.bio.approach.title")}
              </h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
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
