"use client"

import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

export function Footer() {
  const [translations] = useTranslations()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="sprint-display text-base text-foreground">Alejandro Repetto</p>
            <p className="mt-1 text-xs text-muted-foreground">
              © {currentYear} · {getTranslation(translations, "footer.rights")}
            </p>
            <Link
              href="/sprint"
              className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <span aria-hidden className="h-px w-6 bg-[var(--sprint-accent)]" />
              {getTranslation(translations, "footer.sprint")}
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="https://github.com/Repetto-A"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
              aria-label="Visit GitHub profile"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>

            <Link
              href="https://www.linkedin.com/in/alejandro-repetto"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
              aria-label="Visit LinkedIn profile"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>

            <Link
              href="mailto:contact@repetto-a.com"
              className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
              aria-label="Send email"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
