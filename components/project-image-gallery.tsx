"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import { ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectImageGalleryProps {
  images: string[]
  projectTitle: string
  captionLabel?: string
  className?: string
}

export function ProjectImageGallery({
  images,
  projectTitle,
  captionLabel = "Screenshot",
  className,
}: ProjectImageGalleryProps) {
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
          const caption =
            images.length > 1
              ? `${projectTitle}, ${captionLabel} ${index + 1}/${images.length}`
              : `${projectTitle}, ${captionLabel}`

          return (
            <button
              key={fullPath}
              type="button"
              className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg border bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={fullPath || "/placeholder.svg"}
                alt=""
                fill
                className={cn(
                  "object-cover transition-transform duration-300",
                  "group-hover:scale-105"
                )}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300",
                  "group-hover:bg-black/20 group-focus-visible:bg-black/20"
                )}
              >
                <span
                  className={cn(
                    "scale-0 transform rounded-full bg-white/90 p-4 shadow-lg backdrop-blur-sm transition-transform duration-300",
                    "group-hover:scale-100 group-focus-visible:scale-100"
                  )}
                >
                  <ZoomIn className="h-6 w-6 text-gray-800" />
                </span>
              </span>

              <span className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm font-medium text-white">
                {caption}
              </span>
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
