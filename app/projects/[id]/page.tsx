import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Github, ExternalLink, Calendar, Code, Zap, Eye } from "lucide-react"
import Link from "next/link"
import projectsData from "@/content/projects.json"
import { ProjectImageGallery } from "@/components/project-image-gallery"
import { ProjectTimeline } from "@/components/project-timeline"
import { generateMetadata as genMetadata, generateProjectSchema, siteConfig } from "@/lib/seo"

const categoryIcons = {
  "Web Application": Code,
  "Business Automation": Zap,
  "Management System": Calendar,
  "AI/ML Research": Eye,
  "Blockchain/DeFi": ExternalLink,
  "Healthcare System": Calendar,
  "Game / AgTech": Eye,
}

const statusConfig = {
  "in-progress": {
    label: "In Progress",
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  production: {
    label: "Production",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  prototype: {
    label: "Prototype",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  "winner-local / in-evaluation-global": {
    label: "Winner - Under Global Evaluation",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const projectData = projectsData.projects.find((p) => p.id === params.id)

  if (!projectData) {
    return genMetadata({
      title: "Project Not Found",
      description: "The requested project could not be found.",
      noindex: true,
    })
  }

  const projectContent = (projectData as any).locales?.en || {}
  const keywords = [...projectData.techStack, projectData.category, "project", "portfolio"]

  return genMetadata({
    title: projectContent.title || projectData.id,
    description: projectContent.short || projectContent.description || "",
    canonical: `${siteConfig.url}/projects/${params.id}`,
    ogType: "article",
    keywords,
  })
}

export function generateStaticParams() {
  return projectsData.projects.map((project) => ({
    id: project.id,
  }))
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const projectData = projectsData.projects.find((p) => p.id === params.id)

  if (!projectData) {
    notFound()
  }

  const project = {
    ...projectData,
    status: projectData.status in statusConfig ? projectData.status : "in-progress",
  }

  const projectContent = (project as any).locales?.en || {}
  const IconComponent = categoryIcons[project.category as keyof typeof categoryIcons] || Code
  const statusStyle = statusConfig[project.status as keyof typeof statusConfig] || statusConfig["in-progress"]

  const projectSchema = generateProjectSchema({
    id: project.id,
    title: projectContent.title,
    description: projectContent.description,
    status: project.status,
    techStack: project.techStack,
    githubUrl: project.githubUrl,
    demoUrl: project.demoUrl,
    category: project.category,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectSchema),
        }}
      />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/#projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </div>

          {/* Project Header */}
          <div className="space-y-6 mb-12">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{projectContent.title}</h1>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className={statusStyle.color}>
                    {statusStyle.label}
                  </Badge>
                  <Badge variant="secondary">{project.category}</Badge>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {project.githubUrl && (
                  <Button asChild variant="default">
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </Link>
                  </Button>
                )}

                {project.demoUrl && (
                  <Button asChild variant="outline">
                    <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">{projectContent.description}</p>
          </div>

          {/* Project Images */}
          <ProjectImageGallery images={project.images || []} projectTitle={projectContent.title} className="mb-12" />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(projectContent.features || []).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Timeline - only show if project has timeline */}
              {(project as any).timeline && <ProjectTimeline timeline={(project as any).timeline} />}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tech Stack */}
              <Card>
                <CardHeader>
                  <CardTitle>Technology Stack</CardTitle>
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

              {/* Project Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.githubUrl && (
                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                      <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        View Source Code
                      </Link>
                    </Button>
                  )}

                  {project.demoUrl && (
                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                      <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
