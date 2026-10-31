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
 * `object-[center_8%]` deja aire arriba del pelo en recortes cuadrados.
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
      className={cn("object-cover object-[center_8%]", className)}
      sizes={sizes}
      priority={priority}
      quality={88}
    />
  )
}
