import Image from "next/image"
import { cn } from "@/lib/utils"
import { PROFILE_PHOTO_SRC } from "@/lib/media"

interface ProfilePhotoProps {
  alt?: string
  className?: string
  sizes: string
  priority?: boolean
}

/**
 * Foto de perfil recortada para no cortar la cabeza.
 * `object-[center_18%]` prioriza el tercio superior del retrato vertical.
 */
export function ProfilePhoto({
  alt = "Alejandro Repetto",
  className,
  sizes,
  priority = false,
}: ProfilePhotoProps) {
  return (
    <Image
      src={PROFILE_PHOTO_SRC}
      alt={alt}
      fill
      className={cn("object-cover object-[center_18%]", className)}
      sizes={sizes}
      priority={priority}
      quality={88}
    />
  )
}
