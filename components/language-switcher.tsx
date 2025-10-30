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

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-sm font-medium">
        <Globe className="h-4 w-4" />
        <span className="sr-only">Switch language</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLocaleSwitch}
      className="flex items-center space-x-1 text-sm font-medium"
      aria-label={`Switch to ${locale === "en" ? "Spanish" : "English"}`}
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">{locale === "en" ? "ES" : "EN"}</span>
      <span className="sm:hidden">{locale === "en" ? "ES" : "EN"}</span>
    </Button>
  )
}
