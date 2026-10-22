import Link from "next/link"
import { SprintHero } from "@/components/sprint/sprint-hero"
import { SprintProblem } from "@/components/sprint/sprint-problem"
import { SprintPromise } from "@/components/sprint/sprint-promise"
import { SprintHowItWorks } from "@/components/sprint/sprint-how-it-works"
import { SprintDeliverables } from "@/components/sprint/sprint-deliverables"
import { SprintGovernance } from "@/components/sprint/sprint-governance"
import { SprintAudience } from "@/components/sprint/sprint-audience"
import { SprintFormats } from "@/components/sprint/sprint-formats"
import { SprintPricing } from "@/components/sprint/sprint-pricing"
import { SprintGuarantee } from "@/components/sprint/sprint-guarantee"
import { SprintAbout } from "@/components/sprint/sprint-about"
import { SprintPress } from "@/components/sprint/sprint-press"
import { SprintFaq } from "@/components/sprint/sprint-faq"
import { SprintCtaFinal } from "@/components/sprint/sprint-cta-final"
import { SprintCriaLink } from "@/components/sprint/sprint-ext-link"
import { SprintProofBand } from "@/components/sprint/sprint-proof-band"
import { SPRINT_ANCHORS } from "@/lib/sprint/constants"

export default function SprintPage() {
  return (
    <main>
      <nav className="absolute top-0 left-0 right-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-[var(--sprint-accent)]"
          >
            Alejandro Repetto
          </Link>
          <a
            href={`#${SPRINT_ANCHORS.cta}`}
            className="inline-flex items-center rounded-md border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-[border-color,color,transform] duration-200 ease-out hover:border-foreground/40 hover:text-foreground active:scale-[0.98]"
          >
            Agendar diagnóstico
          </a>
        </div>
      </nav>

      <SprintHero />

      <SprintProofBand />

      <div className="border-t border-border">
        <SprintProblem />
        <SprintPromise />
        <SprintHowItWorks />
        <SprintDeliverables />
        <SprintGovernance />
        <SprintAudience />
        <SprintFormats />
        <SprintPricing />
        <SprintGuarantee />
        <SprintAbout />
        <SprintPress />
        <SprintFaq />
        <SprintCtaFinal />
      </div>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Alejandro Repetto · En colaboración con{" "}
            <SprintCriaLink />
          </p>
          <Link
            href="/"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Ver portfolio
          </Link>
        </div>
      </footer>
    </main>
  )
}
