export type LocalizedCurriculumModule = {
  title: { es: string; en: string }
  summary: { es: string; en: string }
  topics: readonly string[]
}

/**
 * Programa modular de 5 bloques. Fuente única para /sprint (es) y la
 * sección de capacitaciones del home. No inventar módulos: esto es lo
 * que ya está publicado en la oferta.
 */
export const SPRINT_CURRICULUM: readonly LocalizedCurriculumModule[] = [
  {
    title: { es: "Panorama de IA y seguridad", en: "AI landscape and security" },
    summary: {
      es: "Qué plan usar en la empresa y qué no.",
      en: "Which plan to use in the company, and which not to.",
    },
    topics: ["Qué plan usar", "Qué no usar", "Criterio de seguridad"],
  },
  {
    title: { es: "IA local vs propietaria, y Gemini", en: "Local vs proprietary AI, and Gemini" },
    summary: {
      es: "Cuándo conviene local, cuándo un modelo propietario, y dónde entra Gemini.",
      en: "When local makes sense, when a proprietary model does, and where Gemini fits.",
    },
    topics: ["IA local", "Modelos propietarios", "Gemini"],
  },
  {
    title: {
      es: "Desarrollo con agentes en Cursor y Grok Bot",
      en: "Agent development in Cursor and Grok Bot",
    },
    summary: {
      es: "SDD, skills, hooks, MCP, agents.md y memories. Claude Code también, y Claude Code dedicado a pedido.",
      en: "SDD, skills, hooks, MCP, agents.md and memories. Claude Code too, and dedicated Claude Code on request.",
    },
    topics: [
      "SDD",
      "Skills",
      "Hooks",
      "MCP",
      "agents.md",
      "Memories",
      "Claude Code",
      "Claude Code dedicado a pedido",
    ],
  },
  {
    title: { es: "Datos", en: "Data" },
    summary: {
      es: "RAG, knowledge graphs y Engram.",
      en: "RAG, knowledge graphs and Engram.",
    },
    topics: ["RAG", "Knowledge graphs", "Engram"],
  },
  {
    title: { es: "Automatización y agentes", en: "Automation and agents" },
    summary: {
      es: "n8n, LangChain y LangGraph.",
      en: "n8n, LangChain and LangGraph.",
    },
    topics: ["n8n", "LangChain", "LangGraph"],
  },
]
