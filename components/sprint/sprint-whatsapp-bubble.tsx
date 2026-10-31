"use client"

import { CTA_COPY, WHATSAPP_URL } from "@/lib/sprint/constants"
import { captureCTA } from "@/lib/sprint/analytics"
import { WhatsAppIcon } from "./whatsapp-icon"

/**
 * Burbuja de WhatsApp en desktop. En mobile el siguiente paso
 * vive en SprintContactDock (Agendar + WhatsApp), para no apilar dos fijos.
 */
export function SprintWhatsAppBubble() {
  return (
    <div
      className="pointer-events-none fixed z-40 hidden print:hidden sm:flex"
      style={{
        right: "max(0.75rem, env(safe-area-inset-right))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={CTA_COPY.whatsappAria}
        onClick={() => captureCTA("cta_whatsapp_click", { location: "fab" })}
        className="pointer-events-auto group flex items-center gap-2.5 rounded-2xl focus-visible:outline-none"
      >
        <span
          aria-hidden
          className="sprint-wa-chip hidden whitespace-nowrap rounded-2xl border border-border bg-card px-3 py-2 text-xs font-medium leading-snug text-foreground shadow-md sm:inline"
        >
          {CTA_COPY.whatsappAria}
        </span>
        <span className="relative flex size-14 shrink-0 items-center justify-center">
          <span
            className="sprint-wa-pulse pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
            aria-hidden
          />
          <span
            className="sprint-wa-pulse sprint-wa-pulse-delay pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
            aria-hidden
          />
          <span
            className="sprint-wa-fab relative z-[1] flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-1 ring-black/10 transition-[filter,transform] duration-200 ease-out group-hover:brightness-110 group-active:scale-[0.98] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[var(--sprint-accent)]"
            aria-hidden
          >
            <WhatsAppIcon />
          </span>
        </span>
      </a>
    </div>
  )
}
