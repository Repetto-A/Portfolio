"use client"

import { usePathname } from "next/navigation"

export function SkipLink() {
  const pathname = usePathname()
  const isSprint = (pathname?.replace(/\/+$/, "") || "/") === "/sprint"

  return (
    <a href="#main-content" className="skip-to-main">
      {isSprint ? "Saltar al contenido principal" : "Skip to main content"}
    </a>
  )
}
