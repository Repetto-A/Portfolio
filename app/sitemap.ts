import type { MetadataRoute } from "next"
import projectsData from "@/content/projects.json"
import { siteConfig, sprintSeo } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes: MetadataRoute.Sitemap = projectsData.projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.id}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: sprintSeo.canonical,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...projectRoutes,
  ]
}
