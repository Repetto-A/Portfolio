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
import { FileText, Play, ArrowUpRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { SPRINT_PRESS, SPRINT_PRESS_TOTAL, type SprintPressLink } from "@/lib/sprint/proof"

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|[?&]v=)([^&\s]+)/)
  return match?.[1] ?? null
}

function SprintYoutubePlayer({ videoId, title }: { videoId: string; title: string }) {
  const [active, setActive] = useState(false)

  if (active) {
    return (
      <div className="aspect-video overflow-hidden rounded-lg bg-black ring-1 ring-border">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media"
          allowFullScreen
          loading="lazy"
          className="h-full w-full border-0"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="group/yt relative aspect-video w-full overflow-hidden rounded-lg bg-black ring-1 ring-border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sprint-accent)]"
      aria-label={`Reproducir: ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover/yt:bg-black/40">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sprint-accent)] shadow-lg transition-transform group-hover/yt:scale-110">
          <Play className="ml-0.5 h-6 w-6 fill-white text-white" aria-hidden />
        </div>
      </div>
    </button>
  )
}

function SprintPressArticleRow({ item }: { item: SprintPressLink }) {
  const inner = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-background text-[var(--sprint-accent)]">
        <FileText className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--sprint-accent)] uppercase">
          {item.source}
        </span>
        <span className="mt-1 block text-sm font-medium leading-snug text-foreground">
          {item.title}
        </span>
      </span>
      {item.url ? (
        <span className="inline-flex shrink-0 items-center gap-1 self-center font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase opacity-0 transition-opacity group-hover:opacity-100">
          Leer
          <ExternalLink className="size-3" aria-hidden />
        </span>
      ) : null}
    </>
  )

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex gap-4 rounded-lg border border-border bg-card/40 p-4 transition-colors hover:border-[var(--sprint-accent)]/35 hover:bg-muted/25"
      >
        {inner}
      </a>
    )
  }

  return (
    <div className="flex gap-4 rounded-lg border border-border/70 bg-card/20 p-4">
      {inner}
    </div>
  )
}

function SprintPressVideoRow({ item }: { item: SprintPressLink }) {
  const youtubeId = item.url ? getYoutubeId(item.url) : null

  if (youtubeId) {
    return (
      <article className="space-y-3 rounded-lg border border-border bg-card/40 p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-background text-[var(--sprint-accent)]">
            <Play className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--sprint-accent)] uppercase">
              {item.source}
            </span>
            <p className="mt-1 text-sm font-medium leading-snug text-foreground">{item.title}</p>
          </div>
        </div>
        <SprintYoutubePlayer videoId={youtubeId} title={item.title} />
      </article>
    )
  }

  const inner = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-background text-[var(--sprint-accent)]">
        <Play className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--sprint-accent)] uppercase">
          {item.source}
        </span>
        <span className="mt-1 block text-sm font-medium leading-snug text-foreground">
          {item.title}
        </span>
      </span>
      {item.url ? (
        <span className="inline-flex shrink-0 items-center gap-1 self-center font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase opacity-0 transition-opacity group-hover:opacity-100">
          Ver
          <ExternalLink className="size-3" aria-hidden />
        </span>
      ) : null}
    </>
  )

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex gap-4 rounded-lg border border-border bg-card/40 p-4 transition-colors hover:border-[var(--sprint-accent)]/35 hover:bg-muted/25"
      >
        {inner}
      </a>
    )
  }

  return (
    <div className="flex gap-4 rounded-lg border border-border/70 bg-card/20 p-4">
      {inner}
    </div>
  )
}

function SprintPressList({ items }: { items: SprintPressLink[] }) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No hay resultados en esta categoría.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) =>
        item.type === "video" ? (
          <SprintPressVideoRow key={`${item.source}-${item.title}`} item={item} />
        ) : (
          <SprintPressArticleRow key={`${item.source}-${item.title}`} item={item} />
        )
      )}
    </div>
  )
}

export function SprintPressModal() {
  const articleCount = useMemo(
    () => SPRINT_PRESS.filter((item) => item.type === "article").length,
    []
  )
  const videoCount = useMemo(
    () => SPRINT_PRESS.filter((item) => item.type === "video").length,
    []
  )

  const articles = useMemo(
    () => SPRINT_PRESS.filter((item) => item.type === "article"),
    []
  )
  const videos = useMemo(() => SPRINT_PRESS.filter((item) => item.type === "video"), [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          Ver las {SPRINT_PRESS_TOTAL} notas y entrevistas
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "flex max-h-[min(88vh,920px)] flex-col gap-0 overflow-hidden p-0",
          "sm:max-w-2xl lg:max-w-3xl"
        )}
      >
        <div className="border-b border-border px-6 py-5 pr-14 sm:px-8 sm:pr-16">
          <DialogHeader className="gap-2 text-left">
            <DialogTitle className="text-2xl font-bold tracking-tight sm:text-[1.65rem]">
              Prensa y apariciones
            </DialogTitle>
            <DialogDescription className="max-w-prose text-sm leading-relaxed">
              Notas, entrevistas y videos sobre proyectos, hackathons y trayectoria pública.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="all" className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-border px-6 sm:px-8">
            <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-0 bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="mr-6 flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 py-3 text-sm font-medium shadow-none data-[state=active]:border-[var(--sprint-accent)] data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                Todos ({SPRINT_PRESS_TOTAL})
              </TabsTrigger>
              <TabsTrigger
                value="article"
                className="mr-6 flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 py-3 text-sm font-medium shadow-none data-[state=active]:border-[var(--sprint-accent)] data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                <FileText className="mr-1.5 size-3.5" aria-hidden />
                Artículos ({articleCount})
              </TabsTrigger>
              <TabsTrigger
                value="video"
                className="flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 py-3 text-sm font-medium shadow-none data-[state=active]:border-[var(--sprint-accent)] data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                <Play className="mr-1.5 size-3.5" aria-hidden />
                Videos ({videoCount})
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            <TabsContent value="all" className="mt-0">
              <SprintPressList items={SPRINT_PRESS} />
            </TabsContent>
            <TabsContent value="article" className="mt-0">
              <SprintPressList items={articles} />
            </TabsContent>
            <TabsContent value="video" className="mt-0">
              <SprintPressList items={videos} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
