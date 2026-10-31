"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Send, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { postContactMessage, interestSubject } from "@/lib/contact-client"
import {
  CONTACT_INTEREST_LABELS,
  CONTACT_INTEREST_VALUES,
  type ContactInterest,
} from "@/lib/sprint/offer"

const selectClassName =
  "border-input bg-background text-foreground dark:bg-input/30 flex min-h-11 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"

function isInterest(value: string): value is ContactInterest {
  return (CONTACT_INTEREST_VALUES as readonly string[]).includes(value)
}

export function SprintContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [serverError, setServerError] = useState<string | null>(null)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [interestError, setInterestError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/csrf", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data: { token?: string }) => setCsrfToken(data.token ?? "fallback"))
      .catch(() => setCsrfToken("fallback"))
  }, [])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const interest = String(data.get("interest") ?? "")
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const message = String(data.get("message") ?? "").trim()
    const honeypot = String(data.get("honeypot") ?? "")

    if (honeypot) return

    if (!isInterest(interest)) {
      setInterestError("Elegí qué te interesa")
      return
    }

    setInterestError(null)
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setServerError(null)

    try {
      const result = await postContactMessage(
        {
          name,
          email,
          interest,
          subject: interestSubject(interest, "es"),
          message,
        },
        csrfToken
      )

      if (result.ok) {
        setSubmitStatus("success")
        form.reset()
      } else {
        setSubmitStatus("error")
        setServerError(result.error)
      }
    } catch {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="hidden" hidden>
        <Label htmlFor="sprint-honeypot">Leave empty</Label>
        <Input id="sprint-honeypot" name="honeypot" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sprint-name">Nombre *</Label>
          <Input
            id="sprint-name"
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Tu nombre"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sprint-email">Email *</Label>
          <Input
            id="sprint-email"
            name="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            inputMode="email"
            required
            maxLength={254}
            placeholder="tu.email@empresa.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sprint-interest">Qué te interesa?</Label>
        <select
          id="sprint-interest"
          name="interest"
          required
          defaultValue=""
          className={selectClassName}
          aria-invalid={interestError ? true : undefined}
          aria-describedby={interestError ? "sprint-interest-error" : undefined}
          onChange={() => setInterestError(null)}
        >
          <option value="" disabled>
            Elegí una opción
          </option>
          {CONTACT_INTEREST_VALUES.map((value) => (
            <option key={value} value={value}>
              {CONTACT_INTEREST_LABELS[value].es}
            </option>
          ))}
        </select>
        {interestError ? (
          <p id="sprint-interest-error" className="text-xs text-destructive" role="alert">
            {interestError}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sprint-message">Mensaje *</Label>
        <Textarea
          id="sprint-message"
          name="message"
          autoComplete="off"
          rows={5}
          required
          maxLength={5000}
          placeholder="Contame de tu equipo y qué quieren ejecutar con IA."
        />
      </div>

      {submitStatus === "success" ? (
        <div
          className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950/30 dark:text-green-400"
          aria-live="polite"
        >
          <CheckCircle className="h-4 w-4 shrink-0" aria-hidden />
          <span>Mensaje enviado. Gracias por escribir.</span>
        </div>
      ) : null}

      {submitStatus === "error" ? (
        <div
          className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-400"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          <span>{serverError || "No se pudo enviar. Probá de nuevo o escribime por mail."}</span>
        </div>
      ) : null}

      <Button type="submit" className="min-h-11 w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="animate-pulse">Enviando...</span>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" aria-hidden />
            Enviar
          </>
        )}
      </Button>
    </form>
  )
}
