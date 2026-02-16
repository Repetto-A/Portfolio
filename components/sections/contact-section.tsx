"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Linkedin, Github, Send, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactSection() {
  const [translations, locale, loading] = useTranslations()

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

      const result = await response.json()

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
                {getTranslation(translations, "contact.info.title", "Let's Connect")}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {getTranslation(
                  translations,
                  "contact.info.description",
                  "I'm always interested in discussing new opportunities, whether it's a challenging systems engineering project, AI/ML implementation, or automation solution. Feel free to reach out through any of the channels below.",
                )}
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {getTranslation(translations, "contact.methods.email", "Email")}
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
                    {getTranslation(translations, "contact.methods.location", "Location")}
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
                    {getTranslation(translations, "contact.methods.timezone", "Timezone")}
                  </div>
                  <span className="text-muted-foreground">UTC-3 (Argentina)</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {getTranslation(translations, "contact.availability.title", "Current Availability")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {getTranslation(translations, "contact.availability.consulting", "Consulting")}
                    </span>
                    <span className="text-slate-600 font-medium">
                      {getTranslation(translations, "contact.availability.available", "Available")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {getTranslation(translations, "contact.availability.freelance", "Freelance Projects")}
                    </span>
                    <span className="text-slate-600 font-medium">
                      {getTranslation(translations, "contact.availability.available", "Available")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {getTranslation(translations, "contact.availability.fulltime", "Full-time Opportunities")}
                    </span>
                    <span className="text-indigo-600 font-medium">
                      {getTranslation(translations, "contact.availability.discuss", "Open to Discuss")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>{getTranslation(translations, "contact.form.title", "Send a Message")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{getTranslation(translations, "contact.form.name", "Name")} *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      placeholder={getTranslation(translations, "contact.form.namePlaceholder", "Your name")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{getTranslation(translations, "contact.form.email", "Email")} *</Label>
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
                        "your.email@example.com",
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{getTranslation(translations, "contact.form.subject", "Subject")} *</Label>
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
                      "Project inquiry, collaboration, etc.",
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{getTranslation(translations, "contact.form.message", "Message")} *</Label>
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
                      "Tell me about your project or how I can help you...",
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.message.length}/5000{" "}
                    {getTranslation(translations, "contact.form.characters", "characters")}
                  </p>
                </div>

                {submitStatus === "success" && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>
                      {getTranslation(
                        translations,
                        "contact.successMessage",
                        "Message sent successfully! I'll get back to you soon.",
                      )}
                    </span>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      {getTranslation(translations, "contact.errorMessage", "Error sending message. Please try again.")}
                    </span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? (
                    <span className="animate-pulse">
                      {getTranslation(translations, "contact.form.sending", "Sending...")}
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {getTranslation(translations, "contact.form.send", "Send Message")}
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
