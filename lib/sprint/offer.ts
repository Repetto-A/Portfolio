export const SPRINT_CLIENTS = ["Banco Nación", "Banco Galicia", "IT Patagonia", "Frisbee"] as const

export const TRAINED_PEOPLE_LABEL = {
  es: "personas capacitadas",
  en: "people trained",
} as const

export const CONTACT_INTEREST_VALUES = [
  "charla",
  "intensivo",
  "sostenido",
  "directivos",
  "otro",
] as const satisfies readonly [string, ...string[]]

export type ContactInterest = (typeof CONTACT_INTEREST_VALUES)[number]

export const CONTACT_INTEREST_ENUM = CONTACT_INTEREST_VALUES as unknown as [
  ContactInterest,
  ...ContactInterest[],
]

export const CONTACT_INTEREST_LABELS: Record<ContactInterest, { es: string; en: string }> = {
  charla: { es: "Charla diagnóstico (30 min, gratis)", en: "Diagnostic chat (30 min, free)" },
  intensivo: { es: "Intensivo", en: "Intensive" },
  sostenido: { es: "Sostenido", en: "Sustained" },
  directivos: { es: "Sesión para directivos", en: "Session for executives" },
  otro: { es: "Otro", en: "Other" },
}

type OfferCopy = {
  name: string
  tag: string
  detail: string
  badge?: string
}

export type SprintOfferCopy = {
  headline: string
  lead: string
  facts: string
  rungs: readonly [OfferCopy, OfferCopy, OfferCopy]
  side: OfferCopy
}

export const SPRINT_OFFER: { es: SprintOfferCopy; en: SprintOfferCopy } = {
  es: {
    headline: "Arrancás con una charla diagnóstico de 30 minutos. Después Intensivo o Sostenido.",
    lead: "La entrada es una charla diagnóstico de 30 minutos, sin cargo. Si aplica, el equipo entra a Intensivo o a Sostenido. Dirección puede pedir una sesión aparte.",
    facts: "1.5 h por equipo por semana · Días flexibles · 5 módulos",
    rungs: [
      {
        name: "Charla diagnóstico gratis (30 min)",
        tag: "Entrada",
        badge: "Gratis",
        detail:
          "Vemos si hay casos concretos de IA en tu operación y si Intensivo o Sostenido aplican. Sin compromiso.",
      },
      {
        name: "Intensivo",
        tag: "Equipos",
        detail:
          "1.5 h por equipo por semana, días flexibles, 5 módulos que elige la empresa. El programa de trabajo con tu gente.",
      },
      {
        name: "Sostenido",
        tag: "Equipos",
        detail:
          "El mismo bloque de 1.5 h por equipo por semana, para mantener el trabajo en el tiempo.",
      },
    ],
    side: {
      name: "Sesión para directivos",
      tag: "Dirección",
      detail:
        "Aparte de la escalera de equipos. Para dirección que quiere criterio antes de meter al equipo.",
    },
  },
  en: {
    headline: "You start with a 30-minute diagnostic chat. Then Intensive or Sustained.",
    lead: "The entry step is a 30-minute diagnostic chat, free of charge. If it fits, the team goes into Intensive or Sustained. Leadership can book a separate session.",
    facts: "1.5 h per team per week · Flexible days · 5 modules",
    rungs: [
      {
        name: "Free diagnostic chat (30 min)",
        tag: "Entry",
        badge: "Free",
        detail:
          "We see if there are concrete AI cases in your operation and whether Intensive or Sustained applies. No commitment.",
      },
      {
        name: "Intensive",
        tag: "Teams",
        detail:
          "1.5 h per team per week, flexible days, 5 modules the company chooses. The working program with your people.",
      },
      {
        name: "Sustained",
        tag: "Teams",
        detail: "The same 1.5 h per team per week block, to keep the work going over time.",
      },
    ],
    side: {
      name: "Session for executives",
      tag: "Leadership",
      detail:
        "Separate from the team ladder. For leadership that wants judgment before bringing the team in.",
    },
  },
}

export const SPRINT_HOW_STEPS = [
  {
    title: "Diagnóstico",
    body: "Mapeo procesos con tu equipo y vemos dónde la IA tiene sentido real. Priorizamos por impacto y esfuerzo.",
  },
  {
    title: "1.5 h por equipo por semana",
    body: "Un bloque de 1.5 h por equipo por semana, en días flexibles. Sobre 5 módulos que elige la empresa. Trabajamos sobre sus procesos, no sobre ejemplos genéricos.",
  },
  {
    title: "Casos reales funcionando",
    body: "El equipo sale con casos reales funcionando: prototipos sobre su operación, no un PDF.",
  },
] as const

export const SPRINT_FAQS: { q: string; a: string }[] = [
  {
    q: "La charla diagnóstico tiene costo?",
    a: "No. Son 30 minutos, sin cargo y sin compromiso. Si Intensivo o Sostenido no aplican, lo decimos en esa charla.",
  },
  {
    q: "Qué pasa en la 1.5 h por equipo?",
    a: "Es el bloque de trabajo con tu gente. Sacamos dudas, bajamos el laboratorio y aplicamos IA sobre procesos reales del equipo, no sobre ejemplos genéricos. Días flexibles.",
  },
  {
    q: "En qué se diferencia Intensivo de Sostenido?",
    a: "Los dos usan 1.5 h por equipo por semana, días flexibles y 5 módulos que elige la empresa. Intensivo es el programa de trabajo con el equipo. Sostenido es para mantener ese ritmo en el tiempo. Lo afinamos en la charla diagnóstico.",
  },
  {
    q: "Es remoto o presencial?",
    a: "A coordinar. Lo vemos en la charla diagnóstico, según el equipo y la sede.",
  },
  {
    q: "Qué se llevan los equipos?",
    a: "Prototipos sobre casos reales de la operación, criterio para seguir usándolos, reglas de uso y un roadmap de 90 días.",
  },
  {
    q: "Qué es la sesión para directivos?",
    a: "Una sesión aparte, para dirección. No reemplaza Intensivo ni Sostenido: es para quien necesita criterio antes de meter al equipo.",
  },
]

export function generateSprintFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SPRINT_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }
}
