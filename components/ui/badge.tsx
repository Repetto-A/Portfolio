import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: "default" | "secondary" | "destructive" | "outline"
  asChild?: boolean
}

const getBadgeClasses = (variant = "default") => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-colors"

  const variantClasses = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",
    destructive: "border-transparent bg-destructive text-white hover:bg-destructive/90",
    outline: "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
  }

  return `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]}`
}

function Badge({ className, variant = "default", asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return <Comp className={cn(getBadgeClasses(variant), className)} {...props} />
}

export { Badge }
