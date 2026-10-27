"use client"

import type { ReactNode } from "react"
import { Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { CONTACT_EMAIL, type CTALocation } from "@/lib/sprint/constants"
import { captureCTA } from "@/lib/sprint/analytics"
import { SprintCalendlyButton } from "./sprint-calendly-button"

interface SprintDirectContactProps {
  location: CTALocation
  calendlyLabel?: ReactNode
  className?: string
}

/**
 * Contacto directo visible: Calendly + email.
 * WhatsApp vive en la burbuja flotante (SprintWhatsAppBubble).
 */
export function SprintDirectContact({
  location,
  calendlyLabel,
  className,
}: SprintDirectContactProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center", className)}>
      {calendlyLabel ? (
        <SprintCalendlyButton location={location} className="w-full justify-center sm:w-auto">
          {calendlyLabel}
        </SprintCalendlyButton>
      ) : (
        <SprintCalendlyButton location={location} className="w-full justify-center sm:w-auto" />
      )}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        onClick={() => captureCTA("cta_email_click", { location })}
        className="inline-flex min-h-[44px] w-fit items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium transition-[border-color,background-color,color,transform] duration-200 ease-out hover:border-foreground/40 hover:bg-muted/50 active:scale-[0.98]"
      >
        <Mail className="size-4 shrink-0" aria-hidden />
        {CONTACT_EMAIL}
      </a>
    </div>
  )
}
