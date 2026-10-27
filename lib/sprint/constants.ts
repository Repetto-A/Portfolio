export const CALENDLY_URL = "https://calendly.com/alejandrorepetto/diagnostico-ia"
export const CRIA_URL = "https://somoscria.ar/"
export const ARGENTINA_SPACE_URL = "https://argentinaspace.com/"
export const NEXA_URL = "https://nexa.builders"
export const CONTACT_EMAIL = "contact@repetto-a.com"

/**
 * Precios públicos en /sprint.
 *
 * `false` para la charla del 28/10: el QR no debe mostrar montos.
 * Volver a `true` para reactivar la sección 08 / Inversión (el componente
 * `SprintPricing` no se borra).
 */
export const SHOW_SPRINT_PRICING = false

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

export type SprintAnchor = (typeof SPRINT_ANCHORS)[keyof typeof SPRINT_ANCHORS]

export type CTALocation = "hero" | "audience" | "pricing" | "guarantee" | "footer"
