"use client"

import { useMemo, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText, Play, Newspaper, ArrowRight } from "lucide-react"
import type { PressLink, LocalizedString } from "@/data/awards"
import { localize } from "@/data/awards"

const PRESS_TYPE_META: Record<
  PressLink["type"],
  { label: { en: string; es: string }; icon: typeof FileText; cta: { en: string; es: string } }
> = {
  article: {
    label: { en: "Articles", es: "Articulos" },
    icon: FileText,
    cta: { en: "Read", es: "Leer" },
  },
  video: {
    label: { en: "Videos", es: "Videos" },
    icon: Play,
    cta: { en: "Watch", es: "Ver" },
  },
}

const ALL_TYPES = ["article", "video"] as const

/** Extract YouTube video ID from common URL formats */
function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|[?&]v=)([^&\s]+)/)
  return match?.[1] ?? null
}

function YoutubePlayer({ videoId, title }: { videoId: string; title: string }) {
  const [active, setActive] = useState(false)

  if (active) {
    return (
      <div className="aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media"
          allowFullScreen
          loading="lazy"
          className="w-full h-full border-0"
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setActive(true)}
      className="group/yt relative aspect-video w-full rounded-lg overflow-hidden bg-black focus:outline-none focus:ring-2 focus:ring-ring"
      aria-label={`Play ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/yt:bg-black/40 transition-colors">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg group-hover/yt:scale-110 transition-transform">
          <Play className="h-6 w-6 text-white fill-white ml-0.5" />
        </div>
      </div>
    </button>
  )
}

export function PressArticleItem({ link, locale }: { link: PressLink; locale: string }) {
  const meta = PRESS_TYPE_META[link.type]
  const Icon = meta.icon

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
        <p className="text-xs text-muted-foreground">{link.source}</p>
      </div>

      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {localize(meta.cta, locale)}
        <ExternalLink className="h-3 w-3" />
      </span>
    </a>
  )
}

export function PressVideoItem({ link }: { link: PressLink }) {
  const youtubeId = getYoutubeId(link.url)

  if (youtubeId) {
    return (
      <div className="space-y-1.5">
        <YoutubePlayer videoId={youtubeId} title={link.title} />
        <p className="text-xs text-muted-foreground px-1">
          {link.title} — {link.source}
        </p>
      </div>
    )
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Play className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
        <p className="text-xs text-muted-foreground">{link.source}</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <ExternalLink className="h-3 w-3" />
      </span>
    </a>
  )
}

function PressItem({ link, locale }: { link: PressLink; locale: string }) {
  if (link.type === "video") return <PressVideoItem link={link} />
  return <PressArticleItem link={link} locale={locale} />
}

function PressItemList({ links, locale }: { links: PressLink[]; locale: string }) {
  if (links.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {locale === "es" ? "Sin resultados" : "No results"}
      </p>
    )
  }
  return (
    <div className="space-y-2">
      {links.map((link) => (
        <PressItem key={link.id} link={link} locale={locale} />
      ))}
    </div>
  )
}

interface PressModalProps {
  awardTitle: LocalizedString
  links: PressLink[]
  locale: string
}

export function PressModal({ awardTitle, links, locale }: PressModalProps) {
  const presentTypes = useMemo(() => {
    const set = new Set(links.map((l) => l.type))
    return ALL_TYPES.filter((t) => set.has(t))
  }, [links])

  const byType = useMemo(() => {
    const map: Record<string, PressLink[]> = {}
    for (const t of ALL_TYPES) {
      map[t] = links.filter((l) => l.type === t)
    }
    return map
  }, [links])

  if (links.length === 0) return null

  const countLabel =
    locale === "es"
      ? `+${links.length} notas, podcasts y streams`
      : `+${links.length} notes, podcasts & streams`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="group/btn w-full justify-start"
          aria-label={
            locale === "es"
              ? `Abrir prensa y medios de ${localize(awardTitle, locale)}`
              : `Open press and media for ${localize(awardTitle, locale)}`
          }
        >
          <Newspaper className="mr-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          {countLabel}
          <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col" aria-modal="true">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Newspaper className="h-4 w-4 shrink-0" />
            {locale === "es" ? "Prensa y Medios" : "Press & Media"}
          </DialogTitle>
          <DialogDescription>
            {localize(awardTitle, locale)} &mdash; {links.length}{" "}
            {locale === "es" ? "menciones" : "mentions"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" className="flex-1 min-h-0">
          <TabsList className="w-full">
            <TabsTrigger value="all">{locale === "es" ? "Todos" : "All"}</TabsTrigger>
            {presentTypes.map((t) => {
              const meta = PRESS_TYPE_META[t]
              const TypeIcon = meta.icon
              return (
                <TabsTrigger key={t} value={t} className="gap-1">
                  <TypeIcon className="h-3 w-3" />
                  {localize(meta.label, locale)}
                </TabsTrigger>
              )
            })}
          </TabsList>

          <div className="mt-3 flex-1 overflow-y-auto max-h-[50vh] pr-1">
            <TabsContent value="all" className="mt-0">
              <PressItemList links={links} locale={locale} />
            </TabsContent>

            {presentTypes.map((t) => (
              <TabsContent key={t} value={t} className="mt-0">
                <PressItemList links={byType[t]} locale={locale} />
              </TabsContent>
            ))}
          </div>
        </Tabs>

      </DialogContent>
    </Dialog>
  )
}
