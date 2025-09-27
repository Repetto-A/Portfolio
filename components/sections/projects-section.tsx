"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ExternalLink, Github, Eye, Calendar, Code, Zap } from "lucide-react"
import Link from "next/link"
import projectsData from "@/content/projects.json"

const statusConfig = {
  "in-progress": { label: "In Progress", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  production: { label: "Production", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  competition: { label: "Competition", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  prototype: { label: "Prototype", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
}

const categoryIcons = {
  "Web Application": Code,
  "Business Automation": Zap,
  "Management System": Calendar,
  "AI/ML Research": Eye,
  "Blockchain/DeFi": ExternalLink,
  "Healthcare System": Calendar,
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: keyof typeof statusConfig;
  techStack: string[];
  features: string[];
  githubUrl: string;
  demoUrl: string | null;
  images: string[];
  category: keyof typeof categoryIcons;
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            A collection of systems engineering projects spanning automation, AI/ML, and management solutions built to
            solve real-world challenges.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.projects.map((projectData) => {
            // Asegurarse de que el proyecto cumpla con la interfaz Project
            const project: Project = {
              ...projectData,
              status: (['in-progress', 'production', 'competition', 'prototype'].includes(projectData.status) 
                ? projectData.status 
                : 'in-progress') as keyof typeof statusConfig,
              category: (projectData.category in categoryIcons 
                ? projectData.category 
                : 'Web Application') as keyof typeof categoryIcons
            };
            
            const IconComponent = categoryIcons[project.category] || Code;
            const statusStyle = statusConfig[project.status];

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
                      {project.category}
                    </Badge>
                  </div>

                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{project.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{project.description}</p>

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
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View live demo</span>
                        </Link>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedProject(project)}>
                          Learn More
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <span>{project.title}</span>
                            <Badge variant="outline" className={statusStyle.color}>
                              {statusStyle.label}
                            </Badge>
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Project Images */}
                          <div className="grid md:grid-cols-2 gap-4">
                            {project.images && project.images.map((image, index) => {
                              const fullPath = image.startsWith('/') ? image : `/${image}`;
                              return (
                                <div key={index} className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                                  <Image
                                    src={fullPath}
                                    alt={`${project.title} screenshot ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                      console.error(`Error loading image: ${fullPath}`);
                                      const target = e.target as HTMLImageElement;
                                      target.src = `/placeholder.png?height=300&width=500&text=${encodeURIComponent(project.title)}`;
                                      target.onerror = null; // Prevenir bucles de error
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>

                          {/* Description */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">About This Project</h4>
                            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                          </div>

                          {/* Tech Stack */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Technology Stack</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.techStack.map((tech) => (
                                <Badge key={tech} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Key Features */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Key Features</h4>
                            <ul className="space-y-2">
                              {project.features.map((feature, index) => (
                                <li key={index} className="flex items-start space-x-2 text-muted-foreground">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Links */}
                          <div className="flex items-center space-x-4 pt-4 border-t border-border">
                            <Button asChild variant="default">
                              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-4 w-4" />
                                View Code
                              </Link>
                            </Button>

                            {project.demoUrl && (
                              <Button asChild variant="outline">
                                <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Live Demo
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

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Interested in collaborating?</h3>
            <p className="text-muted-foreground">
              I'm always open to discussing new projects and opportunities in systems engineering and AI/ML.
            </p>
            <Button asChild size="lg">
              <Link href="#contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
