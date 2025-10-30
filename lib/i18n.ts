"use client"

import { useRouter } from "next/router"
import { useState, useEffect } from "react"

export interface Translations {
  [key: string]: any
}

// Hook to get translations
export function useTranslations(): [Translations, string, boolean] {
  const router = useRouter()
  const [translations, setTranslations] = useState<Translations>({})
  const [loading, setLoading] = useState(true)

  const locale = router.locale || "en"

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/locales/${locale}/common.json`)
        const data = await response.json()
        setTranslations(data)
      } catch (error) {
        console.error("Error loading translations:", error)
        // Fallback to English if translation fails
        if (locale !== "en") {
          try {
            const fallbackResponse = await fetch("/locales/en/common.json")
            const fallbackData = await fallbackResponse.json()
            setTranslations(fallbackData)
          } catch (fallbackError) {
            console.error("Error loading fallback translations:", fallbackError)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    loadTranslations()
  }, [locale])

  return [translations, locale, loading]
}

// Helper function to get nested translation values
export function getTranslation(translations: Translations, key: string, fallback?: string): string {
  const keys = key.split(".")
  let value = translations

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      return fallback || key
    }
  }

  return typeof value === "string" ? value : fallback || key
}

// Helper function to get locale-specific resume URL
export function getResumeUrl(locale: string): string {
  return locale === "es" ? "/resume-es.pdf" : "/resume-en.pdf"
}

// Helper function to switch locale and persist preference
export function switchLocale(router: any, newLocale: string) {
  // Store locale preference in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("preferred-locale", newLocale)
  }

  // Navigate to the same page with new locale
  const { pathname, asPath, query } = router
  router.push({ pathname, query }, asPath, { locale: newLocale })
}

// Helper function to get stored locale preference
export function getStoredLocale(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("preferred-locale")
  }
  return null
}
