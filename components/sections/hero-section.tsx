"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTranslations, getTranslation, getResumeUrl } from "@/lib/i18n-context"
import { useScrollContext } from "@/lib/scroll-context"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const [translations, locale] = useTranslations()
  const resumeUrl = getResumeUrl(locale)
  const { registerHeroTitleRef, isFloatingTitleActive, scrollProgress, fontsReady, animationHasRun } = useScrollContext()

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1
                ref={registerHeroTitleRef}
                className={cn(
                  "font-mono font-semibold text-foreground leading-tight text-balance transition-opacity duration-100",
                  // Hide hero h1 only while the floating clone is active or animation
                  // is in progress (scrollProgress >= 1 but not yet marked complete).
                  // Once animationHasRun, the hero text is always visible.
                  fontsReady && !animationHasRun && (isFloatingTitleActive || scrollProgress >= 1) && "opacity-0",
                )}
                style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
              >
                {getTranslation(translations, "hero.name", "Alejandro Repetto")}
              </h1>
              <h2 className="font-mono text-muted-foreground" style={{ fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)" }}>
                {getTranslation(translations, "hero.title", "Systems Engineering Student")}
              </h2>
              <p
                className="text-muted-foreground leading-relaxed text-pretty max-w-2xl"
                style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}
              >
                {getTranslation(
                  translations,
                  "hero.description",
                  "I build intelligent management systems, automation tools, and AI/ML applications that save people time and simplify complex processes.",
                )}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button asChild size="lg" className="group w-full sm:w-auto">
                <Link href="#projects">
                  {getTranslation(translations, "hero.cta.projects", "See Projects")}
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild className="group bg-transparent w-full sm:w-auto">
                <Link href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                  {getTranslation(translations, "hero.cta.resume", "Download Resume")}
                </Link>
              </Button>

            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-border">
              <div>
                <div className="font-bold text-foreground" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                  6+
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {getTranslation(translations, "hero.stats.projects", "Projects")}
                </div>
              </div>
              <div>
                <div className="font-bold text-foreground" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                  3+
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {getTranslation(translations, "hero.stats.experience", "Years Experience")}
                </div>
              </div>
              <div>
                <div className="font-bold text-foreground" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                  AI/ML
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {getTranslation(translations, "hero.stats.specialization", "Specialization")}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <div className="flex justify-center lg:justify-end order-first lg:order-last">
            <div className="relative w-full max-w-md lg:max-w-none aspect-square">
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border overflow-hidden">
                <div className="relative w-11/12 h-11/12 rounded-xl overflow-hidden">
                  <Image
                    src="/placeholder.jpg"
                    alt="Alejandro Repetto - Systems Engineer specializing in AI/ML and automation"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                    quality={90}
                  />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-card border border-border rounded-lg p-2 sm:p-3 shadow-lg backdrop-blur-sm">
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {getTranslation(translations, "hero.status.currently", "Currently")}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
                  {getTranslation(translations, "hero.status.building", "Building AI Solutions")}
                </div>
              </div>

              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-card border border-border rounded-lg p-2 sm:p-3 shadow-lg backdrop-blur-sm">
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {getTranslation(translations, "hero.status.focus", "Focus")}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
                  {getTranslation(translations, "hero.status.automation", "Automation & ML")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-12 sm:mt-16">
          <Link href="#about" className="group" aria-label="Scroll to about section">
            <div className="flex flex-col items-center space-y-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-sm">{getTranslation(translations, "hero.scroll", "Learn more")}</span>
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
