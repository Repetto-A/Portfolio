import Image from "next/image"
import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SprintPressModal } from "./sprint-press-modal"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"
import { SPRINT_PRESS_LOGOS, type SprintPressLogo } from "@/lib/sprint/proof"

function PressLogo({ logo }: { logo: SprintPressLogo }) {
  const img = (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.w}
      height={logo.h}
      className={`${logo.className} w-auto object-contain opacity-50 transition-opacity duration-300 [filter:brightness(0)] group-hover/logo:opacity-90 dark:opacity-55 dark:[filter:brightness(0)_invert(1)] dark:group-hover/logo:opacity-100`}
    />
  )

  if (logo.url) {
    return (
      <a
        href={logo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group/logo inline-flex items-center"
        aria-label={`${logo.alt}, abrir nota`}
      >
        {img}
      </a>
    )
  }

  return (
    <span className="group/logo inline-flex items-center" aria-label={logo.alt}>
      {img}
    </span>
  )
}

export function SprintPress() {
  return (
    <SprintSection
      id={SPRINT_ANCHORS.press}
      label={SPRINT_SECTION_LABELS.press}
      spacing="compact"
      tint
    >
      <SprintHeading>Prensa y apariciones</SprintHeading>
      <SprintProse lead>
        <p>Notas, entrevistas y videos sobre proyectos, hackatones y trayectoria pública.</p>
      </SprintProse>

      <div
        className="sprint-marquee-viewport relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_92%,transparent)]"
        aria-label="Medios que cubrieron proyectos y apariciones"
      >
        <div className="sprint-marquee items-center gap-12 pl-16 pr-12 sm:pl-24">
          {SPRINT_PRESS_LOGOS.map((logo) => (
            <PressLogo key={logo.src} logo={logo} />
          ))}
          <span className="sprint-marquee-dup contents" aria-hidden>
            {SPRINT_PRESS_LOGOS.map((logo) => (
              <PressLogo key={`dup-${logo.src}`} logo={logo} />
            ))}
          </span>
        </div>
      </div>

      <div className="mt-8">
        <SprintPressModal />
      </div>
    </SprintSection>
  )
}
