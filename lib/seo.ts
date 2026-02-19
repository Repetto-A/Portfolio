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
  title: "Alejandro Repetto: Systems Engineer & Full-Stack Developer | Portfolio",
  description:
    "Award-winning systems engineer specializing in automation and full-stack development. NASA Space Apps winner, ETH Global finalist. View projects, case studies, and get in touch.",
  url: "https://www.repetto-a.com",
  ogImage: "https://www.repetto-a.com/og-image.png",
  keywords: [
    "systems engineering",
    "AI/ML",
    "machine learning",
    "automation",
    "web development",
    "full-stack developer",
    "NASA Space Apps",
    "ETH Global",
    "blockchain",
    "portfolio",
  ],
  author: {
    name: "Alejandro Repetto",
    url: "https://www.repetto-a.com",
    email: "repettoalejandroing@gmail.com",
    github: "https://github.com/Repetto-A",
    linkedin: "https://www.linkedin.com/in/alejandro-repetto",
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
  const finalTitle = title === siteConfig.name || title === siteConfig.title ? title : `${title} | ${siteConfig.name}`
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
      locale: "en_US",
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
    jobTitle: "Systems Engineer & AI/ML Developer",
    worksFor: {
      "@type": "EducationalOrganization",
      name: "UTN - Universidad Tecnológica Nacional",
      url: "https://www.frro.utn.edu.ar/",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Universidad Tecnológica Nacional",
    },
    knowsAbout: [
      "Systems Engineering",
      "Artificial Intelligence",
      "Machine Learning",
      "Web Development",
      "Automation",
      "Blockchain",
      "Full-Stack Development",
    ],
    sameAs: ["https://github.com/Repetto-A", "https://www.linkedin.com/in/alejandro-repetto"],
    email: "repettoalejandroing@gmail.com",
    award: [
      "ETH Argentina 2025 - Roxium DAO Ops, Best Powerhouse App (1st Prize)",
      "NASA Space Apps Challenge 2025 - FarmHero, Local Winner & Global Nominee",
      "ETH Global 2025 - Zorrito Finance, 2nd Best dApp using Filecoin",
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

export function generateOGImageUrl(title: string, type: "project" | "article" | "default" = "default"): string {
  const params = new URLSearchParams({
    title: title.slice(0, 100),
    type,
  })
  return `${siteConfig.url}/api/og?${params.toString()}`
}

export { siteConfig }
