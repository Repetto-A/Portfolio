export const CALENDLY_URL = "https://calendly.com/alejandrorepetto/diagnostico-ia"
export const CRIA_URL = "https://www.cria.website/"
export const ARGENTINA_SPACE_URL = "https://argentinaspace.com/"
export const NEXA_URL = "https://nexa.builders"

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
