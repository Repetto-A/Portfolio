"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { PressModal } from "@/components/press-modal"
import {
  Trophy,
  Award,
  ExternalLink,
  Users,
  ArrowRight,
  Lightbulb,
  Globe,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { getVisibleAwards, localize } from "@/data/awards"
import type { Award as AwardType } from "@/data/awards"
import { useTranslations } from "@/lib/i18n-context"
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
}: {
  award: AwardType
  locale: string
  onSeeMore: (projectId: string) => void
}) {
  const IconComponent = ICON_MAP[award.icon] ?? Trophy
  const showSeeMore = hasMatchingProject(award.projectId)

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 overflow-hidden relative">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${award.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <CardHeader className="relative space-y-4 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${award.color} border ${award.borderColor}`}
          >
            <IconComponent className="h-6 w-6 text-foreground" />
          </div>
          <Badge variant="outline" className={award.badgeColor}>
            {award.year}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors text-balance">
            {localize(award.title, locale)}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6 flex flex-col">
        <div className="text-muted-foreground leading-relaxed min-h-32 space-y-3">
          {localize(award.description, locale)
            .split("\n")
            .map((part, i) => (
              <p key={i}>{part}</p>
            ))}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {locale === "es" ? "Tecnologias Clave" : "Key Technologies"}
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
          {/* Press CTA -- only if press is enabled and has links */}
          {award.press?.enabled && award.press.links.length > 0 && (
            <div className="pt-4 border-t border-border">
              <PressModal
                awardTitle={award.title}
                links={award.press.links}
                locale={locale}
              />
            </div>
          )}

          {award.proofUrl && (
            <div className="pt-4 border-t border-border">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="group/btn w-full justify-start"
              >
                <Link href={award.proofUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  {locale === "es" ? "Ver Detalles del Premio" : "View Award Details"}
                </Link>
              </Button>
            </div>
          )}

          {/* See Project CTA -- scrolls to project and opens its modal */}
          {showSeeMore && (
            <div className="pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="group/btn w-full justify-start"
                onClick={() => onSeeMore(award.projectId)}
                aria-label={
                  locale === "es"
                    ? `Ver proyecto ${localize(award.title, locale)}`
                    : `See project ${localize(award.title, locale)}`
                }
              >
                <Eye className="mr-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                {locale === "es" ? "Ver Proyecto" : "See Project"}
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function AwardsSection() {
  const [, locale] = useTranslations()
  const visibleAwards = getVisibleAwards()

  const handleSeeMore = (projectId: string) => {
    window.dispatchEvent(new CustomEvent("open-project", { detail: projectId }))
  }

  return (
    <Section id="awards" variant="gradient" spacing="default">
      <Container maxWidth="7xl">
        <SectionHeader
          title={locale === "es" ? "Algunos premios y reconocimientos" : "Some Awards & Recognition"}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {visibleAwards.map((award) => (
            <AwardCard key={award.id} award={award} locale={locale} onSeeMore={handleSeeMore} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
