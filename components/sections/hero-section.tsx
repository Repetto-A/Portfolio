"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useTranslations, getTranslation, getResumeUrl } from "@/lib/i18n-context"
import { ProfilePhoto } from "@/components/profile-photo"
import { useScrollContext } from "@/lib/scroll-context"
import { cn } from "@/lib/utils"
import { SprintCalendlyButton } from "@/components/sprint/sprint-calendly-button"

export function HeroSection() {
  const [translations, locale] = useTranslations()
  const { registerHeroTitleRef, isFloatingTitleActive, fontsReady } = useScrollContext()
  const resumeUrl = getResumeUrl(locale)

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--sprint-accent), transparent)" }}
      />

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="sprint-kicker text-[var(--sprint-accent)]">
                {getTranslation(translations, "hero.kicker")}
              </p>

              <h1
                ref={registerHeroTitleRef}
                className={cn(
                  "sprint-display whitespace-nowrap text-foreground transition-opacity duration-100",
                  fontsReady && isFloatingTitleActive && "opacity-0"
                )}
                style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
              >
                {getTranslation(translations, "hero.name")}
              </h1>

              <p className="text-base text-muted-foreground sm:text-lg">
                {getTranslation(translations, "hero.title")}
              </p>

              <p className="max-w-lg text-[1.0625rem] leading-[1.7] text-pretty text-muted-foreground">
                {(() => {
                  const desc = getTranslation(translations, "hero.description")
                  const [main, awards] = desc.split("\n")
                  return (
                    <>
                      {main}
                      {awards ? (
                        <>
                          <br />
                          <Link
                            href="#awards"
                            className="underline-offset-4 decoration-[var(--sprint-accent)]/40 transition-colors hover:underline hover:text-foreground"
                          >
                            {awards}
                          </Link>
                        </>
                      ) : null}
                    </>
                  )
                })()}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <SprintCalendlyButton location="home-hero" className="w-full sm:w-auto">
                {getTranslation(translations, "hero.cta.talk")}
              </SprintCalendlyButton>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group h-auto min-h-[44px] w-full border-border/60 sm:w-auto"
              >
                <Link href="/sprint">
                  {getTranslation(translations, "hero.cta.sprint")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>

            <Link
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {getTranslation(translations, "hero.cta.resume")}
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </Link>
          </div>

          <div className="order-first flex justify-center pt-6 lg:order-last lg:justify-end">
            <div className="relative aspect-square w-full max-h-[40vh] max-w-md sm:max-h-[50vh] lg:max-h-none lg:max-w-none">
              <div
                className="pointer-events-none absolute -inset-6 rounded-3xl blur-3xl"
                style={{
                  background: "color-mix(in oklab, var(--sprint-accent) 18%, transparent)",
                }}
              />

              <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border">
                <ProfilePhoto
                  alt="Alejandro Repetto, Software Engineer"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-transparent" />
              </div>

              <div className="absolute -top-3 -right-3 rounded-xl border border-border bg-card/95 p-2.5 shadow-lg backdrop-blur-md sm:-top-4 sm:-right-4 sm:p-3">
                <p className="sprint-index text-lg font-semibold tracking-tight text-[var(--sprint-accent)] sm:text-xl">
                  {getTranslation(translations, "hero.status.currently")}
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {getTranslation(translations, "hero.status.building")}
                </p>
              </div>

              <div className="absolute -bottom-3 -left-3 rounded-xl border border-border bg-card/95 p-2.5 shadow-lg backdrop-blur-md sm:-bottom-4 sm:-left-4 sm:p-3">
                <p className="sprint-kicker text-muted-foreground">
                  {getTranslation(translations, "hero.status.focus")}
                </p>
                <p className="mt-1 text-xs font-semibold text-foreground sm:text-sm">
                  {getTranslation(translations, "hero.status.automation")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex justify-center sm:mt-18">
          <Link href="#about" className="group" aria-label="Scroll to about section">
            <div className="flex flex-col items-center gap-0">
              <div className="h-8 w-px bg-border transition-colors duration-300 group-hover:bg-[var(--sprint-accent)]" />
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground transition-colors duration-300 group-hover:bg-[var(--sprint-accent)]" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
