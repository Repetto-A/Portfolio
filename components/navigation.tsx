"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTranslations, getTranslation } from "@/lib/i18n-context"
import { useScrollContext } from "@/lib/scroll-context"
import { cn } from "@/lib/utils"
import { SprintCalendlyButton } from "@/components/sprint/sprint-calendly-button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [translations] = useTranslations()
  const { registerNavTitleRef, scrollProgress, fontsReady, heroTitleRect } = useScrollContext()

  const navItems = [
    { href: "/#about", label: getTranslation(translations, "navigation.about") },
    { href: "/#projects", label: getTranslation(translations, "navigation.projects") },
    { href: "/sprint", label: getTranslation(translations, "navigation.sprint") },
    { href: "/#contact", label: getTranslation(translations, "navigation.contact") },
  ]

  const hideBrandForDock = heroTitleRect != null && !(fontsReady && scrollProgress >= 1)

  return (
    <nav
      aria-label={getTranslation(translations, "a11y.mainNav")}
      className="fixed top-0 z-50 w-full border-b border-border bg-background/95 pt-[env(safe-area-inset-top)] lg:bg-background/80 lg:backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className={cn(
              "sprint-display text-lg text-foreground transition-[color,opacity] duration-100 hover:text-[var(--sprint-accent)]",
              hideBrandForDock && "md:opacity-0"
            )}
          >
            <span ref={registerNavTitleRef}>Alejandro Repetto</span>
          </Link>

          <div className="hidden items-center space-x-4 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={item.href === "/sprint" ? false : undefined}
                className="text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}

            <SprintCalendlyButton location="home-nav" className="min-h-9 px-3.5 py-2 text-sm">
              {getTranslation(translations, "navigation.talk")}
            </SprintCalendlyButton>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <LanguageSwitcher />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="size-11 p-0"
              aria-label={getTranslation(translations, "a11y.toggleMenu")}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              {isOpen ? (
                <X className="h-4 w-4" aria-hidden />
              ) : (
                <Menu className="h-4 w-4" aria-hidden />
              )}
              <span className="sr-only">{getTranslation(translations, "a11y.toggleMenu")}</span>
            </Button>
          </div>
        </div>

        {isOpen ? (
          <div className="md:hidden" id="mobile-nav">
            <div className="space-y-1 border-t border-border bg-background px-2 pt-2 pb-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={item.href === "/sprint" ? false : undefined}
                  className="block min-h-11 px-3 py-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 pt-2 pb-1">
                <SprintCalendlyButton
                  location="home-nav"
                  className="w-full justify-center px-3.5 py-2 text-sm"
                >
                  {getTranslation(translations, "navigation.talk")}
                </SprintCalendlyButton>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  )
}
