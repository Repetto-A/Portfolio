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
            title={getTranslation(translations, "about.title", "About")}
            description={getTranslation(
              translations,
              "about.bio.short",
              "A passionate systems engineering student dedicated to building intelligent solutions that save people time and simplify complex processes. I focus on creating automation systems, management platforms, and AI/ML applications that transform everyday business challenges into streamlined, efficient workflows.",
            )}
          />

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Background */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                {getTranslation(translations, "about.bio.background.title", "Background")}
              </h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {getTranslation(
                  translations,
                  "about.bio.background.text",
                  "I'm a 23-year-old systems engineering student specializing in management systems, automation, and AI/ML development. My work focuses on creating practical solutions that solve real-world business challenges.\n\nFrom factory quoting systems to real estate management platforms, I enjoy building applications that not only optimize operations but also create smoother, more intuitive user experiences. Recently, I contributed to NASA's Space Apps Challenge with an AI-powered seismic detection solution, alongside developing automation tools for various industries.",
                )
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </div>

            {/* Approach */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                {getTranslation(translations, "about.bio.approach.title", "Approach")}
              </h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {getTranslation(
                  translations,
                  "about.bio.approach.text",
                  "I believe technology should give people back their time. Every project begins with deeply understanding the core problem, then designing solutions that are scalable, maintainable, and user-focused.\n\nMy experience spans full-stack development, machine learning implementation, and system architecture. I'm particularly interested in how AI and automation can transform traditional business processes and create new opportunities for innovation.",
                )
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
