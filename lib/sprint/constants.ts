export const CALENDLY_URL = "https://calendly.com/alejandrorepetto/diagnostico-ia"
export const CRIA_URL = "https://somoscria.ar/"
export const ARGENTINA_SPACE_URL = "https://argentinaspace.com/"
export const NEXA_URL = "https://nexa.builders"
export const CONTACT_EMAIL = "contact@repetto-a.com"
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Sprint de IA")}`
export const WHATSAPP_NUMBER = "5493471337412"
export const WHATSAPP_PREFILL = "Hola Ale, quiero hablar del sprint de IA para mi empresa"
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`
export const LINKEDIN_URL = "https://www.linkedin.com/in/alejandro-repetto"
export const GITHUB_URL = "https://github.com/Repetto-A"

/**
 * Credencial personal, una línea de texto en about. No es highlight
 * de stack ni un respaldo de SpaceXSI sobre el sprint. Sin logo.
 */
export const SPACEXSI_AMBASSADOR_LABEL = "SpaceXSI Ambassador"

/** Copy único del siguiente paso. La charla diagnóstico es el peldaño de entrada (30 min, gratis). */
export const CTA_COPY = {
  primary: "Agendar una charla",
  primaryWithTime: "Agendar una charla de 30 min",
  secondary: "Escribime",
  whatsapp: "WhatsApp",
  whatsappAria: "Hablemos por WhatsApp",
  hint: "Treinta minutos, sin cargo. Vemos si aplica.",
} as const

/**
 * Precios públicos en /sprint.
 *
 * `false` para la charla del 28/10: el QR no debe mostrar montos.
 * Volver a `true` para reactivar la sección de Inversión (el componente
 * `SprintPricing` no se borra).
 */
export const SHOW_SPRINT_PRICING = false

/**
 * Bloque "Portal del sprint" (portal.repetto-a.com / panel de métricas).
 *
 * `false`: la plataforma no está lista. El componente `SprintPortalPreview`
 * y el markup en `SprintDeliverables` no se borran; volver a `true` para
 * reactivar la sección.
 */
export const SHOW_SPRINT_PORTAL = false

/** Cifra confirmada para prueba social. No inflar. */
export const TRAINED_PEOPLE_STAT = "+300"

export const SPRINT_PACES = {
  headline: "Intensivo o Sostenido, con 1.5 h por equipo por semana",
  intensivo: {
    name: "Intensivo",
    detail: "1.5 h por equipo por semana, días flexibles, 5 módulos que elige la empresa.",
  },
  sostenido: {
    name: "Sostenido",
    detail:
      "El mismo bloque de 1.5 h por equipo por semana, para mantener el trabajo en el tiempo.",
  },
} as const

export const SPRINT_ANCHORS = {
  problem: "problema",
  offer: "oferta",
  promise: "promesa",
  audience: "para-quien",
  howItWorks: "como-funciona",
  deliverables: "entregables",
  formats: "formatos",
  pricing: "inversion",
  governance: "gobernanza",
  about: "sobre-mi",
  press: "prensa",
  guarantee: "garantia",
  faq: "faq",
  cta: "agendar",
} as const

function sectionNum(n: number) {
  return String(n).padStart(2, "0")
}

/**
 * Orden de lectura: problema → oferta (escalera) → para quién →
 * cómo (3 pasos) → qué queda → (inversión) → gobernanza → quién →
 * prensa → garantía → FAQ → CTA.
 * Si los precios están ocultos, se recorre el índice para no dejar un hueco.
 */
const pricingOffset = SHOW_SPRINT_PRICING ? 1 : 0

export const SPRINT_SECTION_LABELS = {
  problem: "01 / El problema",
  offer: "02 / La oferta",
  promise: "02 / La oferta",
  audience: "03 / Para quién",
  howItWorks: "04 / Cómo funciona",
  deliverables: "05 / Qué queda",
  formats: "02 / La oferta",
  pricing: "06 / Inversión",
  governance: `${sectionNum(6 + pricingOffset)} / Gobernanza`,
  about: `${sectionNum(7 + pricingOffset)} / Quién está detrás`,
  press: `${sectionNum(8 + pricingOffset)} / Prensa y apariciones`,
  guarantee: `${sectionNum(9 + pricingOffset)} / Garantía`,
  faq: `${sectionNum(10 + pricingOffset)} / Preguntas frecuentes`,
  cta: `${sectionNum(11 + pricingOffset)} / Siguiente paso`,
} as const

export type SprintAnchor = (typeof SPRINT_ANCHORS)[keyof typeof SPRINT_ANCHORS]

export type CTALocation =
  | "hero"
  | "nav"
  | "audience"
  | "program"
  | "pricing"
  | "guarantee"
  | "footer"
  | "fab"
  | "sticky"
  | "home-hero"
  | "home-nav"
  | "home-trainings"
  | "home-contact"
  | "home-projects"
  | "project"
