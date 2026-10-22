export type SprintAward = {
  event: string
  result: string
  project: string
}

/**
 * Premios enmarcados como credibilidad de ejecución, no como trofeos.
 * Orden: primero el caso con cliente industrial real (mapea 1:1 con la oferta),
 * después la marca más reconocible (NASA), después el resto por recencia.
 */
export const SPRINT_AWARDS: SprintAward[] = [
  { event: "Vercel Hackathon 2026", result: "2º puesto + Nvidia for Startups", project: "Visión artificial para control de calidad en La Virginia" },
  { event: "NASA Space Apps 2025", result: "Local Award Winner y Global Nominee", project: "Simulador educativo con datos satelitales" },
  { event: "Platanus Hack 2026", result: "Favorito del jurado", project: "Kernel de permisos para agentes de IA" },
  { event: "ETH Global 2025", result: "2nd best dApp (Filecoin)", project: "Escrow DeFi de ahorro gamificado" },
  { event: "ETH Argentina 2025", result: "Best PowerHouse App", project: "Operaciones de DAOs" },
]

export type SprintPressLink = {
  source: string
  title: string
  /** Link en vivo a la nota/video. Opcional: si no hay, se muestra como texto. */
  url?: string
  type: "article" | "video"
}

/**
 * Cobertura completa: notas, entrevistas y videos.
 * Soporte de autoridad B2B, no el centro de la venta. Links donde están disponibles.
 */
export const SPRINT_PRESS: SprintPressLink[] = [
  {
    source: "Telefe Rosario",
    title: "Un simulador educativo que usa datos de la NASA",
    url: "https://rosario.mitelefe.com/rosario-y-la-region/farm-hero-un-simulador-educativo-que-usa-datos-de-la-nasa-para-salvar-tierras-degradadas-gano-el-space-apps-rosario-pid2107290",
    type: "article",
  },
  {
    source: "La Capital",
    title: "Crearon un videojuego que usa datos satelitales y será evaluado por la NASA",
    url: "https://www.lacapital.com.ar/la-ciudad/estudian-la-utn-crearon-un-videojuego-que-usa-datos-satelitales-y-seran-evaluados-la-nasa-n10226894.html",
    type: "article",
  },
  {
    source: "El Ciudadano",
    title: "Ganó el NASA Space Apps Rosario",
    url: "https://elciudadanoweb.com/la-decima-edicion-de-la-nasa-space-apps-rosario-tuvo-como-ganador-un-simulador-educativo-para-salvar-tierras-degradadas/",
    type: "article",
  },
  { source: "EcoBiz", title: "Innovación con datos satelitales para el agro", type: "article" },
  { source: "RosarioNet", title: "Un proyecto rosarino premiado por la NASA", type: "article" },
  { source: "RTS", title: "Simulador para cuidar los suelos compite en la NASA", type: "article" },
  { source: "Conclusión", title: "Jóvenes de Rosario destacados en el Space Apps", type: "article" },
  { source: "SocialDay", title: "Nota sobre el proyecto ganador", type: "article" },
  { source: "Diario Cañada", title: "Talento regional en un certamen de la NASA", type: "article" },
  { source: "Radiofónica", title: "Entrevista radial sobre el proyecto", type: "article" },
  { source: "FM Chalet", title: "Entrevista radial sobre trayectoria y hackathons", type: "article" },
  {
    source: "Videonota · Telefe",
    title: "Entrevista en vivo en el piso de Telefe",
    url: "https://www.youtube.com/watch?v=AKmk02azm70",
    type: "video",
  },
  { source: "Videonota · RTS", title: "Móvil en vivo sobre el proyecto", type: "video" },
  {
    source: "Streaming · La Ciudad Media",
    title: "Entrevista en streaming (Rosario)",
    type: "video",
  },
  {
    source: "Streaming · WOX",
    title: "Mentes brillantes: entrevista",
    url: "https://youtu.be/OmlAqSCBfN0",
    type: "video",
  },
]

export const SPRINT_PRESS_TOTAL = SPRINT_PRESS.length

export type SprintPressLogo = {
  src: string
  alt: string
  /** Dimensiones intrínsecas para next/image */
  w: number
  h: number
  /** Altura de render (clase Tailwind), calibrada ópticamente por logo */
  className: string
  /** Link a una nota de ese medio, si está disponible */
  url?: string
}

/**
 * Logos para el marquee de prensa. Monocromo adaptativo al tema en sprint-press.tsx.
 */
export const SPRINT_PRESS_LOGOS: SprintPressLogo[] = [
  { src: "/sprint/media/la-capital.svg", alt: "La Capital", w: 325, h: 40, className: "h-5", url: "https://www.lacapital.com.ar/la-ciudad/estudian-la-utn-crearon-un-videojuego-que-usa-datos-satelitales-y-seran-evaluados-la-nasa-n10226894.html" },
  { src: "/sprint/media/el-ciudadano.png", alt: "El Ciudadano", w: 768, h: 120, className: "h-5", url: "https://elciudadanoweb.com/la-decima-edicion-de-la-nasa-space-apps-rosario-tuvo-como-ganador-un-simulador-educativo-para-salvar-tierras-degradadas/" },
  { src: "/sprint/media/rts.png", alt: "RTS Medios", w: 589, h: 424, className: "h-10" },
  { src: "/sprint/media/telefe.png", alt: "Telefe Rosario", w: 130, h: 72, className: "h-9", url: "https://rosario.mitelefe.com/rosario-y-la-region/farm-hero-un-simulador-educativo-que-usa-datos-de-la-nasa-para-salvar-tierras-degradadas-gano-el-space-apps-rosario-pid2107290" },
  { src: "/sprint/media/ecobiz.png", alt: "EcoBiz", w: 260, h: 50, className: "h-5" },
  { src: "/sprint/media/conclusion.png", alt: "Conclusión", w: 640, h: 200, className: "h-8" },
  { src: "/sprint/media/radiofonica.svg", alt: "Radiofónica", w: 431, h: 50, className: "h-5" },
  { src: "/sprint/media/rosarionet.png", alt: "RosarioNet", w: 459, h: 114, className: "h-8" },
]
