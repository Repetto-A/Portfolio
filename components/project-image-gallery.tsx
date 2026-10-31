"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import { ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectImageGalleryProps {
  images: string[]
  projectTitle: string
  className?: string
}

export function ProjectImageGallery({ images, projectTitle, className }: ProjectImageGalleryProps) {
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
            <div
              key={index}
              className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => openLightbox(index)}
              tabIndex={0}
              role="button"
              aria-label={
                images.length > 1
                  ? `${projectTitle} screenshot ${index + 1}/${images.length}`
                  : `${projectTitle} screenshot ${index + 1}`
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  openLightbox(index)
                }
              }}
            >
              <Image
                src={fullPath || "/placeholder.svg"}
                alt=""
                fill
                className={cn("object-cover transition-all duration-300", "group-hover:scale-105")}
                priority={index < 2}
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

              <div
                aria-hidden
                className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <p className="text-sm font-medium text-white">
                  {projectTitle} · Screenshot {index + 1}
                </p>
              </div>
            </div>
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
