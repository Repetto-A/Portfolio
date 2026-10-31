"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import { ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

interface ProjectImageGalleryProps {
  images: string[]
  projectTitle: string
  className?: string
}

export function ProjectImageGallery({ images, projectTitle, className }: ProjectImageGalleryProps) {
  const [translations] = useTranslations()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0)

  const openLightbox = (initialIndex: number) => {
    setLightboxInitialIndex(initialIndex)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  if (!images || images.length === 0) {
    return null
  }

  const screenshotLabel = (index: number) =>
    getTranslation(translations, "a11y.screenshot")
      .replace("{{title}}", projectTitle)
      .replace("{{n}}", String(index + 1))
      .replace("{{total}}", String(images.length))

  return (
    <div className={className}>
      <div
        className={
          images.length === 1 ? "grid max-w-3xl grid-cols-1 gap-6" : "grid gap-6 md:grid-cols-2"
        }
      >
        {images.map((image, index) => {
          const fullPath = image.startsWith("/") ? image : `/${image}`

          return (
            <button
              key={index}
              type="button"
              className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg border bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => openLightbox(index)}
              aria-label={screenshotLabel(index)}
            >
              <Image
                src={fullPath || "/placeholder.svg"}
                alt=""
                fill
                className={cn("object-cover transition-all duration-300", "group-hover:scale-105")}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
                onError={(e) => {
                  console.error(`Error loading image: ${fullPath}`)
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.png?height=400&width=600&text=${encodeURIComponent(projectTitle)}`
                  target.onerror = null
                }}
              />

              <div
                aria-hidden
                className={cn(
                  "absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300",
                  "group-hover:bg-black/20 group-focus:bg-black/20"
                )}
              >
                <div
                  className={cn(
                    "scale-0 transform rounded-full bg-white/90 p-4 shadow-lg backdrop-blur-sm transition-all duration-300",
                    "group-hover:scale-100 group-focus:scale-100 group-hover:shadow-xl"
                  )}
                >
                  <ZoomIn className="h-6 w-6 text-gray-800" />
                </div>
              </div>

              {images.length > 1 ? (
                <div
                  aria-hidden
                  className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white"
                >
                  {index + 1}/{images.length}
                </div>
              ) : null}
            </button>
          )
        })}
      </div>

      <ImageLightbox
        images={images}
        initialIndex={lightboxInitialIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        projectTitle={projectTitle}
      />
    </div>
  )
}
