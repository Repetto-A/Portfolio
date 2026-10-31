"use client"

import React from "react"

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

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  subject: z.string().min(1).max(200),
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
    formState: { isValid, errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken || "",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        }),
        credentials: "same-origin",
        signal: AbortSignal.timeout(15000),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        reset()
      } else {
        setSubmitStatus("error")
        setServerError(result.error || null)
      }
    } catch {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = isValid

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
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {getTranslation(translations, "contact.companies")}{" "}
                <Link href="/sprint" className="text-foreground underline-offset-4 hover:underline">
                  {getTranslation(translations, "contact.companiesCta")}
                </Link>
              </p>

              <Link
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                {getTranslation(translations, "hero.cta.resume")}
              </Link>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {getTranslation(translations, "contact.methods.email")}
                  </div>
                  <Link
                    href="mailto:contact@repetto-a.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    contact@repetto-a.com
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Linkedin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">LinkedIn</div>
                  <Link
                    href="https://www.linkedin.com/in/alejandro-repetto"
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
                  <Github className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">GitHub</div>
                  <Link
                    href="https://github.com/Repetto-A"
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
                  <MapPin className="h-5 w-5 text-primary" />
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
                  <Clock className="h-5 w-5 text-primary" />
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
                      {getTranslation(translations, "contact.availability.consulting")}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {getTranslation(translations, "contact.availability.available")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {getTranslation(translations, "contact.availability.freelance")}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
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
                <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
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
                      {...register("name")}
                      placeholder={getTranslation(translations, "contact.form.namePlaceholder")}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {getTranslation(translations, "contact.form.email")} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder={getTranslation(translations, "contact.form.emailPlaceholder")}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">
                    {getTranslation(translations, "contact.form.subject")} *
                  </Label>
                  <Input
                    id="subject"
                    {...register("subject")}
                    placeholder={getTranslation(translations, "contact.form.subjectPlaceholder")}
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    {getTranslation(translations, "contact.form.message")} *
                  </Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    rows={5}
                    placeholder={getTranslation(translations, "contact.form.messagePlaceholder")}
                  />
                  <p className="text-xs text-muted-foreground">
                    {messageValue.length}/5000{" "}
                    {getTranslation(translations, "contact.form.characters")}
                  </p>
                  {errors.message && (
                    <p className="text-xs text-destructive">{errors.message.message}</p>
                  )}
                </div>

                {submitStatus === "success" && (
                  <div
                    className="p-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-md text-sm flex items-center space-x-2"
                    aria-live="polite"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>{getTranslation(translations, "contact.successMessage")}</span>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div
                    className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-md text-sm flex items-center space-x-2"
                    aria-live="polite"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      {serverError || getTranslation(translations, "contact.errorMessage")}
                    </span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? (
                    <span className="animate-pulse">
                      {getTranslation(translations, "contact.form.sending")}
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
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
