import type { MetadataRoute } from "next"
import projectsData from "@/content/projects.json"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.repetto-a.com"

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]

  // Project pages
  const projectPages = projectsData.projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Blog post pages
  const blogPosts = ["nasa-space-apps-2024", "automation-factory-systems", "real-estate-tech-stack"]

  const blogPages = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...projectPages, ...blogPages]
}
