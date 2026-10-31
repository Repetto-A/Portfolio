import { notFound } from "next/navigation"
import type { Metadata } from "next"
import projectsData from "@/content/projects.json"
import { ProjectPageContent, type ProjectPageData } from "@/components/project-page-content"
import { JsonLd } from "@/components/json-ld"
import { generateMetadata as genMetadata, generateProjectPageGraph, siteConfig } from "@/lib/seo"
import es from "@/public/locales/es/common.json"
import type { ProjectCaseStudy } from "@/types/project"

type ProjectContent = {
  title?: string
  short?: string
  description?: string
  features?: string[]
}

type ProjectWithLocales = {
  locales?: { en?: ProjectContent; es?: ProjectContent }
  timeline?: unknown
  caseStudy?: ProjectCaseStudy
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

  const projectWithLocales = projectData as ProjectWithLocales
  const content = projectCopy(projectWithLocales)
  const caseStudy = projectWithLocales.caseStudy
  const firstImage = projectData.images?.[0]
  const ogImage = firstImage || siteConfig.ogImage
  const description = caseStudy?.problem.es || content.description || ""

  return genMetadata({
    title: content.title || projectData.id,
    description,
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

  const projectWithLocales = projectData as ProjectWithLocales
  const content = projectCopy(projectWithLocales)
  const caseStudy = projectWithLocales.caseStudy

  const project: ProjectPageData = {
    id: projectData.id,
    status: projectData.status,
    techStack: projectData.techStack,
    githubUrl: projectData.githubUrl ?? null,
    demoUrl: projectData.demoUrl ?? null,
    images: projectData.images ?? [],
    category: projectData.category,
    locales: projectWithLocales.locales ?? {},
    caseStudy: projectWithLocales.caseStudy,
    timeline: Array.isArray(projectWithLocales.timeline)
      ? (projectWithLocales.timeline as ProjectPageData["timeline"])
      : undefined,
  }

  return (
    <>
      <JsonLd
        data={generateProjectPageGraph({
          id: projectData.id,
          title: content.title ?? "",
          description: caseStudy?.problem.es || content.description || "",
          techStack: projectData.techStack,
          githubUrl: projectData.githubUrl,
          demoUrl: projectData.demoUrl,
        })}
      />
      <ProjectPageContent project={project} />
    </>
  )
}
