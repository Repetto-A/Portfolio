"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { PressModal } from "@/components/press-modal"
import { ProjectDetailModal } from "@/components/project-detail-modal"
import {
  Trophy,
  Award,
  ExternalLink,
  Calendar,
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
import { hasMatchingProject, getProjectById } from "@/lib/project-utils"
import type { Project } from "@/types/project"

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
  onSeeMore: (projectId: string, triggerEl: HTMLButtonElement) => void
}) {
  const IconComponent = ICON_MAP[award.icon] ?? Trophy
  const showSeeMore = hasMatchingProject(award.projectId)

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 overflow-hidden relative">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${award.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <CardHeader className="relative space-y-4 pb-4">
        <div className="flex items-start justify-between">
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
          <Badge variant="secondary" className="text-xs">
            {award.category}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors text-balance">
            {localize(award.title, locale)}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">{award.event}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          {localize(award.description, locale)}
        </p>

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

        {/* See Project CTA -- only if award maps to an existing project */}
        {showSeeMore && (
          <div className="pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="group/btn w-full justify-start"
              onClick={(e) => onSeeMore(award.projectId, e.currentTarget)}
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
      </CardContent>
    </Card>
  )
}

export function AwardsSection() {
  const [, locale] = useTranslations()
  const visibleAwards = getVisibleAwards()
  const [modalProject, setModalProject] = useState<Project | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cleanupObserver = useCallback(() => {
    observerRef.current?.disconnect()
    observerRef.current = null
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = null
    }
  }, [])

  const handleSeeMore = useCallback(
    (projectId: string, triggerEl: HTMLButtonElement) => {
      cleanupObserver()
      triggerRef.current = triggerEl

      const projectCard = document.querySelector(`[data-project-id="${projectId}"]`)
      if (!projectCard) return

      projectCard.scrollIntoView({ behavior: "smooth", block: "center" })

      const openModal = () => {
        cleanupObserver()
        const project = getProjectById(projectId)
        if (project) {
          setModalProject(project)
          setModalOpen(true)
        }
      }

      // Wait for the project card to become visible, then open the modal
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            // Brief delay so the user sees the card before the modal opens
            setTimeout(openModal, 400)
          }
        },
        { threshold: 0.5 },
      )
      observerRef.current.observe(projectCard)

      // Fallback: open modal after 2s even if observer didn't fire
      fallbackTimerRef.current = setTimeout(openModal, 2000)
    },
    [cleanupObserver],
  )

  const handleModalClose = useCallback(() => {
    setModalOpen(false)
    setModalProject(null)
    // Return focus to the trigger button
    triggerRef.current?.focus()
  }, [])

  return (
    <Section id="awards" variant="gradient" spacing="default">
      <Container maxWidth="7xl">
        <SectionHeader
          title={locale === "es" ? "Premios y Reconocimientos" : "Awards & Recognition"}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <span>{locale === "es" ? "Descubre como estos llevaron a" : "See how these led to"}</span>
            <Link
              href="#projects"
              className="text-primary hover:underline inline-flex items-center"
            >
              {locale === "es" ? "proyectos destacados" : "featured projects"}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </SectionHeader>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {visibleAwards.map((award) => (
            <AwardCard key={award.id} award={award} locale={locale} onSeeMore={handleSeeMore} />
          ))}
        </div>

      </Container>

      <ProjectDetailModal
        project={modalProject}
        isOpen={modalOpen}
        onClose={handleModalClose}
      />
    </Section>
  )
}
