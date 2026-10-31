"use client"

import { useLayoutEffect } from "react"
import type { SprintTheme } from "@/lib/sprint/theme"

function applySprintHtmlTheme(theme: SprintTheme) {
  const root = document.documentElement
  root.classList.remove("light", "dark", "sprint-light")
  root.classList.add(theme)
  if (theme === "light") root.classList.add("sprint-light")
  root.style.colorScheme = theme
  root.lang = "es"
}

function restoreUserHtmlTheme() {
  const root = document.documentElement
  root.classList.remove("sprint-light")
  let restore: string | null = null
  try {
    restore = window.localStorage.getItem("theme")
  } catch {
    restore = null
  }
  if (!restore || restore === "system") restore = "dark"
  if (restore !== "light" && restore !== "dark") restore = "dark"
  root.classList.remove("light", "dark")
  root.classList.add(restore)
  root.style.colorScheme = restore
  let locale = "en"
  try {
    locale = window.localStorage.getItem("preferred-locale") || "en"
  } catch {
    locale = "en"
  }
  root.lang = locale === "es" ? "es" : "en"
}

/**
 * Fuerza el tema de /sprint en <html> para portales (dialog, tabs) y
 * variantes `dark:`. next-themes puede pisar la clase al hidratar: el
 * observer la vuelve a aplicar. Al salir de /sprint se restaura el tema
 * del resto del sitio.
 */
export function SprintThemeSync({ theme }: { theme: SprintTheme }) {
  useLayoutEffect(() => {
    let applying = false

    const apply = () => {
      if (applying) return
      applying = true
      applySprintHtmlTheme(theme)
      queueMicrotask(() => {
        applying = false
      })
    }

    apply()

    const root = document.documentElement
    const observer = new MutationObserver(() => {
      const hasTheme = root.classList.contains(theme)
      const hasSprintLight =
        theme === "light"
          ? root.classList.contains("sprint-light")
          : !root.classList.contains("sprint-light")
      if (!hasTheme || !hasSprintLight) apply()
    })
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    const retry = window.setTimeout(apply, 0)

    return () => {
      observer.disconnect()
      window.clearTimeout(retry)
      restoreUserHtmlTheme()
    }
  }, [theme])

  return null
}
