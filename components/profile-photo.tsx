import { cn } from "@/lib/utils"
import { PROFILE_PHOTO_SRC } from "@/lib/media"

interface ProfilePhotoProps {
  alt?: string
  className?: string
}

/**
 * Foto de perfil recortada para no cortar la cabeza.
 * LCP: img nativo con width/height e inline styles, renderizado en el server.
 */
export function ProfilePhoto({
  alt = "Alejandro Repetto, ingeniero de software",
  className,
}: ProfilePhotoProps) {
  return (
    // Native img so LCP has intrinsic size before the CSS chunk arrives.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-lcp-photo=""
      src={PROFILE_PHOTO_SRC}
      alt={alt}
      width={540}
      height={618}
      fetchPriority="high"
      decoding="async"
      className={cn("object-cover object-[center_8%]", className)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center 8%",
      }}
    />
  )
}
