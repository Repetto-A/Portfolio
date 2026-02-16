"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { ExternalLink, Github, Eye, Calendar, Code, Zap } from "lucide-react"
import Link from "next/link"
import projectsData from "@/content/projects.json"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

const categoryIcons = {
  "Web Application": Code,
  "Business Automation": Zap,
  "Management System": Calendar,
  "AI/ML Research": Eye,
  "Blockchain/DeFi": ExternalLink,
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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0)
  const [lightboxProjectTitle, setLightboxProjectTitle] = useState("")

  const statusConfig = getStatusConfig(translations)

  const openLightbox = (images: string[], initialIndex: number, projectTitle: string) => {
    setLightboxImages(images)
    setLightboxInitialIndex(initialIndex)
    setLightboxProjectTitle(projectTitle)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const handleProjectModalOpen = (project: Project) => {
    setSelectedProject(project)
  }

  const handleLinkClick = (type: "github" | "demo", projectId: string) => {
    console.log(`Project ${type} Click`, { projectId })
  }

  return (
    <Section id="projects" variant="default" spacing="default">
      <Container maxWidth="7xl">
        <SectionHeader
          title={getTranslation(translations, "projects.title", "Featured Projects")}
          description={getTranslation(
            translations,
            "projects.description",
            "A collection of systems engineering projects spanning automation, AI/ML, and management solutions built to solve real-world challenges.",
          )}
        >
          {/* Internal linking to awards and skills */}
          
        </SectionHeader>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.projects.map((projectData) => {
            const project: Project = {
              ...projectData,
              status: projectData.status in statusConfig ? projectData.status : "in-progress",
              category: (projectData.category in categoryIcons
                ? projectData.category
                : "Web Application") as keyof typeof categoryIcons,
            }

            const IconComponent = categoryIcons[project.category] || Code
            const statusStyle = statusConfig[project.status as keyof typeof statusConfig] || statusConfig["in-progress"]
            const projectContent = project.locales[locale] || project.locales["en"]

            return (
              <Card key={project.id} data-project-id={project.id} className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
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
                    <Link href={`/projects/${project.id}`} className="hover:underline">
                      {projectContent.title}
                    </Link>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{projectContent.short}</p>

                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.techStack.length - 3} more
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
                          onClick={() => handleLinkClick("github", project.id)}
                        >
                          <Github className="h-4 w-4" />
                          <span className="sr-only">View on GitHub</span>
                        </Link>
                      )}

                      {project.demoUrl && (
                        <Link
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => handleLinkClick("demo", project.id)}
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View live demo</span>
                        </Link>
                      )}
                    </div>

                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/projects/${project.id}`}>
                        {getTranslation(translations, "projects.cta.learnMore", "Learn More")}
                      </Link>
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

      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxInitialIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        projectTitle={lightboxProjectTitle}
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
    "winner-local / in-evaluation-global": {
      label: getTranslation(
        translations,
        "projects.status.winner-local / in-evaluation-global",
        "Winner - Under Global Evaluation",
      ),
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
  }
}
