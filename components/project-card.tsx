"use client"

import { memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getTranslation, type Translations } from "@/lib/i18n-context"
import {
  ArrowRight,
  Calendar,
  Code,
  ExternalLink,
  Github,
  ScanLine,
  Shield,
  Zap,
  Eye,
} from "lucide-react"

const categoryIcons = {
  "Web Application": Code,
  "Business Automation": Zap,
  "Management System": Calendar,
  "AI/ML Research": Eye,
  "Blockchain/DeFi": ExternalLink,
  "Blockchain/AI": ExternalLink,
  "Healthcare System": Calendar,
  "Game / AgTech": Eye,
  "AI / Security Infrastructure": Shield,
  "AI / Industrial Vision": ScanLine,
  "AI / Social Impact": Eye,
} as const

const iconLinkClass = cn(
  "relative z-10 inline-flex size-11 items-center justify-center rounded-md",
  "text-muted-foreground transition-colors duration-200",
  "hover:bg-muted/70 hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background"
)

export type ProjectCardData = {
  id: string
  locales: Record<string, { title: string; short: string }>
  status: string
  techStack: string[]
  githubUrl: string | null
  demoUrl: string | null
  images: string[]
  category: string
}

type ProjectCardProps = {
  project: ProjectCardData
  locale: string
  translations: Translations
  index: number
}

function getStatusConfig(translations: Translations) {
  return {
    "in-progress": {
      label: getTranslation(translations, "projects.status.in-progress"),
      color: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20",
    },
    production: {
      label: getTranslation(translations, "projects.status.production"),
      color: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20",
    },
    prototype: {
      label: getTranslation(translations, "projects.status.prototype"),
      color: "bg-violet-500/10 text-violet-800 dark:text-violet-300 border-violet-500/20",
    },
    "regional-winner-global-nominee": {
      label: getTranslation(translations, "projects.status.regional-winner-global-nominee"),
      color: "bg-primary/10 text-primary border-primary/20",
    },
  }
}

export const ProjectCard = memo(function ProjectCard({
  project,
  locale,
  translations,
  index,
}: ProjectCardProps) {
  const IconComponent = categoryIcons[project.category as keyof typeof categoryIcons] || Code
  const statusConfig = getStatusConfig(translations)
  const statusStyle =
    statusConfig[project.status as keyof typeof statusConfig] || statusConfig["in-progress"]
  const projectContent = project.locales[locale] || project.locales.en || project.locales.es
  const title = projectContent?.title || project.id
  const short = projectContent?.short || ""
  const categoryLabel =
    getTranslation(translations, `projects.categories.${project.category}`) || project.category
  const thumbnail = project.images[0]
  const openLabel = `${getTranslation(translations, "projects.openProject")} ${title}`

  return (
    <article
      id={`project-${project.id}`}
      data-project-id={project.id}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        "transition-[border-color,box-shadow,transform] duration-300",
        "hover:border-[var(--sprint-accent)]/50 hover:shadow-md",
        "motion-safe:hover:-translate-y-0.5",
        "has-[[data-project-link]:focus-visible]:border-[var(--sprint-accent)]/70",
        "has-[[data-project-link]:focus-visible]:ring-2",
        "has-[[data-project-link]:focus-visible]:ring-ring",
        "has-[[data-project-link]:focus-visible]:ring-offset-2",
        "has-[[data-project-link]:focus-visible]:ring-offset-background",
        `scroll-reveal-stagger-${(index % 3) + 1}`
      )}
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-muted sm:aspect-video">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <IconComponent className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 py-5 sm:px-6">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex min-w-0 items-center gap-2">
            <IconComponent className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <Badge variant="outline" className={statusStyle.color}>
              {statusStyle.label}
            </Badge>
          </span>
          <Badge
            variant="secondary"
            className="max-w-full text-xs whitespace-normal sm:ml-auto sm:max-w-[55%] sm:truncate sm:whitespace-nowrap"
          >
            {categoryLabel}
          </Badge>
        </div>

        <h3 className="min-w-0 text-lg leading-snug font-semibold tracking-tight text-pretty">
          <Link
            href={`/projects/${project.id}`}
            data-project-link
            aria-label={openLabel}
            className={cn(
              "text-foreground underline-offset-4",
              "after:absolute after:inset-0 after:z-0 after:content-['']",
              "group-hover:underline group-hover:decoration-[var(--sprint-accent)]/70",
              "focus-visible:outline-none"
            )}
          >
            {title}
          </Link>
        </h3>

        {short ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-pretty text-muted-foreground">
            {short}
          </p>
        ) : null}

        {project.techStack.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 3 ? (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{project.techStack.length - 3}
              </Badge>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto flex min-h-11 items-center justify-between gap-2 border-t border-border/60 pt-2">
          <div className="flex items-center">
            {project.githubUrl ? (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={iconLinkClass}
                aria-label={`${getTranslation(translations, "projects.viewCodeAria")} ${title}`}
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
            {project.demoUrl ? (
              <Link
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={iconLinkClass}
                aria-label={`${getTranslation(translations, "projects.liveDemoAria")} ${title}`}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>

          <span className="relative z-10 pointer-events-none inline-flex min-h-11 items-center gap-1 px-1 text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
            {getTranslation(translations, "projects.cta.learnMore")}
            <ArrowRight
              className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 sm:opacity-0 sm:group-hover:opacity-100"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </article>
  )
})
