"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Mail,
  Linkedin,
  Github,
  Send,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react"
import Link from "next/link"
import { useTranslations, getTranslation, getResumeUrl } from "@/lib/i18n-context"
import { SectionHeader } from "@/components/layout/section-header"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { SprintCalendlyButton } from "@/components/sprint/sprint-calendly-button"
import { WhatsAppIcon } from "@/components/sprint/whatsapp-icon"
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  GITHUB_URL,
  LINKEDIN_URL,
  WHATSAPP_URL,
} from "@/lib/sprint/constants"
import { captureCTA } from "@/lib/sprint/analytics"
import { interestSubject, postContactMessage } from "@/lib/contact-client"
import {
  CONTACT_INTEREST_ENUM,
  CONTACT_INTEREST_LABELS,
  CONTACT_INTEREST_VALUES,
  type ContactInterest,
} from "@/lib/sprint/offer"

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  interest: z.enum(CONTACT_INTEREST_ENUM),
  message: z.string().min(1).max(5000),
  honeypot: z.string().max(0),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactSection() {
  const [translations, locale] = useTranslations()
  const resumeUrl = getResumeUrl(locale)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [serverError, setServerError] = useState<string | null>(null)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      interest: "charla",
      message: "",
      honeypot: "",
    },
  })

  const messageValue = watch("message") || ""

  useEffect(() => {
    fetch("/api/csrf", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.token))
      .catch(() => setCsrfToken("fallback"))
  }, [])

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setServerError(null)

    try {
      const result = await postContactMessage(
        {
          name: data.name,
          email: data.email,
          subject: interestSubject(data.interest, locale === "es" ? "es" : "en"),
          message: data.message,
          interest: data.interest,
        },
        csrfToken
      )

      if (result.ok) {
        setSubmitStatus("success")
        reset()
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
    <Section id="contact" variant="muted" spacing="relaxed">
      <Container maxWidth="7xl">
        <SectionHeader
          title={getTranslation(translations, "navigation.contact")}
          eyebrow={getTranslation(translations, "contact.eyebrow")}
        />
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                {getTranslation(translations, "contact.info.title")}
              </h3>
              <p className="mb-4 leading-relaxed text-muted-foreground">
                {getTranslation(translations, "contact.info.description")}
              </p>
              <div className="mb-6 rounded-xl border border-border bg-card p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <SprintCalendlyButton location="home-contact" className="w-full sm:w-auto">
                    {getTranslation(translations, "contact.talk")}
                  </SprintCalendlyButton>
                  <a
                    href={CONTACT_MAILTO}
                    onClick={() => captureCTA("cta_email_click", { location: "home-contact" })}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium transition-[border-color,background-color,color,transform] duration-200 ease-out hover:border-foreground/40 hover:bg-muted/50 active:scale-[0.98] sm:w-auto"
                  >
                    <Mail className="size-4 shrink-0" aria-hidden />
                    {getTranslation(translations, "contact.write")}
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => captureCTA("cta_whatsapp_click", { location: "home-contact" })}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium transition-[border-color,background-color,color,transform] duration-200 ease-out hover:border-foreground/40 hover:bg-muted/50 active:scale-[0.98] sm:w-auto"
                  >
                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                    {getTranslation(translations, "contact.whatsapp")}
                  </a>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {getTranslation(translations, "contact.talkHint")}
                </p>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {getTranslation(translations, "contact.companies")}{" "}
                <Link href="/sprint" className="text-foreground underline underline-offset-4">
                  {getTranslation(translations, "contact.companiesCta")}
                </Link>
              </p>

              <Link
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-8 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                <Download className="h-4 w-4" aria-hidden />
                {getTranslation(translations, "hero.cta.resume")}
              </Link>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {getTranslation(translations, "contact.methods.email")}
                  </div>
                  <Link
                    href={CONTACT_MAILTO}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Linkedin className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div>
                  <div className="font-medium text-foreground">LinkedIn</div>
                  <Link
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    linkedin.com/in/alejandro-repetto
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Github className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div>
                  <div className="font-medium text-foreground">GitHub</div>
                  <Link
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    github.com/Repetto-A
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {getTranslation(translations, "contact.methods.location")}
                  </div>
                  <span className="text-muted-foreground">Argentina</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {getTranslation(translations, "contact.methods.timezone")}
                  </div>
                  <span className="text-muted-foreground">UTC-3 (Argentina)</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {getTranslation(translations, "contact.availability.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {getTranslation(translations, "contact.availability.talk")}
                    </span>
                    <span className="font-medium text-emerald-800 dark:text-emerald-300">
                      {getTranslation(translations, "contact.availability.talkStatus")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {getTranslation(translations, "contact.availability.consulting")}
                    </span>
                    <span className="font-medium text-emerald-800 dark:text-emerald-300">
                      {getTranslation(translations, "contact.availability.available")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {getTranslation(translations, "contact.availability.freelance")}
                    </span>
                    <span className="font-medium text-emerald-800 dark:text-emerald-300">
                      {getTranslation(translations, "contact.availability.available")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {getTranslation(translations, "contact.availability.fulltime")}
                    </span>
                    <span className="text-primary font-medium">
                      {getTranslation(translations, "contact.availability.discuss")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>{getTranslation(translations, "contact.form.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* Honeypot - hidden from humans */}
                <div className="hidden" hidden>
                  <Label htmlFor="honeypot">Leave empty</Label>
                  <Input id="honeypot" {...register("honeypot")} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {getTranslation(translations, "contact.form.name")} *
                    </Label>
                    <Input
                      id="name"
                      autoComplete="name"
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      {...register("name")}
                      placeholder={getTranslation(translations, "contact.form.namePlaceholder")}
                    />
                    {errors.name ? (
                      <p id="contact-name-error" className="text-xs text-destructive" role="alert">
                        {errors.name.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {getTranslation(translations, "contact.form.email")} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      inputMode="email"
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      {...register("email")}
                      placeholder={getTranslation(translations, "contact.form.emailPlaceholder")}
                    />
                    {errors.email ? (
                      <p id="contact-email-error" className="text-xs text-destructive" role="alert">
                        {errors.email.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interest">
                    {getTranslation(translations, "contact.form.interest")} *
                  </Label>
                  <select
                    id="interest"
                    className="border-input bg-background text-foreground dark:bg-input/30 flex min-h-11 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive"
                    aria-invalid={errors.interest ? true : undefined}
                    aria-describedby={errors.interest ? "contact-interest-error" : undefined}
                    {...register("interest")}
                  >
                    <option value="" disabled>
                      {getTranslation(translations, "contact.form.interestPlaceholder")}
                    </option>
                    {CONTACT_INTEREST_VALUES.map((value) => (
                      <option key={value} value={value}>
                        {
                          CONTACT_INTEREST_LABELS[value as ContactInterest][
                            locale === "es" ? "es" : "en"
                          ]
                        }
                      </option>
                    ))}
                  </select>
                  {errors.interest ? (
                    <p
                      id="contact-interest-error"
                      className="text-xs text-destructive"
                      role="alert"
                    >
                      {getTranslation(translations, "contact.form.interestRequired")}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    {getTranslation(translations, "contact.form.message")} *
                  </Label>
                  <Textarea
                    id="message"
                    autoComplete="off"
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={
                      errors.message
                        ? "contact-message-error contact-message-count"
                        : "contact-message-count"
                    }
                    {...register("message")}
                    rows={5}
                    placeholder={getTranslation(translations, "contact.form.messagePlaceholder")}
                  />
                  <p id="contact-message-count" className="text-xs text-muted-foreground">
                    {messageValue.length}/5000{" "}
                    {getTranslation(translations, "contact.form.characters")}
                  </p>
                  {errors.message ? (
                    <p id="contact-message-error" className="text-xs text-destructive" role="alert">
                      {errors.message.message}
                    </p>
                  ) : null}
                </div>

                {submitStatus === "success" && (
                  <div
                    className="p-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-md text-sm flex items-center space-x-2"
                    aria-live="polite"
                  >
                    <CheckCircle className="h-4 w-4" aria-hidden />
                    <span>{getTranslation(translations, "contact.successMessage")}</span>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div
                    className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-md text-sm flex items-center space-x-2"
                    aria-live="polite"
                  >
                    <AlertCircle className="h-4 w-4" aria-hidden />
                    <span>
                      {serverError || getTranslation(translations, "contact.errorMessage")}
                    </span>
                  </div>
                )}

                <Button type="submit" className="min-h-11 w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="animate-pulse">
                      {getTranslation(translations, "contact.form.sending")}
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" aria-hidden />
                      {getTranslation(translations, "contact.form.send")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
