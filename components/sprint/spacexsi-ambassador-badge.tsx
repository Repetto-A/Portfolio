import Image from "next/image"
import { SPACEXSI_AMBASSADOR_LABEL, SPACEXSI_LOGO_SRC, SPACEXSI_NAME } from "@/lib/sprint/constants"
import { cn } from "@/lib/utils"

/**
 * Credencial de texto. El logo oficial se muestra solo si existe el
 * archivo en el repo. No es un sello de respaldo sobre el sprint.
 */
export function SpaceXSIAmbassadorBadge({ className }: { className?: string }) {
  return (
    <span
      aria-label={SPACEXSI_AMBASSADOR_LABEL}
      className={cn(
        "inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium tracking-normal text-foreground [word-spacing:0.2em]",
        className
      )}
    >
      {SPACEXSI_LOGO_SRC ? (
        <Image
          src={SPACEXSI_LOGO_SRC}
          alt=""
          width={16}
          height={16}
          className="size-4 object-contain"
        />
      ) : null}
      <span>{SPACEXSI_NAME} Ambassador</span>
    </span>
  )
}
