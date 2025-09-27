"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageLightbox, useImageLightboxAnalytics } from "@/components/ui/image-lightbox"
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

  const { trackImageOpen, trackImageClose, trackImageDownload } = useImageLightboxAnalytics()

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
      <div className="grid md:grid-cols-2 gap-6">
        {images.map((image, index) => {
          const fullPath = image.startsWith("/") ? image : `/${image}`

          return (
            <div
              key={index}
              className="group relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer border"
              onClick={() => openLightbox(index)}
              tabIndex={0}
              role="button"
              aria-label={`View ${projectTitle} screenshot ${index + 1} in lightbox`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  openLightbox(index)
                }
              }}
            >
              <Image
                src={fullPath || "/placeholder.svg"}
                alt={`${projectTitle} screenshot ${index + 1}`}
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
                className={cn(
                  "absolute inset-0 bg-black/0 flex items-center justify-center transition-all duration-300",
                  "group-hover:bg-black/20 group-focus:bg-black/20",
                )}
              >
                <div
                  className={cn(
                    "bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-0 transition-all duration-300",
                    "group-hover:scale-100 group-focus:scale-100",
                    "shadow-lg group-hover:shadow-xl",
                  )}
                >
                  <ZoomIn className="h-6 w-6 text-gray-800" />
                </div>
              </div>

              {images.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded-full font-medium">
                  {index + 1}/{images.length}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium">
                  {projectTitle} - Screenshot {index + 1}
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
        onImageOpen={(index) => trackImageOpen(projectTitle, index)}
        onImageClose={trackImageClose}
        onImageDownload={trackImageDownload}
      />
    </div>
  )
}
