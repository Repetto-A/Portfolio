"use client"

import { useRef, useEffect, useState } from "react"
import { useScrollContext } from "@/lib/scroll-context"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

/**
 * Fixed-position element that interpolates between the hero h1 and the navbar
 * brand text during scroll, creating a continuous "dock into navbar" effect.
 *
 * Uses translate3d + scale for GPU-composited animation.
 * Purely decorative — the real heading and nav link remain in the DOM.
 *
 * Opacity-gated: the clone mounts with opacity 0, applies exact computed styles
 * from the hero h1 (read via getComputedStyle), and only becomes visible after
 * the first rAF tick to guarantee no unstyled flash frame.
 */
export function FloatingTitle() {
  const {
    scrollY,
    scrollProgress,
    prefersReducedMotion,
    heroTitleRect,
    navTitleRect,
    heroComputedStyles,
    fontsReady,
    isFloatingTitleActive,
  } = useScrollContext()
  const [translations] = useTranslations()
  const [revealed, setRevealed] = useState(false)
  const revealRafRef = useRef(0)

  // Determine if the clone should be in the DOM at all.
  // Uses isFloatingTitleActive from context which includes: !prefersReducedMotion,
  // fontsReady, heroWasVisible, !animationHasRun, 0 < scrollProgress < 1
  const shouldMount =
    isFloatingTitleActive &&
    heroTitleRect != null &&
    navTitleRect != null &&
    heroComputedStyles != null

  // Opacity-gated reveal: mount with opacity 0, then reveal after one rAF
  // so the browser has time to apply computed styles before painting.
  useEffect(() => {
    if (shouldMount && !revealed) {
      revealRafRef.current = requestAnimationFrame(() => {
        setRevealed(true)
      })
    }
    if (!shouldMount && revealed) {
      setRevealed(false)
    }
    return () => {
      if (revealRafRef.current) cancelAnimationFrame(revealRafRef.current)
    }
  }, [shouldMount, revealed])

  if (!shouldMount || !heroTitleRect || !navTitleRect || !heroComputedStyles) {
    return null
  }

  const t = easeInOutCubic(scrollProgress)

  // Hero rect is in document coords — convert to viewport
  const heroViewportTop = heroTitleRect.top - scrollY
  const heroViewportLeft = heroTitleRect.left

  // Nav rect is already in viewport coords (fixed navbar)
  const navViewportTop = navTitleRect.top
  const navViewportLeft = navTitleRect.left

  // Position the element at the hero's initial viewport position,
  // then translate toward the nav position
  const deltaX = (navViewportLeft - heroViewportLeft) * t
  const deltaY = (navViewportTop - heroViewportTop) * t

  // Scale from hero size down to nav size
  const scaleX = lerp(1, navTitleRect.width / heroTitleRect.width, t)
  const scaleY = lerp(1, navTitleRect.height / heroTitleRect.height, t)

  const name = getTranslation(translations, "hero.name", "Alejandro Repetto")

  return (
    <div
      className="fixed z-[60] pointer-events-none"
      style={{
        top: heroViewportTop,
        left: heroViewportLeft,
        width: heroTitleRect.width,
        height: heroTitleRect.height,
        transformOrigin: "top left",
        transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`,
        willChange: revealed ? "transform, opacity" : undefined,
        opacity: revealed ? 1 : 0,
      }}
      aria-hidden="true"
    >
      <span
        className="whitespace-nowrap block"
        style={{
          // Use exact computed styles from the hero h1 for pixel-perfect match
          fontFamily: heroComputedStyles.fontFamily,
          fontWeight: heroComputedStyles.fontWeight,
          fontSize: heroComputedStyles.fontSize,
          lineHeight: heroComputedStyles.lineHeight,
          letterSpacing: heroComputedStyles.letterSpacing,
          color: heroComputedStyles.color,
          WebkitFontSmoothing: heroComputedStyles.webkitFontSmoothing,
        }}
      >
        {name}
      </span>
    </div>
  )
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
