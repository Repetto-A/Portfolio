"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Linkedin, Github, Send, MapPin, Shield } from "lucide-react"
import Link from "next/link"

interface CaptchaData {
  question: string
  token: string
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [captcha, setCaptcha] = useState<CaptchaData | null>(null)
  const [captchaAnswer, setCaptchaAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Load CAPTCHA on component mount
  useEffect(() => {
    loadCaptcha()
  }, [])

  const loadCaptcha = async () => {
    try {
      const response = await fetch("/api/contact")
      if (response.ok) {
        const data = await response.json()
        setCaptcha(data.captcha)
      }
    } catch (error) {
      console.error("Failed to load CAPTCHA:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          captchaToken: captcha?.token,
          captchaAnswer: Number.parseInt(captchaAnswer, 10),
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", subject: "", message: "" })
        setCaptchaAnswer("")
        loadCaptcha() // Load new CAPTCHA
      } else {
        setSubmitStatus("error")
        setErrorMessage(result.error || "Failed to send message")
        if (result.error?.includes("CAPTCHA")) {
          loadCaptcha() // Reload CAPTCHA on CAPTCHA error
        }
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Ready to collaborate on your next systems engineering project? Let's discuss how we can build something
            amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">Let's Connect</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                I'm always interested in discussing new opportunities, whether it's a challenging systems engineering
                project, AI/ML implementation, or automation solution. Feel free to reach out through any of the
                channels below.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Email</div>
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
                  <div className="font-medium text-foreground">Location</div>
                  <span className="text-muted-foreground">Argentina</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Freelance Projects</span>
                    <span className="text-slate-600 font-medium">Available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Full-time Opportunities</span>
                    <span className="text-indigo-600 font-medium">Open to Discuss</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Consulting</span>
                    <span className="text-slate-600 font-medium">Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    placeholder="Project inquiry, collaboration, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={5000}
                    rows={5}
                    placeholder="Tell me about your project or how I can help..."
                  />
                </div>

                {captcha && (
                  <div className="space-y-2">
                    <Label htmlFor="captcha" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Security Check: {captcha.question}
                    </Label>
                    <Input
                      id="captcha"
                      type="number"
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      required
                      placeholder="Enter the answer"
                      className="max-w-32"
                    />
                  </div>
                )}

                {submitStatus === "success" && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-600 text-sm">Message sent successfully! I'll get back to you soon.</p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-600 text-sm">
                      {errorMessage ||
                        "There was an error sending your message. Please try again or contact me directly via email."}
                    </p>
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting || !captcha} className="w-full">
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
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
