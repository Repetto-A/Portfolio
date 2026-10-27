"use client"

import { WHATSAPP_URL } from "@/lib/sprint/constants"
import { captureCTA } from "@/lib/sprint/analytics"

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"
      />
    </svg>
  )
}

/**
 * Botón fijo de WhatsApp en /sprint (estilo elcerokm: abajo a la derecha,
 * pulso sutil, mensajito al lado). z-40 para quedar bajo los modales.
 */
export function SprintWhatsAppBubble() {
  return (
    <div
      className="pointer-events-none fixed z-40 flex print:hidden"
      style={{
        right: "max(0.75rem, env(safe-area-inset-right))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hablemos por WhatsApp"
        onClick={() => captureCTA("cta_whatsapp_click", { location: "fab" })}
        className="pointer-events-auto group flex flex-col items-end gap-2 rounded-2xl focus-visible:outline-none sm:flex-row sm:items-center sm:gap-2.5"
      >
        <span
          aria-hidden
          className="max-w-[min(12.5rem,calc(100vw-5.5rem))] rounded-2xl border border-border bg-card px-3 py-2 text-left text-xs font-medium leading-snug text-foreground shadow-md sm:max-w-none sm:whitespace-nowrap"
        >
          Hablemos por WhatsApp
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
            className="relative z-[1] flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-1 ring-black/10 transition-[filter,transform] duration-200 ease-out group-hover:brightness-110 group-active:scale-[0.98] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[var(--sprint-accent)] dark:ring-white/20"
            aria-hidden
          >
            <WhatsAppIcon />
          </span>
        </span>
      </a>
    </div>
  )
}
