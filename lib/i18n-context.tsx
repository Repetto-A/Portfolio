"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Translations {
  [key: string]: any
}

interface I18nContextType {
  translations: Translations
  locale: string
  loading: boolean
  setLocale: (locale: string) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<string>("en")
  const [translations, setTranslations] = useState<Translations>({})
  const [loading, setLoading] = useState(true)

  // Load translations when locale changes
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

  // Load stored locale preference on mount
  useEffect(() => {
    const storedLocale = localStorage.getItem("preferred-locale")
    if (storedLocale && (storedLocale === "en" || storedLocale === "es")) {
      setLocaleState(storedLocale)
    }
  }, [])

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale)
    localStorage.setItem("preferred-locale", newLocale)
  }

  return (
    <I18nContext.Provider value={{ translations, locale, loading, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

// Hook to use translations
export function useTranslations(): [Translations, string, boolean] {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useTranslations must be used within I18nProvider")
  }
  return [context.translations, context.locale, context.loading]
}

// Hook to get locale setter
export function useLocale() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useLocale must be used within I18nProvider")
  }
  return { locale: context.locale, setLocale: context.setLocale }
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
