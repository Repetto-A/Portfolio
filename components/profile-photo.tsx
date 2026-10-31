import { cn } from "@/lib/utils"
import { PROFILE_PHOTO_DATA_URI } from "@/lib/lcp-photo-uri"

interface ProfilePhotoProps {
  alt?: string
  className?: string
}

/**
 * Foto de perfil recortada para no cortar la cabeza.
 * LCP: img nativo inline (data URI) con width/height para no esperar CSS ni otra request.
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
      src={PROFILE_PHOTO_DATA_URI}
      alt={alt}
      width={720}
      height={823}
      fetchPriority="high"
      decoding="sync"
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
