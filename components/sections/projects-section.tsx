"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectDetailModal } from "@/components/project-detail-modal"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { ExternalLink, Github, Code, Zap, Calendar, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import projectsData from "@/content/projects.json"
import { useTranslations, getTranslation, type Translations } from "@/lib/i18n-context"

const categoryIcons = {
  "Web Application": Code,
  "Business Automation": Zap,
  "Management System": Calendar,
  "AI/ML Research": Eye,
  "Blockchain/DeFi": ExternalLink,
  "Blockchain/AI": ExternalLink,
  "Healthcare System": Calendar,
  "Game / AgTech": Eye,
}

interface Project {
  id: string
  locales: {
    [key: string]: {
      title: string
      short: string
      description: string
      features: string[]
    }
  }
  status: string
  techStack: string[]
  githubUrl: string
  demoUrl: string | null
  images: string[]
  category: keyof typeof categoryIcons
}

export function ProjectsSection() {
  const [translations, locale] = useTranslations()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const projectsRef = useRef<Map<string, Project>>(new Map())

  const statusConfig = getStatusConfig(translations)

  const projects = projectsData.projects.map(
    (projectData): Project => ({
      ...projectData,
      status: projectData.status in statusConfig ? projectData.status : "in-progress",
      category: (projectData.category in categoryIcons
        ? projectData.category
        : "Web Application") as keyof typeof categoryIcons,
    })
  )

  projectsRef.current.clear()
  for (const p of projects) projectsRef.current.set(p.id, p)

  const handleProjectModalOpen = useCallback((project: Project) => {
    setSelectedProject(project)
    setModalOpen(true)
  }, [])

  const handleModalClose = useCallback(() => {
    setModalOpen(false)
    setSelectedProject(null)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const projectId = (e as CustomEvent<string>).detail
      const project = projectsRef.current.get(projectId)
      if (project) {
        const card = document.getElementById(`project-${projectId}`)
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        setTimeout(() => {
          setSelectedProject(project)
          setModalOpen(true)
        }, 400)
      }
    }
    window.addEventListener("open-project", handler)
    return () => window.removeEventListener("open-project", handler)
  }, [])

  return (
    <Section id="projects" variant="default" spacing="default">
      <Container maxWidth="7xl">
        <SectionHeader
          title={getTranslation(translations, "projects.title")}
          description={getTranslation(translations, "projects.description")}
          eyebrow="Selected Work"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const IconComponent = categoryIcons[project.category] || Code
            const statusStyle =
              statusConfig[project.status as keyof typeof statusConfig] ||
              statusConfig["in-progress"]
            const projectContent = project.locales[locale] || project.locales["en"]

            return (
              <Card
                key={project.id}
                id={`project-${project.id}`}
                data-project-id={project.id}
                className={`group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col overflow-hidden border-border hover:border-primary/30 scroll-reveal-stagger-${(index % 3) + 1}`}
              >
                {/* Project thumbnail — -mt-6 to break out of Card's py-6 top padding */}
                {project.images?.[0] && (
                  <div className="relative aspect-video overflow-hidden flex-shrink-0 bg-muted -mt-6">
                    <Image
                      src={project.images[0]}
                      alt={projectContent.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-primary flex-shrink-0" />
                      <Badge variant="outline" className={statusStyle.color}>
                        {statusStyle.label}
                      </Badge>
                    </div>
                    <Badge variant="secondary" className="text-xs whitespace-nowrap">
                      {getTranslation(translations, `projects.categories.${project.category}`) ||
                        project.category}
                    </Badge>
                  </div>

                  <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
                    <button
                      onClick={() => handleProjectModalOpen(project)}
                      className="hover:underline text-left w-full underline-offset-4"
                    >
                      {projectContent.title}
                    </button>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col space-y-4 pt-0">
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {projectContent.short}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 3 && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        +{project.techStack.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-auto border-t border-border/60">
                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <Link
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="h-4 w-4" />
                          <span className="sr-only">GitHub</span>
                        </Link>
                      )}
                      {project.demoUrl && (
                        <Link
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Demo</span>
                        </Link>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleProjectModalOpen(project)}
                      className="text-xs h-7 px-2.5 text-muted-foreground hover:text-primary"
                    >
                      {getTranslation(translations, "projects.cta.learnMore")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Collaboration CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex flex-col items-center space-y-5">
            <div className="h-px w-16 bg-border" />
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
              {getTranslation(translations, "projects.collaboration.title")}
            </h3>
            <p className="text-muted-foreground max-w-md">
              {getTranslation(translations, "projects.collaboration.description")}
            </p>
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <Link href="#contact">{getTranslation(translations, "projects.cta.getInTouch")}</Link>
            </Button>
          </div>
        </div>
      </Container>

      <ProjectDetailModal project={selectedProject} isOpen={modalOpen} onClose={handleModalClose} />
    </Section>
  )
}

function getStatusConfig(translations: Translations) {
  return {
    "in-progress": {
      label: getTranslation(translations, "projects.status.in-progress"),
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    production: {
      label: getTranslation(translations, "projects.status.production"),
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    prototype: {
      label: getTranslation(translations, "projects.status.prototype"),
      color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    },
    "regional-winner-global-nominee": {
      label: getTranslation(translations, "projects.status.regional-winner-global-nominee"),
      color: "bg-primary/10 text-primary border-primary/20",
    },
  }
}
