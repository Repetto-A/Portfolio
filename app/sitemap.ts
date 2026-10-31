import type { MetadataRoute } from "next"
import projectsData from "@/content/projects.json"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.repetto-a.com"
  const lastModified = new Date()

  const projectRoutes: MetadataRoute.Sitemap = projectsData.projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/sprint`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...projectRoutes,
  ]
}
