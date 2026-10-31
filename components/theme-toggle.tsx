"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [translations] = useTranslations()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className="size-11 p-0 md:size-9"
        aria-label={getTranslation(translations, "a11y.toggleTheme")}
      >
        <span className="sr-only">{getTranslation(translations, "a11y.toggleTheme")}</span>
      </Button>
    )
  }

  const nextTheme = theme === "dark" ? "light" : "dark"
  const nextLabel =
    nextTheme === "light"
      ? getTranslation(translations, "a11y.switchToLight")
      : getTranslation(translations, "a11y.switchToDark")

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(nextTheme)}
      className="size-11 p-0 md:size-9"
      aria-label={nextLabel}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </Button>
  )
}
