export interface ProjectLocale {
  title: string
  short: string
  description: string
  features: string[]
}

export interface Project {
  id: string
  locales: Record<string, ProjectLocale>
  status: string
  techStack: string[]
  githubUrl: string
  demoUrl: string | null
  images: string[]
  category: string
  timeline?: Array<{
    date: string
    title: { en: string; es: string }
    description: { en: string; es: string }
  }>
}
