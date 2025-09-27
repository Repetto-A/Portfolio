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
  onImageOpen?: (index: number) => void
  onImageClose?: () => void
  onImageDownload?: (imageUrl: string, index: number) => void
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  projectTitle,
  onImageOpen,
  onImageClose,
  onImageDownload,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isLoading, setIsLoading] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setIsZoomed(false)
      setIsLoading(true)
      onImageOpen?.(initialIndex)
    } else {
      onImageClose?.()
    }
  }, [isOpen, initialIndex, onImageOpen, onImageClose])

  // Preload adjacent images for smooth navigation
  useEffect(() => {
    if (!isOpen) return

    const preloadImage = (index: number) => {
      if (index >= 0 && index < images.length) {
        const img = new window.Image()
        img.src = images[index]
      }
    }

    // Preload current, next, and previous images
    preloadImage(currentIndex)
    preloadImage(currentIndex + 1)
    preloadImage(currentIndex - 1)
  }, [currentIndex, images, isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
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
  }, [isOpen, currentIndex, images.length])

  // Focus management
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [isOpen])

  const navigateToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setIsLoading(true)
      setIsZoomed(false)
    }
  }, [currentIndex, images.length])

  const navigateToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setIsLoading(true)
      setIsZoomed(false)
    }
  }, [currentIndex])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      dialogRef.current?.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }, [])

  const handleDownload = useCallback(async () => {
    const currentImage = images[currentIndex]
    onImageDownload?.(currentImage, currentIndex)

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
    } catch (error) {
      console.error("Download failed:", error)
    }
  }, [images, currentIndex, projectTitle, onImageDownload])

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const deltaX = touchStart.x - touch.clientX
    const deltaY = touchStart.y - touch.clientY
    const minSwipeDistance = 50

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        navigateToNext()
      } else {
        navigateToPrevious()
      }
    }

    setTouchStart(null)
  }

  if (!isOpen) return null

  const currentImage = images[currentIndex]
  const hasMultipleImages = images.length > 1

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={dialogRef}
        className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-0"
        onTouchStart={handleTouchStart}
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
        <div className="relative w-full h-full flex items-center justify-center p-16">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}

          <div
            className={cn(
              "relative max-w-full max-h-full transition-transform duration-300 cursor-zoom-in",
              isZoomed && "cursor-zoom-out scale-150 md:scale-200",
            )}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              ref={imageRef}
              src={currentImage || "/placeholder.svg"}
              alt={`${projectTitle || "Project"} screenshot ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              priority
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
                    setIsZoomed(false)
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

// Hook for analytics tracking
export function useImageLightboxAnalytics() {
  const trackImageOpen = useCallback((projectTitle: string, imageIndex: number) => {
    // Analytics implementation
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "image_open", {
        project_name: projectTitle,
        image_index: imageIndex,
      })
    }
  }, [])

  const trackImageClose = useCallback(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "image_close")
    }
  }, [])

  const trackImageDownload = useCallback((imageUrl: string, imageIndex: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "image_download", {
        image_url: imageUrl,
        image_index: imageIndex,
      })
    }
  }, [])

  return {
    trackImageOpen,
    trackImageClose,
    trackImageDownload,
  }
}
