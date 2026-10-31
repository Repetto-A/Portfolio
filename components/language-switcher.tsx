"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useLocale } from "@/lib/i18n-context"
import { useEffect, useState } from "react"

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLocaleSwitch = () => {
    const newLocale = locale === "en" ? "es" : "en"
    setLocale(newLocale)
  }

  const nextLabel = locale === "en" ? "ES" : "EN"
  const nextName = locale === "en" ? "Spanish" : "English"

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className="flex min-h-11 items-center space-x-1 px-2 text-sm font-medium md:min-h-9"
        aria-label="Switch language"
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span className="sr-only">Switch language</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLocaleSwitch}
      className="flex min-h-11 items-center space-x-1 px-2 text-sm font-medium md:min-h-9"
    >
      <Globe className="h-4 w-4" aria-hidden />
      <span>{nextLabel}</span>
      <span className="sr-only">{`Switch to ${nextName}`}</span>
    </Button>
  )
}
