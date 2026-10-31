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
  return (
    <>
      <link
        rel="preload"
        href="/fonts/newsreader-600-latin.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <div lang="es-AR">{children}</div>
    </>
  )
}
