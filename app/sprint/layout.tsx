import type { ReactNode } from "react"
import { generateMetadata as genMetadata, sprintSeo } from "@/lib/seo"

export const metadata = genMetadata({
  title: sprintSeo.title,
  description: sprintSeo.description,
  canonical: sprintSeo.canonical,
  ogImage: sprintSeo.ogImage,
  ogImageAlt: sprintSeo.ogImageAlt,
  ogType: "website",
})

export default function SprintLayout({ children }: { children: ReactNode }) {
  return <div lang="es-AR">{children}</div>
}
