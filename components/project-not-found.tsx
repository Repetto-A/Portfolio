"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

export function ProjectNotFound() {
  const [translations] = useTranslations()

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            {getTranslation(translations, "projects.notFound.title")}
          </h1>
          <p className="text-muted-foreground">
            {getTranslation(translations, "projects.notFound.description")}
          </p>
        </div>

        <Button asChild>
          <Link href="/#projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {getTranslation(translations, "projects.cta.backToProjects")}
          </Link>
        </Button>
      </div>
    </main>
  )
}
