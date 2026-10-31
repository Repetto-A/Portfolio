import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "AI Execution Sprint: de hablar de IA a ejecutar con IA, en 30 días | Alejandro Repetto",
  description:
    "Arrancás con una charla diagnóstico de 30 minutos, sin cargo. Después, sprint de 30 días: capacitación aplicada y hackathon interna. Tu equipo termina con prototipos, reglas de uso y un roadmap de 90 días.",
  alternates: {
    canonical: "https://www.repetto-a.com/sprint",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://www.repetto-a.com/sprint",
    title: "AI Execution Sprint: de hablar de IA a ejecutar con IA, en 30 días",
    description:
      "Charla diagnóstico de 30 minutos, sin cargo. Después, capacitación aplicada y hackathon interna. Tu equipo termina con prototipos, gobernanza y un roadmap de 90 días.",
    siteName: "Alejandro Repetto",
    images: [
      {
        url: "https://www.repetto-a.com/sprint/og.jpg",
        width: 1200,
        height: 630,
        alt: "Alejandro Repetto, AI Execution Sprint",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Execution Sprint: de hablar de IA a ejecutar con IA, en 30 días",
    description:
      "Charla diagnóstico de 30 minutos, sin cargo. Después, capacitación aplicada y hackathon interna. Tu equipo termina con prototipos, gobernanza y un roadmap de 90 días.",
    images: ["https://www.repetto-a.com/sprint/og.jpg"],
  },
  robots: { index: true, follow: true },
}

export default function SprintLayout({ children }: { children: ReactNode }) {
  return <div lang="es">{children}</div>
}
