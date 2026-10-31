"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import { ProjectImageGallery } from "@/components/project-image-gallery"
import { ProjectTimeline } from "@/components/project-timeline"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTranslations, getTranslation } from "@/lib/i18n-context"
import { SprintCalendlyButton } from "@/components/sprint/sprint-calendly-button"

type TimelineEvent = {
  date: string
  title: string | { en: string; es: string }
  description: string | { en: string; es: string }
}

type ProjectContent = {
  title?: string
  short?: string
  description?: string
  features?: string[]
}

export type ProjectPageData = {
  id: string
  status: string
  techStack: string[]
  githubUrl: string | null
  demoUrl: string | null
  images: string[]
  category: string
  locales: { en?: ProjectContent; es?: ProjectContent }
  timeline?: TimelineEvent[]
}

function getStatusConfig(translations: ReturnType<typeof useTranslations>[0]) {
  return {
    "in-progress": {
      label: getTranslation(translations, "projects.status.in-progress"),
      color: "bg-yellow-500/10 text-yellow-800 dark:text-yellow-300 border-yellow-500/20",
    },
    production: {
      label: getTranslation(translations, "projects.status.production"),
      color: "bg-green-500/10 text-green-800 dark:text-green-300 border-green-500/20",
    },
    prototype: {
      label: getTranslation(translations, "projects.status.prototype"),
      color: "bg-purple-500/10 text-purple-800 dark:text-purple-300 border-purple-500/20",
    },
    "winner-local / in-evaluation-global": {
      label: getTranslation(translations, "projects.status.winner-local / in-evaluation-global"),
      color: "bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20",
    },
    "regional-winner-global-nominee": {
      label: getTranslation(translations, "projects.status.regional-winner-global-nominee"),
      color: "bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20",
    },
  }
}

export function ProjectPageContent({ project }: { project: ProjectPageData }) {
  const [translations, locale] = useTranslations()
  const statusConfig = getStatusConfig(translations)
  const normalizedStatus = project.status in statusConfig ? project.status : "in-progress"
  const projectContent =
    (locale === "es" ? project.locales.es : project.locales.en) ||
    project.locales.en ||
    project.locales.es ||
    {}
  const statusStyle =
    statusConfig[normalizedStatus as keyof typeof statusConfig] || statusConfig["in-progress"]
  const categoryLabel =
    getTranslation(translations, `projects.categories.${project.category}`) || project.category

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen bg-background pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/#projects">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
                {getTranslation(translations, "projects.cta.backToProjects")}
              </Link>
            </Button>
          </div>

          <div className="mb-12 space-y-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="h-px w-8 bg-[var(--sprint-accent)]" />
                  <span className="sprint-kicker text-[var(--sprint-accent)]">{categoryLabel}</span>
                </div>
                <h1 className="sprint-display text-[2rem] sm:text-[2.5rem]">
                  {projectContent.title}
                </h1>

                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className={statusStyle.color}>
                    {statusStyle.label}
                  </Badge>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                {project.githubUrl ? (
                  <Button
                    asChild
                    variant="default"
                    className="h-auto min-h-[44px] w-full sm:w-auto"
                  >
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" aria-hidden />
                      {getTranslation(translations, "projects.cta.viewCode")}
                    </Link>
                  </Button>
                ) : null}

                {project.demoUrl ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto min-h-[44px] w-full sm:w-auto"
                  >
                    <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
                      {getTranslation(translations, "projects.cta.liveDemo")}
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <p className="max-w-3xl text-lg leading-[1.7] text-pretty text-muted-foreground">
              {projectContent.description}
            </p>
          </div>

          <ProjectImageGallery
            images={project.images || []}
            projectTitle={projectContent.title ?? ""}
            className="mb-12"
          />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>{getTranslation(translations, "projects.details.features")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(projectContent.features || []).map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {Array.isArray(project.timeline) && project.timeline.length > 0 && (
                <ProjectTimeline timeline={project.timeline} />
              )}
            </div>

            <div className="space-y-6">
              {project.techStack.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {getTranslation(translations, "projects.details.techStack")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {project.githubUrl || project.demoUrl ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{getTranslation(translations, "projects.details.links")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {project.githubUrl && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                      >
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" aria-hidden />
                          {getTranslation(translations, "projects.details.viewSourceCode")}
                        </Link>
                      </Button>
                    )}

                    {project.demoUrl && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                      >
                        <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
                          {getTranslation(translations, "projects.cta.liveDemo")}
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>

          <div id="project-sprint" className="mt-20 scroll-mt-20 border-t border-border pt-12">
            <div className="flex max-w-xl flex-col items-start gap-5">
              <h2 className="sprint-display text-[1.5rem] sm:text-[1.875rem]">
                {getTranslation(translations, "projects.collaboration.title")}
              </h2>
              <p className="text-muted-foreground">
                {getTranslation(translations, "projects.collaboration.description")}
              </p>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                <SprintCalendlyButton location="project" className="w-full sm:w-auto">
                  {getTranslation(translations, "hero.cta.talk")}
                </SprintCalendlyButton>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-auto min-h-[44px] w-full sm:w-auto"
                >
                  <Link href="/sprint">{getTranslation(translations, "hero.cta.sprint")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
