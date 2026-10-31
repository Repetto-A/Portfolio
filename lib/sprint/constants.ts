export const CALENDLY_URL = "https://calendly.com/alejandrorepetto/diagnostico-ia"
export const CRIA_URL = "https://somoscria.ar/"
export const ARGENTINA_SPACE_URL = "https://argentinaspace.com/"
export const NEXA_URL = "https://nexa.builders"
export const CONTACT_EMAIL = "contact@repetto-a.com"
export const WHATSAPP_NUMBER = "5493471337412"
export const WHATSAPP_PREFILL = "Hola Ale, vengo de la charla y quiero saber más del sprint de IA"
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`

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
  headline: "Lo armamos a tu ritmo: intensivo o sostenido",
  intensivo: {
    name: "Intensivo",
    detail: "3 clases de 1 h 30 por semana (lunes, miércoles y viernes).",
  },
  sostenido: {
    name: "Sostenido",
    detail: "1 clase de 2 h 30 por semana.",
  },
} as const

export const SPRINT_ANCHORS = {
  problem: "problema",
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
 * Orden de lectura para un ejecutivo: problema → oferta → para quién →
 * cómo → qué queda → formatos → (inversión) → gobernanza → quién →
 * prensa → garantía → FAQ → CTA.
 * Si los precios están ocultos, se recorre el índice para no dejar un hueco.
 */
const pricingOffset = SHOW_SPRINT_PRICING ? 1 : 0

export const SPRINT_SECTION_LABELS = {
  problem: "01 / El problema",
  promise: "02 / La propuesta",
  audience: "03 / Para quién",
  howItWorks: "04 / Cómo funciona",
  deliverables: "05 / Qué queda",
  formats: "06 / Formatos",
  pricing: "07 / Inversión",
  governance: `${sectionNum(7 + pricingOffset)} / Gobernanza`,
  about: `${sectionNum(8 + pricingOffset)} / Quién está detrás`,
  press: `${sectionNum(9 + pricingOffset)} / Prensa y apariciones`,
  guarantee: `${sectionNum(10 + pricingOffset)} / Garantía`,
  faq: `${sectionNum(11 + pricingOffset)} / Preguntas frecuentes`,
  cta: `${sectionNum(12 + pricingOffset)} / Siguiente paso`,
} as const

export type SprintAnchor = (typeof SPRINT_ANCHORS)[keyof typeof SPRINT_ANCHORS]

export type CTALocation = "hero" | "audience" | "pricing" | "guarantee" | "footer" | "fab"
