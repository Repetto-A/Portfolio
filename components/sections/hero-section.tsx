"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTranslations, getTranslation, getResumeUrl } from "@/lib/i18n-context"
import { useScrollContext } from "@/lib/scroll-context"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const [translations, locale] = useTranslations()
  const { registerHeroTitleRef, isFloatingTitleActive, fontsReady } = useScrollContext()
  const resumeUrl = getResumeUrl(locale)

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 overflow-hidden">
      {/* Subtle dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(oklch(0.52 0.22 263) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Top-right ambient glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/8 dark:bg-primary/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-5">
              <h1
                ref={registerHeroTitleRef}
                className={cn(
                  "font-mono font-semibold text-foreground leading-tight text-balance transition-opacity duration-100",
                  fontsReady && isFloatingTitleActive && "opacity-0"
                )}
                style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
              >
                {getTranslation(translations, "hero.name")}
              </h1>

              <h2
                className="font-mono text-primary font-medium"
                style={{ fontSize: "clamp(1rem, 2.2vw, 1.375rem)" }}
              >
                {getTranslation(translations, "hero.title")}
              </h2>

              <p
                className="text-muted-foreground leading-relaxed text-pretty max-w-lg"
                style={{ fontSize: "clamp(0.9375rem, 1.4vw, 1.0625rem)" }}
              >
                {(() => {
                  const desc = getTranslation(translations, "hero.description")
                  const [main, awards] = desc.split("\n")
                  return (
                    <>
                      {main}
                      {awards && (
                        <>
                          <br />
                          <Link
                            href="#awards"
                            className="underline-offset-4 decoration-primary/40 hover:underline hover:text-foreground transition-colors"
                          >
                            {awards}
                          </Link>
                        </>
                      )}
                    </>
                  )
                })()}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="group w-full sm:w-auto shadow-lg shadow-primary/20">
                <Link href="#projects">
                  {getTranslation(translations, "hero.cta.projects")}
                  <ArrowDown className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group w-full sm:w-auto"
              >
                <Link href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  {getTranslation(translations, "hero.cta.resume")}
                  <ExternalLink className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <div className="flex justify-center lg:justify-end order-first lg:order-last pt-6">
            <div className="relative w-full max-w-md lg:max-w-none aspect-square max-h-[40vh] sm:max-h-[50vh] lg:max-h-none">
              {/* Ambient glow behind image */}
              <div className="absolute -inset-6 bg-primary/10 dark:bg-primary/15 rounded-3xl blur-3xl pointer-events-none" />

              {/* Image container — edge-to-edge, clean */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border">
                <Image
                  src="/placeholder.jpg"
                  alt="Alejandro Repetto - Systems Engineer specializing in AI/ML and automation"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  quality={90}
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-primary/8 pointer-events-none" />
              </div>

              {/* Floating card — top right */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-card/95 border border-border rounded-xl p-2.5 sm:p-3 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {getTranslation(translations, "hero.status.currently")}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
                  {getTranslation(translations, "hero.status.building")}
                </div>
              </div>

              {/* Floating card — bottom left */}
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-card/95 border border-border rounded-xl p-2.5 sm:p-3 shadow-lg backdrop-blur-md">
                <div className="text-xs text-muted-foreground whitespace-nowrap mb-0.5">
                  {getTranslation(translations, "hero.status.focus")}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
                  {getTranslation(translations, "hero.status.automation")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-14 sm:mt-18">
          <Link href="#about" className="group" aria-label="Scroll to about section">
            <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200">
              <span className="text-xs tracking-widest uppercase font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                {getTranslation(translations, "hero.scroll")}
              </span>
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
