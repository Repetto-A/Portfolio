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
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className={cn(
              "sprint-display text-lg text-foreground transition-[color,opacity] duration-100 hover:text-[var(--sprint-accent)]",
              hideBrandForDock && "opacity-0"
            )}
          >
            <span ref={registerNavTitleRef}>Alejandro Repetto</span>
          </Link>

          <div className="hidden items-center space-x-4 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
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

          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <LanguageSwitcher />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="h-9 w-9 p-0"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {isOpen ? (
          <div className="md:hidden">
            <div className="space-y-1 border-t border-border bg-background px-2 pt-2 pb-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
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
