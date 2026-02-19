"use client"

import React from "react"

import { useState } from "react"
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

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactSection() {
  const [translations, locale] = useTranslations()
  const resumeUrl = getResumeUrl(locale)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const isFormValid = formData.name && formData.email && formData.subject && formData.message

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                {getTranslation(translations, "contact.info.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {getTranslation(
                  translations,
                  "contact.info.description",
                  "I'm always interested in discussing new opportunities, whether it's a challenging systems engineering project, AI/ML implementation, or automation solution. Feel free to reach out through any of the channels below."
                )}
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
                    href="mailto:repettoalejandroing@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    repettoalejandroing@gmail.com
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
                  {getTranslation(
                    translations,
                    "contact.availability.title",
                    "Current Availability"
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {getTranslation(
                        translations,
                        "contact.availability.consulting",
                        "Consulting"
                      )}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {getTranslation(translations, "contact.availability.available")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {getTranslation(
                        translations,
                        "contact.availability.freelance",
                        "Freelance Projects"
                      )}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {getTranslation(translations, "contact.availability.available")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {getTranslation(
                        translations,
                        "contact.availability.fulltime",
                        "Full-time Opportunities"
                      )}
                    </span>
                    <span className="text-primary font-medium">
                      {getTranslation(
                        translations,
                        "contact.availability.discuss",
                        "Open to Discuss"
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {getTranslation(translations, "contact.form.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {getTranslation(translations, "contact.form.name")} *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      placeholder={getTranslation(
                        translations,
                        "contact.form.namePlaceholder",
                        "Your name"
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {getTranslation(translations, "contact.form.email")} *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={getTranslation(
                        translations,
                        "contact.form.emailPlaceholder",
                        "your.email@example.com"
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">
                    {getTranslation(translations, "contact.form.subject")} *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    placeholder={getTranslation(
                      translations,
                      "contact.form.subjectPlaceholder",
                      "Project inquiry, collaboration, etc."
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    {getTranslation(translations, "contact.form.message")} *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={5000}
                    rows={5}
                    placeholder={getTranslation(
                      translations,
                      "contact.form.messagePlaceholder",
                      "Tell me about your project or how I can help you..."
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.message.length}/5000{" "}
                    {getTranslation(translations, "contact.form.characters")}
                  </p>
                </div>

                {submitStatus === "success" && (
                  <div
                    className="p-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-md text-sm flex items-center space-x-2"
                    aria-live="polite"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>
                      {getTranslation(
                        translations,
                        "contact.successMessage",
                        "Message sent successfully! I'll get back to you soon."
                      )}
                    </span>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div
                    className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-md text-sm flex items-center space-x-2"
                    aria-live="polite"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      {getTranslation(
                        translations,
                        "contact.errorMessage",
                        "Error sending message. Please try again."
                      )}
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
      </div>
    </section>
  )
}
