import projectsData from "@/content/projects.json"
import type { Project } from "@/types/project"
import { awards, type Award } from "@/data/awards"

const projectIds = new Set(projectsData.projects.map((p) => p.id))

/** Map from projectId → Award for O(1) lookup */
const awardByProjectId = new Map<string, Award>(
  awards.filter((a) => a.visible && a.projectId).map((a) => [a.projectId, a])
)

/** Returns the award associated with a project, if any */
export function getAwardForProject(projectId: string): Award | undefined {
  return awardByProjectId.get(projectId)
}

/** Returns true if the projectId maps to an actual project in projects.json */
export function hasMatchingProject(projectId: string): boolean {
  return projectIds.has(projectId)
}

/** Returns the project data for a given projectId, or null */
export function getProjectById(projectId: string): Project | null {
  const data = projectsData.projects.find((p) => p.id === projectId)
  return data ? (data as unknown as Project) : null
}
