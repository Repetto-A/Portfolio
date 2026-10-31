import type { Metadata } from "next"
import es from "@/public/locales/es/common.json"
import { PROFILE_OG_SRC, PROFILE_PHOTO_SRC, SPRINT_OG_SRC } from "@/lib/media"
import {
  CONTACT_EMAIL,
  CRIA_URL,
  GITHUB_URL,
  LINKEDIN_URL,
  NEXA_URL,
  SPACEXSI_AMBASSADOR_LABEL,
  TRAINED_PEOPLE_STAT,
} from "@/lib/sprint/constants"
import { TRAINED_PEOPLE_LABEL } from "@/lib/sprint/offer"
import { SPRINT_AWARDS } from "@/lib/sprint/proof"

export interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogImageAlt?: string
  ogType?: "website" | "article" | "profile"
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  noindex?: boolean
  locale?: string
}

const TRAINED_PEOPLE_PHRASE = `${TRAINED_PEOPLE_STAT} ${TRAINED_PEOPLE_LABEL.es}` as const

const HOME_DESCRIPTION_LEAD = es.hero.description.split("\n")[0].trim()

export const siteConfig = {
  name: "Alejandro Repetto",
  title: `${es.hero.name}: ${es.trainings.title.charAt(0).toLowerCase()}${es.trainings.title.slice(1)}`,
  description: `${HOME_DESCRIPTION_LEAD} ${TRAINED_PEOPLE_PHRASE}.`,
  url: "https://www.repetto-a.com",
  ogImage: `https://www.repetto-a.com${PROFILE_OG_SRC}`,
  ogImageAlt: `${es.hero.name}, ${es.hero.title}`,
  profileImage: `https://www.repetto-a.com${PROFILE_PHOTO_SRC}`,
  sprintOgImage: `https://www.repetto-a.com${SPRINT_OG_SRC}`,
  locale: "es_AR",
  language: "es-AR",
  keywords: [
    es.hero.title,
    es.footer.sprint,
    "AI Execution Sprint",
    "NASA Space Apps",
    "ETH Argentina",
    "ETH Global",
    "CRIA",
    "UCEL",
    "NEXA",
    "Cursor",
    "Grok Bot",
  ],
  author: {
    name: "Alejandro Repetto",
    url: "https://www.repetto-a.com",
    email: CONTACT_EMAIL,
    github: GITHUB_URL,
    linkedin: LINKEDIN_URL,
  },
} as const

export const sprintSeo = {
  title: "AI Execution Sprint: de hablar de IA a ejecutar con IA, en 30 días",
  description:
    "Sprint de 30 días para dirección y equipos: diagnóstico, capacitación aplicada y hackathon interna. Tu equipo termina con prototipos, reglas de uso y un roadmap de 90 días.",
  canonical: `${siteConfig.url}/sprint`,
  ogImage: siteConfig.sprintOgImage,
  ogImageAlt: "Alejandro Repetto, AI Execution Sprint",
} as const

function formatTitle(title: string): string {
  if (title === siteConfig.name || title === siteConfig.title || title.includes(siteConfig.name)) {
    return title
  }
  return `${title} | ${siteConfig.name}`
}

function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${siteConfig.url}${normalized}`
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export function generateMetadata({
  title,
  description,
  canonical,
  ogImage,
  ogImageAlt,
  ogType = "website",
  keywords = [],
  publishedTime,
  modifiedTime,
  authors,
  noindex = false,
  locale = siteConfig.locale,
}: SEOProps): Metadata {
  const finalTitle = formatTitle(title)
  const finalCanonical = canonical ? absoluteUrl(canonical) : siteConfig.url
  const finalOgImage = ogImage ? absoluteUrl(ogImage) : siteConfig.ogImage
  const finalOgAlt = ogImageAlt || title
  const finalKeywords = [...siteConfig.keywords, ...keywords]

  return {
    title: finalTitle,
    description,
    keywords: finalKeywords,
    authors: authors ? authors.map((name) => ({ name })) : [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type: ogType,
      locale,
      url: finalCanonical,
      title: finalTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: finalOgAlt,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description,
      images: [finalOgImage],
    },
    alternates: {
      canonical: finalCanonical,
    },
    metadataBase: new URL(siteConfig.url),
  }
}

export function generatePersonSchema() {
  return {
    "@type": "Person",
    "@id": `${siteConfig.url}#person`,
    name: siteConfig.author.name,
    alternateName: "Repetto-A",
    url: siteConfig.url,
    image: siteConfig.profileImage,
    jobTitle: es.hero.title,
    description: es.about.bio.short,
    email: siteConfig.author.email,
    sameAs: [siteConfig.author.github, siteConfig.author.linkedin],
    knowsAbout: [
      es.footer.sprint,
      "Cursor",
      "Grok Bot",
      es.skills.highlights.aiml.title,
      es.skills.highlights.automation.title,
      es.skills.highlights.fullstack.title,
    ],
    worksFor: {
      "@type": "Organization",
      name: "NEXA",
      url: NEXA_URL,
    },
    affiliation: [
      {
        "@type": "Organization",
        name: "CRIA",
        url: CRIA_URL,
      },
      {
        "@type": "EducationalOrganization",
        name: "UCEL",
      },
    ],
    memberOf: {
      "@type": "Organization",
      name: SPACEXSI_AMBASSADOR_LABEL.replace(" Ambassador", ""),
    },
    award: SPRINT_AWARDS.map((item) => `${item.event}: ${item.result}`),
  }
}

export function generateWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    publisher: { "@id": `${siteConfig.url}#person` },
    author: { "@id": `${siteConfig.url}#person` },
  }
}

export function generateProfilePageSchema() {
  return {
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}#profilepage`,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": `${siteConfig.url}#website` },
    mainEntity: { "@id": `${siteConfig.url}#person` },
  }
}

export function generateHomeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [generatePersonSchema(), generateWebSiteSchema(), generateProfilePageSchema()],
  }
}

export function generateSiteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [generatePersonSchema(), generateWebSiteSchema()],
  }
}

export function generateProjectSchema(project: {
  id: string
  title: string
  description: string
  techStack: string[]
  githubUrl?: string | null
  demoUrl?: string | null
}) {
  const pageUrl = `${siteConfig.url}/projects/${project.id}`
  const schema: Record<string, unknown> = {
    "@type": project.githubUrl ? "SoftwareSourceCode" : "CreativeWork",
    name: project.title,
    description: project.description,
    url: project.demoUrl || pageUrl,
    creator: { "@id": `${siteConfig.url}#person` },
    author: { "@id": `${siteConfig.url}#person` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  }

  if (project.githubUrl) {
    schema.codeRepository = project.githubUrl
  }
  if (project.techStack.length > 0) {
    schema.programmingLanguage = project.techStack
  }

  return schema
}

export function generateSprintServiceSchema() {
  return {
    "@type": "Service",
    "@id": `${sprintSeo.canonical}#service`,
    name: "AI Execution Sprint",
    description: sprintSeo.description,
    url: sprintSeo.canonical,
    serviceType: es.footer.sprint,
    provider: { "@id": `${siteConfig.url}#person` },
    inLanguage: siteConfig.language,
  }
}

export function generateSprintWebPageSchema() {
  return {
    "@type": "WebPage",
    "@id": `${sprintSeo.canonical}#webpage`,
    url: sprintSeo.canonical,
    name: sprintSeo.title,
    description: sprintSeo.description,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": `${siteConfig.url}#website` },
    about: { "@id": `${sprintSeo.canonical}#service` },
  }
}

export function generateSprintPageGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      generateSprintServiceSchema(),
      generateSprintWebPageSchema(),
      generateBreadcrumbSchema([
        { name: es.navigation.home, url: siteConfig.url },
        { name: "AI Execution Sprint", url: sprintSeo.canonical },
      ]),
    ],
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateProjectPageGraph(project: {
  id: string
  title: string
  description: string
  techStack: string[]
  githubUrl?: string | null
  demoUrl?: string | null
}) {
  const pageUrl = `${siteConfig.url}/projects/${project.id}`
  return {
    "@context": "https://schema.org",
    "@graph": [
      generateProjectSchema(project),
      generateBreadcrumbSchema([
        { name: es.navigation.home, url: siteConfig.url },
        { name: es.navigation.projects, url: `${siteConfig.url}/#projects` },
        { name: project.title, url: pageUrl },
      ]),
    ],
  }
}

export { TRAINED_PEOPLE_PHRASE, absoluteUrl }
