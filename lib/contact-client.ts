import { CONTACT_INTEREST_LABELS, type ContactInterest } from "@/lib/sprint/offer"

export type ContactPayload = {
  name: string
  email: string
  subject: string
  message: string
  interest: ContactInterest
}

export async function postContactMessage(
  payload: ContactPayload,
  csrfToken: string | null
): Promise<{ ok: boolean; error: string | null }> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken || "",
    },
    body: JSON.stringify(payload),
    credentials: "same-origin",
    signal: AbortSignal.timeout(15000),
  })

  const result = (await response.json()) as { error?: string }

  if (response.ok) {
    return { ok: true, error: null }
  }

  return { ok: false, error: result.error || null }
}

export function interestSubject(interest: ContactInterest, locale: "es" | "en"): string {
  if (interest === "charla") {
    return locale === "es" ? "Charla diagnóstico de 30 min" : "30-min diagnostic chat"
  }
  const label = CONTACT_INTEREST_LABELS[interest][locale]
  return locale === "es" ? `Charla diagnóstico · ${label}` : `Diagnostic chat · ${label}`
}
