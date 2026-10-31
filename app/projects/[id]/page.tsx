import { notFound } from "next/navigation"
import type { Metadata } from "next"
import projectsData from "@/content/projects.json"
import { ProjectPageContent, type ProjectPageData } from "@/components/project-page-content"
import { generateMetadata as genMetadata, generateProjectSchema, siteConfig } from "@/lib/seo"

type ProjectContent = {
  title?: string
  short?: string
  description?: string
  features?: string[]
}

type ProjectWithLocales = {
  locales?: { en?: ProjectContent; es?: ProjectContent }
  timeline?: unknown
  caseStudy?: ProjectPageData["caseStudy"]
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

  const projectContent: ProjectContent = (projectData as ProjectWithLocales).locales?.en ?? {}
  const keywords = [...projectData.techStack, projectData.category, "project", "portfolio"]
  const firstImage = projectData.images?.[0]
  const ogImage = firstImage ? `${siteConfig.url}${firstImage}` : undefined

  return genMetadata({
    title: projectContent.title || projectData.id,
    description: projectContent.short || projectContent.description || "",
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

  const projectContent: ProjectContent = (projectData as ProjectWithLocales).locales?.en ?? {}

  const projectSchema = generateProjectSchema({
    id: projectData.id,
    title: projectContent.title ?? "",
    description: projectContent.description ?? "",
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
    locales: (projectData as ProjectWithLocales).locales ?? {},
    caseStudy: (projectData as ProjectWithLocales).caseStudy,
    timeline: Array.isArray((projectData as ProjectWithLocales).timeline)
      ? ((projectData as ProjectWithLocales).timeline as ProjectPageData["timeline"])
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
