import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
  align?: "left" | "center"
}

export function SectionHeader({ title, description, children, className, align = "center" }: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start"

  return (
    <div className={cn("space-y-4 mb-16", alignClass, className)}>
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">{title}</h2>
      {description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">{description}</p>}
      {children}
    </div>
  )
}
