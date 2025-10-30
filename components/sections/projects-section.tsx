"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import { ExternalLink, Github, Eye, Calendar, Code, Zap, ZoomIn, Clock, Star } from "lucide-react"
import Link from "next/link"
import projectsData from "@/content/projects.json"
import { cn } from "@/lib/utils"
import { useTranslations, getTranslation } from "@/lib/i18n-context"
import { ProjectTimeline } from "@/components/project-timeline"

const getStatusConfig = (translations: any) => ({
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
    label: getTranslation(translations, "projects.status.winner-local / in-evaluation-global", "Winner - Under Global Evaluation"),
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
})

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
  const [translations, locale, loading] = useTranslations()
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
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {getTranslation(translations, "projects.title", "Featured Projects")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {getTranslation(
              translations,
              "projects.description",
              "A collection of systems engineering projects spanning automation, AI/ML, and management solutions built to solve real-world challenges.",
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.projects.map((projectData) => {
            const project: Project = {
              ...projectData,
              status: projectData.status in statusConfig
                ? projectData.status
                : "in-progress",
              category: (projectData.category in categoryIcons
                ? projectData.category
                : "Web Application") as keyof typeof categoryIcons,
            }

            const IconComponent = categoryIcons[project.category] || Code
            const statusStyle = statusConfig[project.status as keyof typeof statusConfig] || statusConfig["in-progress"]

            const projectContent = project.locales[locale] || project.locales["en"]

            return (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
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
                    {projectContent.title}
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

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleProjectModalOpen(project)}
                          aria-label={`Learn more about ${projectContent.title}`}
                        >
                          {getTranslation(translations, "projects.cta.learnMore", "Learn More")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <span>{projectContent.title}</span>
                            <Badge variant="outline" className={statusStyle.color}>
                              {statusStyle.label}
                            </Badge>
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            {project.images &&
                              project.images.map((image, index) => {
                                const fullPath = image.startsWith("/") ? image : `/${image}`
                                return (
                                  <div
                                    key={index}
                                    className="group relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer"
                                    onClick={() => openLightbox(project.images, index, projectContent.title)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`View ${projectContent.title} screenshot ${index + 1} in lightbox`}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        openLightbox(project.images, index, projectContent.title)
                                      }
                                    }}
                                  >
                                    <Image
                                      src={fullPath || "/placeholder.svg"}
                                      alt={`${projectContent.title} screenshot ${index + 1}`}
                                      fill
                                      className={cn(
                                        "object-cover transition-all duration-300",
                                        "group-hover:scale-105",
                                      )}
                                      onError={(e) => {
                                        console.error(`Error loading image: ${fullPath}`)
                                        const target = e.target as HTMLImageElement
                                        target.src = `/placeholder.png?height=300&width=500&text=${encodeURIComponent(projectContent.title)}`
                                        target.onerror = null
                                      }}
                                    />

                                    <div
                                      className={cn(
                                        "absolute inset-0 bg-black/0 flex items-center justify-center transition-all duration-300",
                                        "group-hover:bg-black/20 group-focus:bg-black/20",
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          "bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-0 transition-all duration-300",
                                          "group-hover:scale-100 group-focus:scale-100",
                                          "shadow-lg",
                                        )}
                                      >
                                        <ZoomIn className="h-5 w-5 text-gray-800" />
                                      </div>
                                    </div>

                                    {project.images.length > 1 && (
                                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                        {index + 1}/{project.images.length}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                          </div>

                          <div>
                            <h4 className="font-semibold text-foreground mb-2">
                              {getTranslation(translations, "projects.details.about", "About This Project")}
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">{projectContent.description}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-foreground mb-3">
                              {getTranslation(translations, "projects.details.techStack", "Technology Stack")}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {project.techStack.map((tech) => (
                                <Badge key={tech} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-foreground mb-3">
                              {getTranslation(translations, "projects.details.features", "Key Features")}
                            </h4>
                            <ul className="space-y-2">
                              {(projectContent.features || []).map((feature, index) => (
                                <li key={index} className="flex items-start space-x-2 text-muted-foreground">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Timeline - only show if project has timeline */}
                          {(projectData as any).timeline && (
                            <ProjectTimeline timeline={(projectData as any).timeline} />
                          )}

                          <div className="flex items-center space-x-4 pt-4 border-t border-border">
                            <Button asChild variant="default">
                              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-4 w-4" />
                                {getTranslation(translations, "projects.cta.viewCode", "View Code")}
                              </Link>
                            </Button>

                            {project.demoUrl && (
                              <Button asChild variant="outline">
                                <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  {getTranslation(translations, "projects.cta.liveDemo", "Live Demo")}
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">
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
      </div>

      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxInitialIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        projectTitle={lightboxProjectTitle}
      />
    </section>
  )
}
