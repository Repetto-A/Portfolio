import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { CRIA_URL, ARGENTINA_SPACE_URL, NEXA_URL } from "@/lib/sprint/constants"

function SprintExtLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-[var(--sprint-accent)] hover:text-foreground transition-colors",
        className
      )}
    >
      {children}
    </a>
  )
}

export function SprintCriaLink({ className }: { className?: string }) {
  return (
    <SprintExtLink href={CRIA_URL} className={className}>
      CRIA
    </SprintExtLink>
  )
}

export function SprintNexaLink({ className }: { className?: string }) {
  return (
    <SprintExtLink href={NEXA_URL} className={className}>
      nexa.builders
    </SprintExtLink>
  )
}

export function SprintArgentinaSpaceLink({ className }: { className?: string }) {
  return (
    <SprintExtLink href={ARGENTINA_SPACE_URL} className={className}>
      Argentina Space 2026
    </SprintExtLink>
  )
}
