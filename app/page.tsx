import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { TrainingsSection } from "@/components/sections/trainings-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { AwardsSection } from "@/components/sections/awards-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ContactSection } from "@/components/sections/contact-section"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import { generateMetadata, siteConfig } from "@/lib/seo"
import { PROFILE_PHOTO_SRC } from "@/lib/media"

export const metadata: Metadata = generateMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  canonical: siteConfig.url,
  ogType: "profile",
})

export default function Home() {
  return (
    <>
      <link
        rel="preload"
        href={PROFILE_PHOTO_SRC}
        as="image"
        type="image/webp"
        fetchPriority="high"
      />
      <Navigation />
      <main id="main-content" className="min-h-screen bg-background">
        <HeroSection />
        <AboutSection />
        <TrainingsSection />
        <SkillsSection />
        <div className="flex justify-center">
          <div className="h-px w-16 bg-border" />
        </div>
        <AwardsSection />
        <ProjectsSection />
        <div className="flex justify-center">
          <div className="h-px w-16 bg-border" />
        </div>
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
