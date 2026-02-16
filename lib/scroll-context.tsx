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
  /** True only after document.fonts.ready has resolved */
  fontsReady: boolean
  registerHeroTitleRef: (el: HTMLElement | null) => void
  registerNavTitleRef: (el: HTMLElement | null) => void
  /** True when the floating title should be visible (0 < progress < 1, no reduced motion, fonts ready, animation not yet completed) */
  isFloatingTitleActive: boolean
  /** True once the animation has completed its first run (scrollProgress reached 1). Prevents replays. */
  animationHasRun: boolean
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

const FALLBACK_THRESHOLD = 700
/** Multiplier applied to the computed hero-to-nav distance. >1 = slower animation */
const THRESHOLD_SCALE = 1.4

export function ScrollProvider({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const [heroTitleRect, setHeroTitleRect] = useState<Rect | null>(null)
  const [navTitleRect, setNavTitleRect] = useState<Rect | null>(null)
  const [heroComputedStyles, setHeroComputedStyles] = useState<ComputedTitleStyles | null>(null)
  const [fontsReady, setFontsReady] = useState(false)

  // --- Animation-once guard ---
  // Tracks whether the hero was visible on initial mount (prevents animation
  // when landing mid-page, e.g. via #projects deep link).
  const [heroWasVisible, setHeroWasVisible] = useState(false)
  // Once the animation completes (scrollProgress >= 1), this becomes true
  // permanently (until page reload), preventing replays.
  const [animationHasRun, setAnimationHasRun] = useState(false)

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
    return computed > 0 ? computed : FALLBACK_THRESHOLD
  }, [heroTitleRect, navTitleRect])

  const { scrollY, scrollProgress, prefersReducedMotion } = useScrollProgress({ threshold })

  // Used to trigger remeasurement on locale/theme changes
  const { locale } = useLocale()
  const { theme } = useTheme()

  // Tracks whether we've already checked hero visibility on initial load.
  // We only check once — if the hero was in the viewport the first time
  // we measure after fonts.ready, the animation is eligible.
  const heroVisibilityChecked = useRef(false)

  /**
   * Measure both bounding rects and read the hero's computed styles.
   * Called only after fonts are ready to guarantee correct metrics.
   *
   * Also performs a one-time hero visibility check on the first call
   * to determine if the animation should be eligible to run.
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
        webkitFontSmoothing: (cs as unknown as Record<string, string>).webkitFontSmoothing ?? "antialiased",
      })

      // One-time hero visibility check: if the hero is in the viewport
      // on the first measurement, the animation is eligible to run.
      // If the user lands mid-page (e.g. via #contact anchor), the hero
      // won't be visible and the animation will never activate.
      if (!heroVisibilityChecked.current) {
        heroVisibilityChecked.current = true
        const isInViewport = rect.bottom > 0 && rect.top < window.innerHeight
        if (isInViewport) {
          setHeroWasVisible(true)
        }
      }
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
    }
  }, [])

  const registerHeroTitleRef = useCallback(
    (el: HTMLElement | null) => {
      heroRef.current = el
      // Don't measure immediately — wait for fonts.ready in the effect
    },
    [],
  )

  const registerNavTitleRef = useCallback(
    (el: HTMLElement | null) => {
      navRef.current = el
    },
    [],
  )

  // Wait for fonts.ready before first measurement, then remeasure on triggers
  useEffect(() => {
    let cancelled = false

    const doMeasure = () => {
      if (!cancelled) {
        measure()
        if (!fontsReady) setFontsReady(true)
      }
    }

    // Always await fonts.ready before measuring — this is the critical gate
    // that prevents measuring with fallback font metrics.
    if (document.fonts?.ready) {
      document.fonts.ready.then(doMeasure)
    } else {
      // Fallback for environments without FontFaceSet API
      doMeasure()
    }

    window.addEventListener("resize", doMeasure)
    return () => {
      cancelled = true
      window.removeEventListener("resize", doMeasure)
    }
  }, [measure, fontsReady, locale, theme])

  // Mark animation as completed once scrollProgress reaches 1 for the first time.
  // After this, the floating title will never re-appear (until a full page reload).
  useEffect(() => {
    if (!animationHasRun && heroWasVisible && scrollProgress >= 1) {
      setAnimationHasRun(true)
    }
  }, [animationHasRun, heroWasVisible, scrollProgress])

  const isFloatingTitleActive =
    !prefersReducedMotion &&
    fontsReady &&
    heroWasVisible &&
    !animationHasRun &&
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
      fontsReady,
      registerHeroTitleRef,
      registerNavTitleRef,
      isFloatingTitleActive,
      animationHasRun,
    }),
    [
      scrollY,
      scrollProgress,
      prefersReducedMotion,
      heroTitleRect,
      navTitleRect,
      heroComputedStyles,
      fontsReady,
      registerHeroTitleRef,
      registerNavTitleRef,
      isFloatingTitleActive,
      animationHasRun,
    ],
  )

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
}

export function useScrollContext() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error("useScrollContext must be used within ScrollProvider")
  return ctx
}
