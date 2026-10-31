import { notFound } from "next/navigation"
import type { Metadata } from "next"
import projectsData from "@/content/projects.json"
import { ProjectPageContent, type ProjectPageData } from "@/components/project-page-content"
import { JsonLd } from "@/components/json-ld"
import { generateMetadata as genMetadata, generateProjectPageGraph, siteConfig } from "@/lib/seo"
import es from "@/public/locales/es/common.json"

type ProjectContent = {
  title?: string
  short?: string
  description?: string
  features?: string[]
}

type ProjectWithLocales = {
  locales?: { en?: ProjectContent; es?: ProjectContent }
  timeline?: unknown
}

function projectCopy(project: ProjectWithLocales): ProjectContent {
  return project.locales?.es ?? project.locales?.en ?? {}
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const projectData = projectsData.projects.find((p) => p.id === params.id)

  if (!projectData) {
    return genMetadata({
      title: es.projects.notFound.title,
      description: es.projects.notFound.description,
      noindex: true,
    })
  }

  const content = projectCopy(projectData as ProjectWithLocales)
  const firstImage = projectData.images?.[0]
  const ogImage = firstImage || siteConfig.ogImage

  return genMetadata({
    title: content.title || projectData.id,
    description: content.short || content.description || "",
    canonical: `${siteConfig.url}/projects/${params.id}`,
    ogImage,
    ogImageAlt: content.title || projectData.id,
    ogType: "website",
    keywords: [...projectData.techStack, projectData.category],
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

  const content = projectCopy(projectData as ProjectWithLocales)

  const project: ProjectPageData = {
    id: projectData.id,
    status: projectData.status,
    techStack: projectData.techStack,
    githubUrl: projectData.githubUrl ?? null,
    demoUrl: projectData.demoUrl ?? null,
    images: projectData.images ?? [],
    category: projectData.category,
    locales: (projectData as ProjectWithLocales).locales ?? {},
    timeline: Array.isArray((projectData as ProjectWithLocales).timeline)
      ? ((projectData as ProjectWithLocales).timeline as ProjectPageData["timeline"])
      : undefined,
  }

  return (
    <>
      <JsonLd
        data={generateProjectPageGraph({
          id: projectData.id,
          title: content.title ?? "",
          description: content.description ?? content.short ?? "",
          techStack: projectData.techStack,
          githubUrl: projectData.githubUrl,
          demoUrl: projectData.demoUrl,
        })}
      />
      <ProjectPageContent project={project} />
    </>
  )
}
