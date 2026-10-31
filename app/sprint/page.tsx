import type { Metadata } from "next"
import Link from "next/link"
import { SprintHero } from "@/components/sprint/sprint-hero"
import { SprintProblem } from "@/components/sprint/sprint-problem"
import { SprintHowItWorks } from "@/components/sprint/sprint-how-it-works"
import { SprintDeliverables } from "@/components/sprint/sprint-deliverables"
import { SprintGovernance } from "@/components/sprint/sprint-governance"
import { SprintAudience } from "@/components/sprint/sprint-audience"
import { SprintPricing } from "@/components/sprint/sprint-pricing"
import { SprintGuarantee } from "@/components/sprint/sprint-guarantee"
import { SprintAbout } from "@/components/sprint/sprint-about"
import { SprintPress } from "@/components/sprint/sprint-press"
import { SprintFaq } from "@/components/sprint/sprint-faq"
import { SprintCtaFinal } from "@/components/sprint/sprint-cta-final"
import { SprintCriaLink } from "@/components/sprint/sprint-ext-link"
import { SprintWhatsAppBubble } from "@/components/sprint/sprint-whatsapp-bubble"
import { SprintContactDock } from "@/components/sprint/sprint-contact-dock"
import { SprintThemeSync } from "@/components/sprint/sprint-theme-sync"
import { SprintClientsBand } from "@/components/sprint/sprint-clients-band"
import { SprintOfferLadder } from "@/components/sprint/sprint-offer-ladder"
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CTA_COPY,
  SHOW_SPRINT_PRICING,
} from "@/lib/sprint/constants"
import { SprintCalendlyButton } from "@/components/sprint/sprint-calendly-button"
import { getSprintTheme } from "@/lib/sprint/theme"
import { generateSprintPageGraph, sprintSeo } from "@/lib/seo"
import { JsonLd } from "@/components/json-ld"

type SprintPageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export function generateMetadata({ searchParams }: SprintPageProps): Metadata {
  if (getSprintTheme(searchParams) !== "light") return {}
  return {
    robots: { index: false, follow: true },
    alternates: {
      canonical: sprintSeo.canonical,
    },
  }
}

export default function SprintPage({ searchParams }: SprintPageProps) {
  const theme = getSprintTheme(searchParams)

  return (
    <div
      data-sprint-theme={theme}
      className="sprint-page min-h-screen bg-background text-foreground"
    >
      <JsonLd data={generateSprintPageGraph()} />
      <SprintThemeSync theme={theme} />
      <nav aria-label="Principal" className="absolute top-0 left-0 right-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 sm:py-7 lg:px-8">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center text-[13px] font-medium tracking-[0.01em] text-foreground transition-colors hover:text-[var(--sprint-accent)]"
          >
            Alejandro Repetto
          </Link>
          <SprintCalendlyButton location="nav" className="min-h-[44px] px-3.5 py-2 text-sm sm:px-4">
            {CTA_COPY.primary}
          </SprintCalendlyButton>
        </div>
      </nav>
      <main id="main-content">
        <SprintHero />

        <SprintClientsBand />

        <div className="border-t border-border">
          <SprintProblem />
          <SprintOfferLadder />
          <SprintAudience />
          <SprintHowItWorks />
          <SprintDeliverables />
          {/* Precios ocultos para la charla del 28/10. Reactivar con SHOW_SPRINT_PRICING. */}
          {SHOW_SPRINT_PRICING ? <SprintPricing /> : null}
          <SprintGovernance />
          <SprintAbout />
          <SprintPress />
          <SprintGuarantee />
          <SprintFaq />
          <SprintCtaFinal />
        </div>

        <footer className="border-t border-border pt-12 pb-28 sm:pt-14 sm:pb-12">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 sm:pl-6 sm:pr-64 lg:pl-8 lg:pr-64">
            {theme === "light" ? (
              <p className="sprint-kicker text-muted-foreground">
                Vista previa del tema claro. El default de /sprint sigue en oscuro.{" "}
                <Link href="/sprint" className="underline-offset-4 hover:underline">
                  Ver oscuro
                </Link>
              </p>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="sprint-index text-xs text-muted-foreground">
                © {new Date().getFullYear()} Alejandro Repetto · En colaboración con{" "}
                <SprintCriaLink />
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={CONTACT_MAILTO}
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                <Link
                  href="/"
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  Ver portfolio
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
      <SprintWhatsAppBubble />
      <SprintContactDock />
    </div>
  )
}
