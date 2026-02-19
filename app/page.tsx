import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { AwardsSection } from "@/components/sections/awards-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ContactSection } from "@/components/sections/contact-section"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import { generateMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  canonical: siteConfig.url,
  ogType: "profile",
})

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <AwardsSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
