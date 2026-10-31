"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { PressModal } from "@/components/press-modal"
import { Trophy, Award, ExternalLink, Users, ArrowRight, Lightbulb, Globe, Eye } from "lucide-react"
import Link from "next/link"
import { getVisibleAwards, localize } from "@/data/awards"
import type { Award as AwardType } from "@/data/awards"
import { useTranslations, getTranslation } from "@/lib/i18n-context"
import { hasMatchingProject } from "@/lib/project-utils"

const ICON_MAP = {
  award: Award,
  trophy: Trophy,
  lightbulb: Lightbulb,
  globe: Globe,
} as const

function AwardCard({
  award,
  locale,
  onSeeMore,
  index,
  translations,
}: {
  award: AwardType
  locale: string
  onSeeMore: (projectId: string) => void
  index: number
  translations: ReturnType<typeof useTranslations>[0]
}) {
  const IconComponent = ICON_MAP[award.icon] ?? Trophy
  const showSeeMore = hasMatchingProject(award.projectId)

  return (
    <Card
      className={`group relative h-full overflow-hidden border-border transition-colors hover:border-[var(--sprint-accent)]/50 scroll-reveal-stagger-${(index % 3) + 1}`}
    >
      <CardHeader className="relative space-y-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-border p-2.5">
            <IconComponent className="h-5 w-5 text-[var(--sprint-accent)]" />
          </div>
          <span className="sprint-kicker text-muted-foreground">{award.year}</span>
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-balance text-foreground">
          {localize(award.title, locale)}
        </h3>
      </CardHeader>

      <CardContent className="relative flex flex-col space-y-6">
        <div className="min-h-32 space-y-3 text-sm leading-relaxed text-muted-foreground">
          {localize(award.description, locale)
            .split("\n")
            .map((part, i) => (
              <p key={i}>{part}</p>
            ))}
        </div>

        <div>
          <h4 className="mb-3 flex items-center text-sm font-semibold text-foreground">
            <Users className="mr-2 h-4 w-4" />
            {getTranslation(translations, "awards.keyTechnologies")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {award.tags.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-0">
          {award.press?.enabled && award.press.links.length > 0 ? (
            <div className="border-t border-border pt-4">
              <PressModal awardTitle={award.title} links={award.press.links} locale={locale} />
            </div>
          ) : null}

          {award.proofUrl ? (
            <div className="border-t border-border pt-4">
              <Button asChild variant="ghost" size="sm" className="group/btn w-full justify-start">
                <Link href={award.proofUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  {getTranslation(translations, "awards.viewAwardDetails")}
                </Link>
              </Button>
            </div>
          ) : null}

          {showSeeMore ? (
            <div className="border-t border-border pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="group/btn w-full justify-start"
                onClick={() => onSeeMore(award.projectId)}
                aria-label={`${getTranslation(translations, "awards.seeProject")} ${localize(award.title, locale)}`}
              >
                <Eye className="mr-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                {getTranslation(translations, "awards.seeProject")}
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover/btn:opacity-100" />
              </Button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export function AwardsSection() {
  const [translations, locale] = useTranslations()
  const visibleAwards = getVisibleAwards()

  const handleSeeMore = (projectId: string) => {
    window.dispatchEvent(new CustomEvent("open-project", { detail: projectId }))
  }

  return (
    <Section id="awards" variant="gradient" spacing="relaxed">
      <Container maxWidth="7xl">
        <SectionHeader
          title={getTranslation(translations, "awards.title")}
          eyebrow={getTranslation(translations, "awards.eyebrow")}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {visibleAwards.map((award, index) => (
            <AwardCard
              key={award.id}
              award={award}
              locale={locale}
              onSeeMore={handleSeeMore}
              index={index}
              translations={translations}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}
