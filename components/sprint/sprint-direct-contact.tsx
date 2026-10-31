"use client"

import type { ReactNode } from "react"
import { Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CTA_COPY,
  WHATSAPP_URL,
  type CTALocation,
} from "@/lib/sprint/constants"
import { captureCTA } from "@/lib/sprint/analytics"
import { SprintCalendlyButton } from "./sprint-calendly-button"
import { WhatsAppIcon } from "./whatsapp-icon"

interface SprintDirectContactProps {
  location: CTALocation
  calendlyLabel?: ReactNode
  className?: string
  showWhatsApp?: boolean
  hint?: boolean
}

/**
 * Camino de contacto único: Calendly (primario) + mail.
 * WhatsApp es opcional acá; en /sprint también vive en el dock mobile
 * y en la burbuja de desktop.
 */
export function SprintDirectContact({
  location,
  calendlyLabel,
  className,
  showWhatsApp = false,
  hint = false,
}: SprintDirectContactProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {hint ? (
        <p className="text-sm leading-relaxed text-muted-foreground">{CTA_COPY.hint}</p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {calendlyLabel ? (
          <SprintCalendlyButton location={location} className="w-full justify-center sm:w-auto">
            {calendlyLabel}
          </SprintCalendlyButton>
        ) : (
          <SprintCalendlyButton location={location} className="w-full justify-center sm:w-auto" />
        )}
        <a
          href={CONTACT_MAILTO}
          onClick={() => captureCTA("cta_email_click", { location })}
          className="inline-flex min-h-[44px] w-fit items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium transition-[border-color,background-color,color,transform] duration-200 ease-out hover:border-foreground/40 hover:bg-muted/50 active:scale-[0.98]"
        >
          <Mail className="size-4 shrink-0" aria-hidden />
          {CTA_COPY.secondary}
          <span className="sr-only"> a {CONTACT_EMAIL}</span>
        </a>
        {showWhatsApp ? (
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => captureCTA("cta_whatsapp_click", { location })}
            className="inline-flex min-h-[44px] w-fit items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium transition-[border-color,background-color,color,transform] duration-200 ease-out hover:border-foreground/40 hover:bg-muted/50 active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-4 text-[#25D366]" />
            {CTA_COPY.whatsapp}
          </a>
        ) : null}
      </div>
    </div>
  )
}
