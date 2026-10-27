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
 * Volver a `true` para reactivar la sección 08 / Inversión (el componente
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

export const SPRINT_ANCHORS = {
  problem: "problema",
  promise: "promesa",
  howItWorks: "como-funciona",
  deliverables: "entregables",
  governance: "gobernanza",
  audience: "para-quien",
  formats: "formatos",
  pricing: "inversion",
  guarantee: "garantia",
  about: "sobre-mi",
  press: "prensa",
  faq: "faq",
  cta: "agendar",
} as const

function sectionNum(n: number) {
  return String(n).padStart(2, "0")
}

/** Si los precios están ocultos, 08+ se recorre para no dejar un hueco. */
const afterFormats = SHOW_SPRINT_PRICING ? 8 : 7

export const SPRINT_SECTION_LABELS = {
  problem: "01 / El problema",
  promise: "02 / La propuesta",
  howItWorks: "03 / Cómo funciona",
  deliverables: "04 / Entregables",
  governance: "05 / Gobernanza",
  audience: "06 / Para quién",
  formats: "07 / Formatos",
  pricing: "08 / Inversión",
  guarantee: `${sectionNum(afterFormats + 1)} / Garantía`,
  about: `${sectionNum(afterFormats + 2)} / Quién está detrás`,
  press: `${sectionNum(afterFormats + 3)} / Prensa y apariciones`,
  faq: `${sectionNum(afterFormats + 4)} / Preguntas frecuentes`,
  cta: `${sectionNum(afterFormats + 5)} / Siguiente paso`,
} as const

export type SprintAnchor = (typeof SPRINT_ANCHORS)[keyof typeof SPRINT_ANCHORS]

export type CTALocation = "hero" | "audience" | "pricing" | "guarantee" | "footer" | "fab"
