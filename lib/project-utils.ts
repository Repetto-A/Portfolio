import projectsData from "@/content/projects.json"
import type { Project } from "@/types/project"

const projectIds = new Set(projectsData.projects.map((p) => p.id))

/** Returns true if the projectId maps to an actual project in projects.json */
export function hasMatchingProject(projectId: string): boolean {
  return projectIds.has(projectId)
}

/** Returns the project data for a given projectId, or null */
export function getProjectById(projectId: string): Project | null {
  const data = projectsData.projects.find((p) => p.id === projectId)
  return data ? (data as unknown as Project) : null
}
