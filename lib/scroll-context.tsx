"use client"

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"
import { useScrollProgress } from "@/hooks/use-scroll-progress"
import { useLocale } from "@/lib/i18n-context"
import { useTheme } from "next-themes"

/** Bounding rect stored in a coordinate system noted per field */
interface Rect {
  top: number
  left: number
  width: number
  height: number
}

/**
 * Computed font styles read from the hero element via getComputedStyle.
 * Applied as inline styles on the floating clone for pixel-perfect match.
 */
export interface ComputedTitleStyles {
  fontFamily: string
  fontWeight: string
  fontSize: string
  lineHeight: string
  letterSpacing: string
  color: string
  webkitFontSmoothing: string
}

interface ScrollContextType {
  scrollY: number
  /** 0 at page top, 1 when hero title has scrolled to navbar position */
  scrollProgress: number
  prefersReducedMotion: boolean
  /** Hero title rect in document coords (top includes scrollY offset) */
  heroTitleRect: Rect | null
  /** Nav title rect in viewport coords (fixed element, does not move with scroll) */
  navTitleRect: Rect | null
  /** Computed styles read from the hero h1 — used by the floating clone */
  heroComputedStyles: ComputedTitleStyles | null
  /** Computed font-size of the nav brand (px string, e.g. "18px") */
  navFontSize: string | null
  /** True only after document.fonts.ready has resolved */
  fontsReady: boolean
  registerHeroTitleRef: (el: HTMLElement | null) => void
  registerNavTitleRef: (el: HTMLElement | null) => void
  /** True when the floating title should be visible (0 < progress < 1, no reduced motion, fonts ready) */
  isFloatingTitleActive: boolean
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

const FALLBACK_THRESHOLD = 700
/** Multiplier applied to the computed hero-to-nav distance. >1 = slower animation */
const THRESHOLD_SCALE = 1.4
/** Minimum scroll distance (px) so the animation never feels too abrupt on mobile */
const MIN_THRESHOLD = 250

export function ScrollProvider({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  // Reactive state for IntersectionObserver to track
  const [heroEl, setHeroEl] = useState<HTMLElement | null>(null)
  const [heroTitleRect, setHeroTitleRect] = useState<Rect | null>(null)
  const [navTitleRect, setNavTitleRect] = useState<Rect | null>(null)
  const [heroComputedStyles, setHeroComputedStyles] = useState<ComputedTitleStyles | null>(null)
  const [navFontSize, setNavFontSize] = useState<string | null>(null)
  const [fontsReady, setFontsReady] = useState(false)

  // Becomes true the first time the hero element enters the viewport.
  // Using IntersectionObserver instead of a one-time check in measure()
  // so it works even when the page loads mid-scroll or via deep link.
  const [heroWasVisible, setHeroWasVisible] = useState(false)

  // Dynamic threshold: the document-space distance the title needs to travel
  const threshold = useMemo(() => {
    if (!heroTitleRect || !navTitleRect) return FALLBACK_THRESHOLD
    // heroTitleRect.top is in document coords, navTitleRect.top is in viewport coords
    // The animation should complete when scrollY causes the hero title's viewport-top
    // to reach the nav title's viewport-top.
    // hero viewport top = heroTitleRect.top - scrollY
    // We want: heroTitleRect.top - scrollY = navTitleRect.top
    // => scrollY = heroTitleRect.top - navTitleRect.top
    const computed = (heroTitleRect.top - navTitleRect.top) * THRESHOLD_SCALE
    return Math.max(computed > 0 ? computed : FALLBACK_THRESHOLD, MIN_THRESHOLD)
  }, [heroTitleRect, navTitleRect])

  const { scrollY, scrollProgress, prefersReducedMotion } = useScrollProgress({ threshold })

  // Used to trigger remeasurement on locale/theme changes
  const { locale } = useLocale()
  const { theme } = useTheme()

  /**
   * Measure both bounding rects and read the hero's computed styles.
   * Called only after fonts are ready to guarantee correct metrics.
   */
  const measure = useCallback(() => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect()
      setHeroTitleRect({
        top: rect.top + window.scrollY,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })

      // Read exact computed styles from the hero element
      const cs = window.getComputedStyle(heroRef.current)
      setHeroComputedStyles({
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        webkitFontSmoothing:
          (cs as unknown as Record<string, string>).webkitFontSmoothing ?? "antialiased",
      })
    }
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect()
      // Nav is position:fixed — getBoundingClientRect already gives viewport coords
      setNavTitleRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
      setNavFontSize(window.getComputedStyle(navRef.current).fontSize)
    }
  }, [])

  const registerHeroTitleRef = useCallback((el: HTMLElement | null) => {
    heroRef.current = el
    setHeroEl(el)
    // Don't measure immediately — wait for fonts.ready in the effect
  }, [])

  // Watch for the hero entering the viewport at any point.
  // Once seen, heroWasVisible stays true and the observer disconnects.
  useEffect(() => {
    if (!heroEl || heroWasVisible) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHeroWasVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(heroEl)
    return () => observer.disconnect()
  }, [heroEl, heroWasVisible])

  const registerNavTitleRef = useCallback((el: HTMLElement | null) => {
    navRef.current = el
  }, [])

  // Wait for fonts.ready before first measurement, then remeasure on triggers
  useEffect(() => {
    let cancelled = false
    let resizeTimer: ReturnType<typeof setTimeout>

    const doMeasure = () => {
      if (!cancelled) {
        measure()
        if (!fontsReady) setFontsReady(true)
      }
    }

    // Debounce resize/viewport changes to avoid measuring mid-transition
    const debouncedMeasure = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(doMeasure, 100)
    }

    // Always await fonts.ready before measuring — this is the critical gate
    // that prevents measuring with fallback font metrics.
    if (document.fonts?.ready) {
      document.fonts.ready.then(doMeasure)
    } else {
      // Fallback for environments without FontFaceSet API
      doMeasure()
    }

    window.addEventListener("resize", debouncedMeasure)

    // Handle mobile viewport changes (URL bar hide/show)
    const vv = window.visualViewport
    if (vv) {
      vv.addEventListener("resize", debouncedMeasure)
    }

    return () => {
      cancelled = true
      clearTimeout(resizeTimer)
      window.removeEventListener("resize", debouncedMeasure)
      if (vv) {
        vv.removeEventListener("resize", debouncedMeasure)
      }
    }
  }, [measure, fontsReady, locale, theme])

  const isFloatingTitleActive =
    !prefersReducedMotion &&
    fontsReady &&
    heroWasVisible &&
    scrollProgress > 0 &&
    scrollProgress < 1

  const value = useMemo<ScrollContextType>(
    () => ({
      scrollY,
      scrollProgress,
      prefersReducedMotion,
      heroTitleRect,
      navTitleRect,
      heroComputedStyles,
      navFontSize,
      fontsReady,
      registerHeroTitleRef,
      registerNavTitleRef,
      isFloatingTitleActive,
    }),
    [
      scrollY,
      scrollProgress,
      prefersReducedMotion,
      heroTitleRect,
      navTitleRect,
      heroComputedStyles,
      navFontSize,
      fontsReady,
      registerHeroTitleRef,
      registerNavTitleRef,
      isFloatingTitleActive,
    ]
  )

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
}

export function useScrollContext() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error("useScrollContext must be used within ScrollProvider")
  return ctx
}
