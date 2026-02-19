"use client"

import React, { createContext, useContext, useState, useEffect, useLayoutEffect, ReactNode } from "react"
import en from "@/public/locales/en/common.json"
import es from "@/public/locales/es/common.json"

export type Translations = typeof en

const TRANSLATIONS: Record<string, Translations> = { en, es }

interface I18nContextType {
  translations: Translations
  locale: string
  setLocale: (locale: string) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Runs synchronously before paint on client, falls back to useEffect on server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<string>("en")

  // Read stored locale before first paint (never runs on server)
  useIsomorphicLayoutEffect(() => {
    const stored = localStorage.getItem("preferred-locale")
    if (stored && stored in TRANSLATIONS) {
      setLocaleState(stored)
    }
  }, [])

  const translations = TRANSLATIONS[locale] ?? en

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale)
    localStorage.setItem("preferred-locale", newLocale)
  }

  return (
    <I18nContext.Provider value={{ translations, locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

// Hook to use translations
export function useTranslations(): [Translations, string] {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useTranslations must be used within I18nProvider")
  }
  return [context.translations, context.locale]
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
export function getTranslation(translations: Translations, key: string): string {
  const keys = key.split(".")
  let value: unknown = translations

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return ""
    }
  }

  return typeof value === "string" ? value : ""
}

// Helper function to get locale-specific resume URL
export function getResumeUrl(locale: string): string {
  return locale === "es" ? "/resume-es.pdf" : "/resume-en.pdf"
}
