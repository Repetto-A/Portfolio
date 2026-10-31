"use client"

import { useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { ProjectCard, type ProjectCardData } from "@/components/project-card"
import Link from "next/link"
import projectsData from "@/content/projects.json"
import { useTranslations, getTranslation } from "@/lib/i18n-context"
import { SprintCalendlyButton } from "@/components/sprint/sprint-calendly-button"

function toCardData(projectData: (typeof projectsData.projects)[number]): ProjectCardData {
  return {
    id: projectData.id,
    locales: projectData.locales,
    githubUrl: projectData.githubUrl ?? null,
    demoUrl: projectData.demoUrl ?? null,
    images: projectData.images ?? [],
    status: projectData.status,
    techStack: projectData.techStack ?? [],
    category: projectData.category,
  }
}

export function ProjectsEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div
      role="status"
      className="rounded-xl border border-dashed border-border px-5 py-14 text-center sm:px-8 sm:py-16"
    >
      <p className="sprint-display text-xl text-pretty text-foreground">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  )
}

export function ProjectsSection({
  projects: projectsProp,
}: {
  projects?: ProjectCardData[]
} = {}) {
  const [translations, locale] = useTranslations()
  const router = useRouter()
  const projects = useMemo(
    () => (projectsProp ? projectsProp : projectsData.projects.map(toCardData)),
    [projectsProp]
  )
  const projectsRef = useRef<Set<string>>(new Set())

  projectsRef.current = new Set(projects.map((project) => project.id))

  useEffect(() => {
    const handler = (event: Event) => {
      const projectId = (event as CustomEvent<string>).detail
      if (projectsRef.current.has(projectId)) {
        router.push(`/projects/${projectId}`)
      }
    }
    window.addEventListener("open-project", handler)
    return () => window.removeEventListener("open-project", handler)
  }, [router])

  return (
    <Section id="projects" variant="default" spacing="default">
      <Container maxWidth="7xl">
        <SectionHeader
          title={getTranslation(translations, "projects.title")}
          description={getTranslation(translations, "projects.description")}
          eyebrow={getTranslation(translations, "projects.eyebrow")}
        />

        {projects.length === 0 ? (
          <ProjectsEmptyState
            title={getTranslation(translations, "projects.empty.title")}
            description={getTranslation(translations, "projects.empty.description")}
          />
        ) : (
          <ul
            role="list"
            aria-label={getTranslation(translations, "projects.gridLabel")}
            className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
          >
            {projects.map((project, index) => (
              <li key={project.id} className="flex h-full min-w-0">
                <ProjectCard
                  project={project}
                  locale={locale}
                  translations={translations}
                  index={index}
                />
              </li>
            ))}
          </ul>
        )}

        <div id="projects-cta" className="mt-20 scroll-mt-20 border-t border-border pt-12">
          <div className="flex max-w-xl flex-col items-start gap-5">
            <h3 className="sprint-display text-[1.5rem] sm:text-[1.875rem]">
              {getTranslation(translations, "projects.collaboration.title")}
            </h3>
            <p className="text-muted-foreground">
              {getTranslation(translations, "projects.collaboration.description")}
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <SprintCalendlyButton location="home-projects" className="w-full sm:w-auto">
                {getTranslation(translations, "hero.cta.talk")}
              </SprintCalendlyButton>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-auto min-h-[44px] w-full sm:w-auto"
              >
                <Link href="/sprint" prefetch={false}>
                  {getTranslation(translations, "hero.cta.sprint")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
