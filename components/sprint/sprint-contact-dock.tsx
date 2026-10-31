"use client"

import { useLayoutEffect, useState } from "react"
import { CTA_COPY, WHATSAPP_URL } from "@/lib/sprint/constants"
import { captureCTA } from "@/lib/sprint/analytics"
import { SprintCalendlyButton } from "./sprint-calendly-button"
import { WhatsAppIcon } from "./whatsapp-icon"

/**
 * Barra fija en mobile: el mismo siguiente paso que el resto de la página.
 * Aparece cuando el hero ya no está a la vista. Sigue el tema de /sprint.
 */
export function SprintContactDock() {
  const [visible, setVisible] = useState(false)

  useLayoutEffect(() => {
    const hero = document.querySelector("[data-sprint-hero]")
    const finale = document.querySelector("#agendar")
    let heroVisible = Boolean(hero)
    let finaleVisible = false

    const update = () => setVisible(!heroVisible && !finaleVisible)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.hasAttribute("data-sprint-hero")) {
            heroVisible = entry.isIntersecting
          } else if (entry.target.id === "agendar") {
            finaleVisible = entry.isIntersecting
          }
        }
        update()
      },
      { threshold: 0.12 }
    )

    if (hero) observer.observe(hero)
    if (finale) observer.observe(finale)
    if (!hero) update()
    return () => observer.disconnect()
  }, [])

  if (!visible) return null

  return (
    <div
      id="sprint-contact-dock"
      className="sprint-contact-dock pointer-events-none fixed inset-x-0 bottom-0 z-40 sm:hidden print:hidden"
    >
      <div
        className="pointer-events-auto border-t border-border bg-background/92 backdrop-blur-md"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-3 pt-2">
          <SprintCalendlyButton location="sticky" className="min-h-11 flex-1 px-3 py-2.5 sm:px-3">
            {CTA_COPY.primary}
          </SprintCalendlyButton>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={CTA_COPY.whatsappAria}
            onClick={() => captureCTA("cta_whatsapp_click", { location: "sticky" })}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border text-[#25D366] transition-[border-color,background-color,transform] duration-200 ease-out hover:border-foreground/40 hover:bg-muted/50 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sprint-accent)]"
          >
            <WhatsAppIcon className="size-5" />
          </a>
        </div>
      </div>
    </div>
  )
}
