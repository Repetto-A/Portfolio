"use client"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

const URL_PATTERN = /(https?:\/\/[^\s)]+)/g

function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(URL_PATTERN)

  return (
    <>
      {parts.map((part, index) => {
        if (!part.startsWith("http://") && !part.startsWith("https://")) {
          return <span key={index}>{part}</span>
        }

        let hostname = part
        try {
          hostname = new URL(part).hostname.replace(/^www\./, "")
        } catch {
          hostname = part.replace(/^https?:\/\/(www\.)?/, "")
        }

        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 decoration-primary/40 hover:text-foreground transition-colors break-words"
          >
            {hostname}
          </a>
        )
      })}
    </>
  )
}

export function AboutSection() {
  const [translations] = useTranslations()

  return (
    <Section id="about" variant="default" spacing="compact">
      <Container maxWidth="4xl">
        <div className="space-y-14">
          <SectionHeader
            title={getTranslation(translations, "about.title")}
            description={getTranslation(translations, "about.bio.short")}
          />

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Background */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-primary rounded-full" />
                <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">
                  {getTranslation(translations, "about.bio.background.title")}
                </h3>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed pl-8">
                {getTranslation(translations, "about.bio.background.text")
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p key={index}>
                      <LinkifiedText text={paragraph} />
                    </p>
                  ))}
              </div>
            </div>

            {/* Approach */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-primary rounded-full" />
                <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">
                  {getTranslation(translations, "about.bio.approach.title")}
                </h3>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed pl-8">
                {getTranslation(translations, "about.bio.approach.text")
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p key={index}>
                      <LinkifiedText text={paragraph} />
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
