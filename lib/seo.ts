import type { Metadata } from "next"

export interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: "website" | "article" | "profile"
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  noindex?: boolean
}

const siteConfig = {
  name: "Alejandro Repetto",
  title: "Alejandro Repetto | Software Engineer enfocado en IA",
  description:
    "Software Engineer enfocado en IA. Fundador de Nexa (+50 comunidades, +300.000 builders en LATAM), host de Builders Off The Record, docente en UCEL y consultor en CRIA.",
  url: "https://www.repetto-a.com",
  ogImage: "https://www.repetto-a.com/og-image.png",
  keywords: [
    "software engineer",
    "inteligencia artificial",
    "IA",
    "Nexa",
    "Builders Off The Record",
    "UCEL",
    "CRIA",
    "NASA Space Apps",
    "Vercel Hackathon",
    "Platanus Hack",
    "ETHGlobal",
    "adopción de IA",
    "LATAM",
  ],
  author: {
    name: "Alejandro Repetto",
    url: "https://www.repetto-a.com",
    email: "contact@repetto-a.com",
    github: "https://github.com/Repetto-A",
    linkedin: "https://www.linkedin.com/in/alejandro-repetto",
    nexa: "https://nexa.builders",
    botr: "https://www.buildersofftherecord.com",
  },
}

export function generateMetadata({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  keywords = [],
  publishedTime,
  modifiedTime,
  authors,
  noindex = false,
}: SEOProps): Metadata {
  const finalTitle =
    title === siteConfig.name || title === siteConfig.title
      ? title
      : `${title} | ${siteConfig.name}`
  const finalCanonical = canonical || siteConfig.url
  const finalOgImage = ogImage || siteConfig.ogImage
  const finalKeywords = [...siteConfig.keywords, ...keywords]

  return {
    title: finalTitle,
    description,
    keywords: finalKeywords,
    authors: authors ? authors.map((name) => ({ name })) : [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: ogType,
      locale: "es_AR",
      alternateLocale: ["en_US"],
      url: finalCanonical,
      title: finalTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: title,
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
      creator: "@repetto_a",
    },
    alternates: {
      canonical: finalCanonical,
    },
    metadataBase: new URL(siteConfig.url),
  }
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alejandro Repetto",
    alternateName: "Repetto-A",
    url: "https://www.repetto-a.com",
    image: "https://www.repetto-a.com/og-image.png",
    jobTitle: "Software Engineer enfocado en IA",
    description:
      "Software Engineer enfocado en IA y estudiante avanzado de Ingeniería en Sistemas. Ayuda a empresas y builders a pasar de hablar de IA a ejecutarla, con capacitación y hackathons internas. Fundador de Nexa, host de Builders Off The Record, docente en UCEL y consultor/trainer en CRIA.",
    worksFor: {
      "@type": "Organization",
      name: "Nexa",
      url: "https://nexa.builders",
    },
    affiliation: [
      {
        "@type": "EducationalOrganization",
        name: "UCEL",
      },
      {
        "@type": "Organization",
        name: "CRIA",
      },
      {
        "@type": "Organization",
        name: "Builders Off The Record",
        url: "https://www.buildersofftherecord.com",
      },
      {
        "@type": "Organization",
        name: "SpaceXAI",
      },
      {
        "@type": "Organization",
        name: "Supabase",
      },
      {
        "@type": "Organization",
        name: "Rosario Tech Week",
      },
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "AI adoption",
      "Software Engineering",
      "Systems Engineering",
      "RAG",
      "Hackathons",
      "Builder communities",
    ],
    sameAs: [
      "https://github.com/Repetto-A",
      "https://www.linkedin.com/in/alejandro-repetto",
      "https://nexa.builders",
      "https://www.buildersofftherecord.com",
    ],
    email: "contact@repetto-a.com",
    award: [
      "NASA Space Apps Challenge - Farm Hero, ganador local y Global Nominee",
      "Vercel Hackathon 2026 - 2do puesto + Nvidia",
      "Platanus Hack 2026 - favorito del jurado",
      "Premios en ETHGlobal",
    ],
  }
}

export function generateProjectSchema(project: {
  id: string
  title: string
  description: string
  status: string
  techStack: string[]
  githubUrl?: string | null
  demoUrl?: string | null
  category: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    applicationCategory: project.category,
    creator: {
      "@type": "Person",
      name: "Alejandro Repetto",
      url: "https://www.repetto-a.com",
    },
    ...(project.githubUrl && {
      codeRepository: project.githubUrl,
    }),
    ...(project.demoUrl && {
      url: project.demoUrl,
    }),
    programmingLanguage: project.techStack,
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }
}

export function generateArticleSchema({
  title,
  description,
  publishedTime,
  modifiedTime,
  author = "Alejandro Repetto",
  url,
  image,
}: {
  title: string
  description: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  url: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author,
      url: "https://www.repetto-a.com",
    },
    publisher: {
      "@type": "Person",
      name: "Alejandro Repetto",
      url: "https://www.repetto-a.com",
    },
    url,
    ...(image && { image }),
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/projects?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateOGImageUrl(
  title: string,
  type: "project" | "article" | "default" = "default"
): string {
  const params = new URLSearchParams({
    title: title.slice(0, 100),
    type,
  })
  return `${siteConfig.url}/api/og?${params.toString()}`
}

export { siteConfig }
