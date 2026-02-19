"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import { Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTranslations, getTranslation } from "@/lib/i18n-context"
import type { Project } from "@/types/project"

interface ProjectDetailModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const [translations, locale] = useTranslations()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (!project) return null

  const content = project.locales[locale] || project.locales["en"]

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">
                {getTranslation(translations, `projects.categories.${project.category}`, project.category)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {getTranslation(translations, `projects.status.${project.status}`, project.status)}
              </Badge>
            </div>
            <DialogTitle className="text-xl">{content.title}</DialogTitle>
            <DialogDescription className="sr-only">{content.short}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="px-6 py-4 space-y-6">
              {/* Image thumbnails */}
              {project.images?.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {project.images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => {
                        setLightboxIndex(i)
                        setLightboxOpen(true)
                      }}
                      className="relative aspect-video rounded-md overflow-hidden border border-border hover:ring-2 ring-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={`${content.title} — ${getTranslation(translations, "projects.image")} ${i + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`${content.title} screenshot ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 45vw, 280px"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed text-sm">
                {content.description}
              </p>

              {/* Features */}
              {content.features?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    {getTranslation(translations, "projects.features")}
                  </h4>
                  <ul className="space-y-2">
                    {content.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech stack */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  {getTranslation(translations, "projects.techStack")}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3 pt-2">
                {project.githubUrl && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      {getTranslation(translations, "projects.cta.code")}
                    </Link>
                  </Button>
                )}
                {project.demoUrl && (
                  <Button asChild size="sm">
                    <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Lightbox as sibling to Dialog to avoid z-index/focus conflicts */}
      <ImageLightbox
        images={project.images || []}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        projectTitle={content.title}
      />
    </>
  )
}
