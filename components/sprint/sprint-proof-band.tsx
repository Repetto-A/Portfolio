import Image from "next/image"

/**
 * Banda visual full-bleed: Alejandro presentando en vivo ante una sala.
 */
export function SprintProofBand() {
  return (
    <section aria-label="Alejandro Repetto presentando ante una audiencia">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black sm:aspect-[2/1]">
        <Image
          src="/sprint/speaker.jpg"
          alt="Alejandro Repetto presentando en Platanus Hack 2026"
          fill
          sizes="100vw"
          className="sprint-kenburns object-cover object-center"
          priority={false}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent sm:h-24"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent sm:h-24"
        />
      </div>
    </section>
  )
}
