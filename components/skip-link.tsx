"use client"

import { usePathname } from "next/navigation"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

export function SkipLink() {
  const pathname = usePathname()
  const [translations] = useTranslations()
  const isSprint = (pathname?.replace(/\/+$/, "") || "/") === "/sprint"
  const label = isSprint
    ? "Saltar al contenido principal"
    : getTranslation(translations, "a11y.skipToMain")

  return (
    <a href="#main-content" className="skip-to-main">
      {label}
    </a>
  )
}
