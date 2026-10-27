import type { CTALocation } from "./constants"

type SprintEvent = "cta_calendly_click" | "cta_checklist_click" | "cta_email_click"

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void
    }
  }
}

// Stub hasta M4 (PostHog). Los eventos ya quedan instrumentados en los CTAs.
export function captureCTA(event: SprintEvent, props: { location: CTALocation }) {
  if (typeof window !== "undefined" && window.posthog) {
    window.posthog.capture(event, props)
  }
}
