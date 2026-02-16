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

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [translations, locale, loading] = useTranslations()
  const { registerNavTitleRef, isFloatingTitleActive, scrollProgress, fontsReady, animationHasRun } = useScrollContext()

  const navItems = [
    { href: "#about", label: getTranslation(translations, "navigation.about", "About") },
    { href: "#projects", label: getTranslation(translations, "navigation.projects", "Projects") },
    { href: "#contact", label: getTranslation(translations, "navigation.contact", "Contact") },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className={cn(
              "font-mono text-lg font-semibold text-foreground hover:text-primary transition-colors transition-opacity duration-100",
              // Show the nav brand only when:
              // 1. Fonts are ready AND animation has completed its first run AND user is scrolled past hero
              // 2. OR animation was never eligible (e.g. reduced motion, mid-page landing)
              // In all other cases, hide it to avoid overlap with hero h1 or floating clone.
              !(fontsReady && animationHasRun && scrollProgress >= 1) && "opacity-0",
            )}
          >
            <span ref={registerNavTitleRef}>Alejandro Repetto</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <LanguageSwitcher />

            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="w-9 h-9 p-0">
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
