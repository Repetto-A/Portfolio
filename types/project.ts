export interface LocalizedText {
  en: string
  es: string
}

export interface ProjectLocale {
  title: string
  short: string
  description: string
  features: string[]
}

export interface CaseStudyFact {
  value: LocalizedText
  label: LocalizedText
}

export interface ProjectCaseStudy {
  problem: LocalizedText
  approach: LocalizedText
  result: LocalizedText
  facts?: CaseStudyFact[]
}

export interface Project {
  id: string
  locales: Record<string, ProjectLocale>
  status: string
  techStack: string[]
  githubUrl: string | null
  demoUrl: string | null
  images: string[]
  category: string
  caseStudy?: ProjectCaseStudy
  timeline?: Array<{
    date: string
    title: { en: string; es: string }
    description: { en: string; es: string }
  }>
}
