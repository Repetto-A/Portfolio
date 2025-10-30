"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useTranslations, getTranslation, getResumeUrl } from "@/lib/i18n-context"

export function HeroSection() {
  const [translations, locale, loading] = useTranslations()

  const resumeUrl = getResumeUrl(locale)

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                {getTranslation(translations, "hero.name", "Alejandro Repetto")}
              </h1>
              <h2 className="text-xl sm:text-2xl text-muted-foreground font-mono">
                {getTranslation(
                  translations,
                  "hero.title",
                  "Systems Engineering Student",
                )}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl">
                {getTranslation(
                  translations,
                  "hero.description",
                  "I build intelligent management systems, automation tools, and AI/ML applications that save people time and simplify complex processes.",
                )}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="group">
                <Link href="#projects">
                  {getTranslation(translations, "hero.cta.projects", "See Projects")}
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild className="group bg-transparent">
                <Link href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                  {getTranslation(translations, "hero.cta.resume", "Download Resume")}
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-foreground">6+</div>
                <div className="text-sm text-muted-foreground">
                  {getTranslation(translations, "hero.stats.projects", "Projects")}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">3+</div>
                <div className="text-sm text-muted-foreground">
                  {getTranslation(translations, "hero.stats.experience", "Years Experience")}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">AI/ML</div>
                <div className="text-sm text-muted-foreground">
                  {getTranslation(translations, "hero.stats.specialization", "Specialization")}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-96 h-96 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border">
                <img
                  src="/placeholder.jpg?key=8aw7l"
                  alt="Alejandro Repetto - Systems Engineer"
                  className="w-11/12 h-11/12 rounded-xl object-cover"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-lg p-3 shadow-lg">
                <div className="text-xs text-muted-foreground">
                  {getTranslation(translations, "hero.status.currently", "Currently")}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {getTranslation(translations, "hero.status.building", "Building AI Solutions")}
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-lg p-3 shadow-lg">
                <div className="text-xs text-muted-foreground">
                  {getTranslation(translations, "hero.status.focus", "Focus")}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {getTranslation(translations, "hero.status.automation", "Automation & ML")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-16">
          <Link href="#about" className="group">
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
