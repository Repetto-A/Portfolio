import Image from "next/image"

/**
 * Banda visual full-bleed: Alejandro presentando en vivo ante una sala.
 * Esta no es la foto de perfil: se deja speaker.jpg a propósito.
 */
export function SprintProofBand() {
  return (
    <section aria-label="Alejandro Repetto presentando ante una audiencia">
      {/*
        La foto es de un escenario oscuro: el mate negro es el soporte de la
        imagen, no una sección "stuck" en dark. Los fades usan --background
        para fundirse con el tema de la página (papel o OLED).
      */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--sprint-photo-matte)] sm:aspect-[2/1]">
        <Image
          src="/sprint/speaker.jpg"
          alt="Alejandro Repetto presentando en Platanus Hack 2026"
          fill
          sizes="100vw"
          quality={72}
          className="sprint-kenburns object-cover object-center"
          priority={false}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
        />
        <div
          aria-hidden
          className="sprint-proof-fade absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent sm:h-24"
        />
        <div
          aria-hidden
          className="sprint-proof-fade absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent sm:h-24"
        />
      </div>
    </section>
  )
}
