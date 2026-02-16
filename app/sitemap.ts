import type { MetadataRoute } from "next"
import projectsData from "@/content/projects.json"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.repetto-a.com"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]

  // Project pages
  const projectPages: MetadataRoute.Sitemap = projectsData.projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [...staticPages, ...projectPages]
}
