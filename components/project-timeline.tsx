"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

interface TimelineEvent {
  date: string
  title: string | { en: string; es: string }
  description: string | { en: string; es: string }
}

interface ProjectTimelineProps {
  timeline: TimelineEvent[]
  className?: string
}

export function ProjectTimeline({ timeline, className }: ProjectTimelineProps) {
  const [translations, locale] = useTranslations()
  
  // Parse dates and find current/future events
  const now = new Date()
  
  // Helper to parse date as local date (not UTC)
  const parseLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day) // month is 0-indexed in JS
  }
  
  // Helper to get localized content
  const getLocalizedContent = (content: string | { en: string; es: string }) => {
    if (typeof content === 'string') return content
    return content[locale as 'en' | 'es'] || content.en
  }
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>{getTranslation(translations, "projects.timeline.title", "Project Timeline")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border" />
          
          {timeline.map((event, index) => {
            const eventDate = parseLocalDate(event.date)
            const isPast = eventDate <= now
            const isToday = eventDate.toDateString() === now.toDateString()
            
            return (
              <div key={index} className="relative pl-8">
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute left-0 top-1 w-4 h-4 rounded-full border-2 bg-background",
                    isPast || isToday
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {isPast && !isToday && (
                    <CheckCircle2 className="absolute -left-[2px] -top-[2px] h-4 w-4 text-primary" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <time
                      className={cn(
                        "text-xs font-medium",
                        isPast || isToday ? "text-primary" : "text-muted-foreground"
                      )}
                      dateTime={event.date}
                    >
                      {eventDate.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    {isToday && (
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {getTranslation(translations, "projects.timeline.today", "Today")}
                      </span>
                    )}
                  </div>
                  <h4
                    className={cn(
                      "font-semibold text-sm",
                      isPast || isToday ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {getLocalizedContent(event.title)}
                  </h4>
                  <p
                    className={cn(
                      "text-xs leading-relaxed",
                      isPast || isToday ? "text-muted-foreground" : "text-muted-foreground/70"
                    )}
                  >
                    {getLocalizedContent(event.description)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
