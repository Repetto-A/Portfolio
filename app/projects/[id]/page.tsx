import { notFound } from "next/navigation"
import type { Metadata } from "next"
import projectsData from "@/content/projects.json"
import { ProjectPageContent, type ProjectPageData } from "@/components/project-page-content"
import { generateMetadata as genMetadata, generateProjectSchema, siteConfig } from "@/lib/seo"
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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const projectData = projectsData.projects.find((p) => p.id === params.id)

  if (!projectData) {
    return genMetadata({
      title: "Project Not Found",
      description: "The requested project could not be found.",
      noindex: true,
    })
  }

  const projectWithLocales = projectData as ProjectWithLocales
  const projectContent: ProjectContent = projectWithLocales.locales?.en ?? {}
  const caseStudy = projectWithLocales.caseStudy
  const keywords = [...projectData.techStack, projectData.category, "project", "portfolio"]
  const firstImage = projectData.images?.[0]
  const ogImage = firstImage ? `${siteConfig.url}${firstImage}` : undefined
  const description =
    caseStudy?.problem.en || projectContent.short || projectContent.description || ""

  return genMetadata({
    title: projectContent.title || projectData.id,
    description,
    canonical: `${siteConfig.url}/projects/${params.id}`,
    ogImage,
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

  const projectWithLocales = projectData as ProjectWithLocales
  const projectContent: ProjectContent = projectWithLocales.locales?.en ?? {}
  const caseStudy = projectWithLocales.caseStudy

  const projectSchema = generateProjectSchema({
    id: projectData.id,
    title: projectContent.title ?? "",
    description: caseStudy?.problem.en || projectContent.description || "",
    status: projectData.status,
    techStack: projectData.techStack,
    githubUrl: projectData.githubUrl,
    demoUrl: projectData.demoUrl,
    category: projectData.category,
  })

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectSchema),
        }}
      />
      <ProjectPageContent project={project} />
    </>
  )
}
