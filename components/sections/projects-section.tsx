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
import projectsData from "@/content/projects.json"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

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

  // Build project map for event-based lookup
  const projects = projectsData.projects.map((projectData): Project => ({
    ...projectData,
    status: projectData.status in statusConfig ? projectData.status : "in-progress",
    category: (projectData.category in categoryIcons
      ? projectData.category
      : "Web Application") as keyof typeof categoryIcons,
  }))

  // Keep map in sync
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

  // Listen for "open-project" events dispatched by awards section
  useEffect(() => {
    const handler = (e: Event) => {
      const projectId = (e as CustomEvent<string>).detail
      const project = projectsRef.current.get(projectId)
      if (project) {
        // Scroll the card into view, then open modal
        const card = document.getElementById(`project-${projectId}`)
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        // Small delay so the scroll is visible before modal opens
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
          title={getTranslation(translations, "projects.title", "Featured Projects")}
          description={getTranslation(
            translations,
            "projects.description",
            "A collection of engineering projects spanning management systems, automation, and AI/ML applied to solve real-world challenges.",
          )}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const IconComponent = categoryIcons[project.category] || Code
            const statusStyle = statusConfig[project.status as keyof typeof statusConfig] || statusConfig["in-progress"]
            const projectContent = project.locales[locale] || project.locales["en"]

            return (
              <Card
                key={project.id}
                id={`project-${project.id}`}
                data-project-id={project.id}
                className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <Badge variant="outline" className={statusStyle.color}>
                        {statusStyle.label}
                      </Badge>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getTranslation(translations, `projects.categories.${project.category}`, project.category)}
                    </Badge>
                  </div>

                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    <button
                      onClick={() => handleProjectModalOpen(project)}
                      className="hover:underline text-left w-full"
                    >
                      {projectContent.title}
                    </button>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-18">
                    {projectContent.short}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.techStack.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-auto">
                    <div className="flex items-center space-x-2">
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
                    >
                      {getTranslation(translations, "projects.cta.learnMore", "Learn More")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <div className="space-y-4">
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
              {getTranslation(translations, "projects.collaboration.title", "Interested in collaborating?")}
            </h3>
            <p className="text-muted-foreground">
              {getTranslation(
                translations,
                "projects.collaboration.description",
                "I'm always open to discussing new projects and opportunities in systems engineering and AI/ML.",
              )}
            </p>
            <Button asChild size="lg">
              <Link href="#contact">{getTranslation(translations, "projects.cta.getInTouch", "Get In Touch")}</Link>
            </Button>
          </div>
        </div>
      </Container>

      <ProjectDetailModal
        project={selectedProject}
        isOpen={modalOpen}
        onClose={handleModalClose}
      />
    </Section>
  )
}

function getStatusConfig(translations: any) {
  return {
    "in-progress": {
      label: getTranslation(translations, "projects.status.in-progress", "In Progress"),
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    },
    production: {
      label: getTranslation(translations, "projects.status.production", "Production"),
      color: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    prototype: {
      label: getTranslation(translations, "projects.status.prototype", "Prototype"),
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
    "regional-winner-global-nominee": {
      label: getTranslation(
        translations,
        "projects.status.regional-winner-global-nominee",
        "Regional Winner · Global Nominee",
      ),
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
  }
}
