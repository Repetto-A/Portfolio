"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronLeft, ChevronRight, Download, Maximize, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageLightboxProps {
  images: string[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  projectTitle?: string
}

export function useImageLightboxAnalytics() {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, string | number>) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, properties)
    }
  }, [])

  return {
    trackImageOpen: (projectTitle: string, imageIndex: number) =>
      trackEvent("image_open", { project: projectTitle, index: imageIndex }),
    trackImageClose: (projectTitle: string) => trackEvent("image_close", { project: projectTitle }),
    trackImageNavigate: (projectTitle: string, imageIndex: number) =>
      trackEvent("image_navigate", { project: projectTitle, index: imageIndex }),
    trackImageDownload: (projectTitle: string, imageIndex: number) =>
      trackEvent("image_download", { project: projectTitle, index: imageIndex }),
  }
}

const MIN_SCALE = 1
const MAX_SCALE = 3
const SCALE_STEP = 0.5

export function ImageLightbox({ images, initialIndex = 0, isOpen, onClose, projectTitle }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isLoading, setIsLoading] = useState(true)
  const dialogRef = useRef<HTMLDivElement>(null)
  const analytics = useImageLightboxAnalytics()

  // Pan & zoom state
  const [scale, setScale] = useState(MIN_SCALE)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragOrigin = useRef({ x: 0, y: 0 })
  const translateOrigin = useRef({ x: 0, y: 0 })

  // Pinch state
  const pinchStartDist = useRef<number | null>(null)
  const pinchStartScale = useRef(MIN_SCALE)

  const resetTransform = useCallback(() => {
    setScale(MIN_SCALE)
    setTranslate({ x: 0, y: 0 })
  }, [])

  // Reset state when dialog opens/closes or image changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      resetTransform()
      setIsLoading(true)
      if (projectTitle) {
        analytics.trackImageOpen(projectTitle, initialIndex)
      }
    } else {
      if (projectTitle) {
        analytics.trackImageClose(projectTitle)
      }
    }
  }, [isOpen, initialIndex, projectTitle, analytics, resetTransform])

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen) return
    const preload = (i: number) => {
      if (i >= 0 && i < images.length) {
        const img = new window.Image()
        img.src = images[i]
      }
    }
    preload(currentIndex)
    preload(currentIndex + 1)
    preload(currentIndex - 1)
  }, [currentIndex, images, isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          if (scale > MIN_SCALE) {
            e.preventDefault()
            resetTransform()
          } else {
            onClose()
          }
          break
        case "ArrowLeft":
          e.preventDefault()
          navigateToPrevious()
          break
        case "ArrowRight":
          e.preventDefault()
          navigateToNext()
          break
        case "f":
        case "F":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            toggleFullscreen()
          }
          break
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex, images.length, scale])

  // Focus management
  useEffect(() => {
    if (isOpen && dialogRef.current) dialogRef.current.focus()
  }, [isOpen])

  const navigateToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setIsLoading(true)
      resetTransform()
      if (projectTitle) analytics.trackImageNavigate(projectTitle, currentIndex + 1)
    }
  }, [currentIndex, images.length, projectTitle, analytics, resetTransform])

  const navigateToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setIsLoading(true)
      resetTransform()
      if (projectTitle) analytics.trackImageNavigate(projectTitle, currentIndex - 1)
    }
  }, [currentIndex, projectTitle, analytics, resetTransform])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      dialogRef.current?.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }, [])

  const handleDownload = useCallback(async () => {
    const currentImage = images[currentIndex]
    try {
      const response = await fetch(currentImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${projectTitle || "image"}-${currentIndex + 1}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      if (projectTitle) analytics.trackImageDownload(projectTitle, currentIndex)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }, [images, currentIndex, projectTitle, analytics])

  // Click to toggle zoom
  const handleImageClick = useCallback(() => {
    if (isDragging.current) return
    if (scale > MIN_SCALE) {
      resetTransform()
    } else {
      setScale(2)
    }
  }, [scale, resetTransform])

  // Wheel to zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP
      setScale((prev) => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev + delta))
        if (next === MIN_SCALE) setTranslate({ x: 0, y: 0 })
        return next
      })
    },
    [],
  )

  // Pointer drag for panning
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (scale <= MIN_SCALE) return
      isDragging.current = false
      dragOrigin.current = { x: e.clientX, y: e.clientY }
      translateOrigin.current = { ...translate }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [scale, translate],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (scale <= MIN_SCALE) return
      if (!(e.target as HTMLElement).hasPointerCapture(e.pointerId)) return
      const dx = e.clientX - dragOrigin.current.x
      const dy = e.clientY - dragOrigin.current.y
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragging.current = true
      setTranslate({
        x: translateOrigin.current.x + dx / scale,
        y: translateOrigin.current.y + dy / scale,
      })
    },
    [scale],
  )

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    // Reset isDragging after a tick so click handler can check it
    requestAnimationFrame(() => {
      isDragging.current = false
    })
  }, [])

  // Touch: pinch to zoom, swipe to navigate (only at 1x)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        pinchStartDist.current = Math.hypot(dx, dy)
        pinchStartScale.current = scale
      }
    },
    [scale],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && pinchStartDist.current !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const dist = Math.hypot(dx, dy)
        const ratio = dist / pinchStartDist.current
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchStartScale.current * ratio))
        setScale(next)
        if (next === MIN_SCALE) setTranslate({ x: 0, y: 0 })
      }
    },
    [],
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (pinchStartDist.current !== null) {
        pinchStartDist.current = null
        return
      }
      // Swipe to navigate only at 1x
      if (scale > MIN_SCALE || e.changedTouches.length === 0) return
      // Swipe detection handled via pointer events on single touch
    },
    [scale],
  )

  if (!isOpen) return null

  const currentImage = images[currentIndex]
  const hasMultipleImages = images.length > 1
  const isZoomed = scale > MIN_SCALE

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={dialogRef}
        className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
        aria-describedby="lightbox-description"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center space-x-3">
            {projectTitle && (
              <h2 id="lightbox-title" className="text-white font-semibold">
                {projectTitle}
              </h2>
            )}
            {hasMultipleImages && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {currentIndex + 1} of {images.length}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="text-white hover:bg-white/20"
              title="Download image (Ctrl+S)"
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download image</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
              title="Toggle fullscreen (F)"
            >
              <Maximize className="h-4 w-4" />
              <span className="sr-only">Toggle fullscreen</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close lightbox</span>
            </Button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={navigateToPrevious}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous image (←)"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous image</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={navigateToNext}
              disabled={currentIndex === images.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next image (→)"
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}

        {/* Main Image Container */}
        <div
          className="relative w-full h-full flex items-center justify-center p-16 overflow-hidden"
          onWheel={handleWheel}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}

          <div
            className={cn(
              "relative w-full h-full touch-none",
              isZoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
            )}
            style={{
              transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
              willChange: "transform",
              transition: isDragging.current ? "none" : "transform 200ms ease-out",
            }}
            onClick={handleImageClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <Image
              src={currentImage || "/placeholder.svg"}
              alt={`${projectTitle || "Project"} screenshot ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="95vw"
              quality={90}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              priority
              draggable={false}
            />
          </div>
        </div>

        {/* Bottom Caption/Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p id="lightbox-description" className="text-white/80 text-sm text-center">
            {projectTitle && `${projectTitle} - `}
            Screenshot {currentIndex + 1}
            {hasMultipleImages && ` of ${images.length}`}
          </p>

          {hasMultipleImages && (
            <div className="flex justify-center mt-2 space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsLoading(true)
                    resetTransform()
                    if (projectTitle) analytics.trackImageNavigate(projectTitle, index)
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentIndex ? "bg-white" : "bg-white/40 hover:bg-white/60",
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
