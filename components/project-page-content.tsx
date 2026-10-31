"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import { ProjectImageGallery } from "@/components/project-image-gallery"
import { ProjectTimeline } from "@/components/project-timeline"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTranslations, getTranslation } from "@/lib/i18n-context"
import { SprintCalendlyButton } from "@/components/sprint/sprint-calendly-button"
import { getAwardForProject } from "@/lib/project-utils"
import { localize, type LocalizedString, type PressLink } from "@/data/awards"
import type { ProjectCaseStudy } from "@/types/project"

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
  caseStudy?: ProjectCaseStudy
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

function CaseStudySection({
  headingId,
  title,
  body,
}: {
  headingId: string
  title: string
  body: string
}) {
  if (!body) return null

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <h2 id={headingId} className="sprint-display text-[1.5rem] sm:text-[1.75rem]">
        {title}
      </h2>
      <div className="max-w-[65ch] space-y-3 text-[1.05rem] leading-[1.7] text-muted-foreground">
        {body.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}

function ProjectPressList({
  links,
  heading,
  openLabel,
}: {
  links: PressLink[]
  heading: string
  openLabel: string
}) {
  if (links.length === 0) return null

  return (
    <section aria-labelledby="project-press" className="space-y-4">
      <h2 id="project-press" className="sprint-display text-[1.5rem] sm:text-[1.75rem]">
        {heading}
      </h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-[var(--sprint-accent)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">
                  {link.source}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {link.title.replace(/\u2014/g, ",")}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                {openLabel}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
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
  const caseStudy = project.caseStudy
  const award = getAwardForProject(project.id)
  const pressLinks = award?.press?.enabled && award.press.links.length > 0 ? award.press.links : []
  const problem = caseStudy ? localize(caseStudy.problem as LocalizedString, locale) : ""
  const approach = caseStudy ? localize(caseStudy.approach as LocalizedString, locale) : ""
  const result = caseStudy ? localize(caseStudy.result as LocalizedString, locale) : ""
  const facts = caseStudy?.facts ?? []
  const galleryLabel = getTranslation(translations, "projects.image") || "Screenshot"

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen bg-background pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="ghost" asChild className="h-auto min-h-[44px]">
              <Link href="/#projects">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
                {getTranslation(translations, "projects.cta.backToProjects")}
              </Link>
            </Button>
          </div>

          <header className="mb-12 space-y-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span aria-hidden className="h-px w-8 bg-[var(--sprint-accent)]" />
                  <span className="sprint-kicker text-[var(--sprint-accent)]">
                    {getTranslation(translations, "projects.caseStudy.kicker")}
                  </span>
                  <span className="text-muted-foreground" aria-hidden>
                    ·
                  </span>
                  <span className="sprint-kicker text-muted-foreground">{categoryLabel}</span>
                </div>
                <h1 className="sprint-display text-[2rem] sm:text-[2.5rem]">
                  {projectContent.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={statusStyle.color}>
                    {statusStyle.label}
                  </Badge>
                  {award ? (
                    <Badge variant="outline" className="border-border text-foreground">
                      {award.year}
                    </Badge>
                  ) : null}
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

            {projectContent.short ? (
              <p className="max-w-3xl text-lg leading-[1.7] text-pretty text-muted-foreground">
                {projectContent.short}
              </p>
            ) : null}

            {facts.length > 0 ? (
              <dl className="grid gap-5 border-t border-border pt-6 sm:grid-cols-3">
                {facts.map((fact) => (
                  <div key={`${fact.value}-${fact.label.en}`}>
                    <dt className="sprint-kicker text-[var(--sprint-accent)]">
                      {localize(fact.label as LocalizedString, locale)}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-foreground">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </header>

          <div className="space-y-10">
            <CaseStudySection
              headingId="project-problem"
              title={getTranslation(translations, "projects.caseStudy.problem")}
              body={problem}
            />
            <CaseStudySection
              headingId="project-approach"
              title={getTranslation(translations, "projects.caseStudy.approach")}
              body={approach}
            />
            <CaseStudySection
              headingId="project-result"
              title={getTranslation(translations, "projects.caseStudy.result")}
              body={result}
            />
            {!caseStudy && projectContent.description ? (
              <div className="max-w-3xl space-y-3 text-lg leading-[1.7] text-pretty text-muted-foreground">
                {projectContent.description
                  .split("\n")
                  .map((paragraph, index) => (paragraph ? <p key={index}>{paragraph}</p> : null))}
              </div>
            ) : null}
          </div>

          <ProjectImageGallery
            images={project.images || []}
            projectTitle={projectContent.title ?? ""}
            captionLabel={galleryLabel}
            className="mb-12 mt-12"
          />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              {(projectContent.features || []).length > 0 ? (
                <section aria-labelledby="project-features">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <h2 id="project-features" className="text-base font-semibold">
                          {getTranslation(translations, "projects.caseStudy.features")}
                        </h2>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {(projectContent.features || []).map((feature) => (
                          <li key={feature} className="flex items-start space-x-3">
                            <span
                              className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"
                              aria-hidden
                            />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </section>
              ) : null}

              {award ? (
                <section aria-labelledby="project-recognition">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <h2 id="project-recognition" className="text-base font-semibold">
                          {getTranslation(translations, "projects.caseStudy.recognition")}
                        </h2>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                      <p className="font-medium text-foreground">
                        {award.event}
                        {award.year ? ` (${award.year})` : ""}
                      </p>
                      <p>{localize(award.shortSummary, locale)}</p>
                    </CardContent>
                  </Card>
                </section>
              ) : null}

              {Array.isArray(project.timeline) && project.timeline.length > 0 ? (
                <ProjectTimeline timeline={project.timeline} />
              ) : null}

              <ProjectPressList
                links={pressLinks}
                heading={getTranslation(translations, "projects.caseStudy.press")}
                openLabel={getTranslation(translations, "projects.caseStudy.pressOpen")}
              />
            </div>

            <aside className="space-y-6">
              {project.techStack.length > 0 ? (
                <section aria-labelledby="project-stack">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <h2 id="project-stack" className="text-base font-semibold">
                          {getTranslation(translations, "projects.details.techStack")}
                        </h2>
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
                </section>
              ) : null}

              {project.githubUrl || project.demoUrl ? (
                <section aria-labelledby="project-links">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <h2 id="project-links" className="text-base font-semibold">
                          {getTranslation(translations, "projects.details.links")}
                        </h2>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {project.githubUrl ? (
                        <Button
                          asChild
                          variant="outline"
                          className="h-auto min-h-[44px] w-full justify-start bg-transparent"
                        >
                          <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" aria-hidden />
                            {getTranslation(translations, "projects.details.viewSourceCode")}
                          </Link>
                        </Button>
                      ) : null}

                      {project.demoUrl ? (
                        <Button
                          asChild
                          variant="outline"
                          className="h-auto min-h-[44px] w-full justify-start bg-transparent"
                        >
                          <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
                            {getTranslation(translations, "projects.cta.liveDemo")}
                          </Link>
                        </Button>
                      ) : null}
                    </CardContent>
                  </Card>
                </section>
              ) : null}
            </aside>
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
                  <Link href="/sprint" prefetch={false}>
                    {getTranslation(translations, "hero.cta.sprint")}
                  </Link>
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
