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
            description={getTranslation(
              translations,
              "about.bio.short",
              "I'm a nerd who loves building intelligent solutions that solve real problems. I work with automation and distributed systems, creating applications that are both algorithmically efficient and architecturally sound. My competitive programming background drives me to understand not just how to use technologies, but how they work and when they make sense.",
            )}
          />

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Background */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                {getTranslation(translations, "about.bio.background.title")}
              </h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {getTranslation(
                  translations,
                  "about.bio.background.text",
                  "I've been programming seriously since 2022, when I placed 6th in my first ICPC tournament. A 2024 winter training camp was a turning point that transformed how I approach technical challenges.\n\nI'm learning distributed systems and design patterns through hands-on implementation: building load balancers, message brokers, and experimenting with database architectures.\n\nMy projects range from NASA Space Apps prediction algorithms to production systems with RAG architectures. I don't just use technologies. I dig into how they work and when they actually make sense architecturally.",
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
                {getTranslation(translations, "about.bio.approach.title")}
              </h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {getTranslation(
                  translations,
                  "about.bio.approach.text",
                  "I think about efficiency first. Competitive programming trained me to analyze complexity before coding. But I'm pragmatic about execution: MVPs ship fast, production systems are built to last.\n\nMy process: research what exists, understand the problem deeply, consult when needed, then iterate rapidly. I focus on writing code that's maintainable and scalable without over-engineering early stages.\n\nI work well independently and in teams, and I adapt to what the project needs. Local hackathon wins and real-world deployments both prove the same thing: I deliver solutions that work now and scale later.",
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
