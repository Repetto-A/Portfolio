"use client"

import { useState, useEffect, useRef } from "react"

interface UseScrollProgressOptions {
  /** Scroll distance (px) over which progress goes from 0 to 1 */
  threshold: number
}

export function useScrollProgress({ threshold }: UseScrollProgressOptions) {
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const rafRef = useRef(0)

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener("change", onChange)

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrollY(y)
        setScrollProgress(threshold > 0 ? Math.min(y / threshold, 1) : 0)
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // Handle mobile viewport changes (URL bar hide/show changes scroll geometry)
    const vv = window.visualViewport
    if (vv) {
      vv.addEventListener("resize", handleScroll)
      vv.addEventListener("scroll", handleScroll)
    }

    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      mql.removeEventListener("change", onChange)
      if (vv) {
        vv.removeEventListener("resize", handleScroll)
        vv.removeEventListener("scroll", handleScroll)
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [threshold])

  return { scrollY, scrollProgress, prefersReducedMotion }
}
