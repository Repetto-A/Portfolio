import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "AI Execution Sprint: tu equipo construye prototipos de IA en 30 días | Alejandro Repetto",
  description:
    "Sprint de 30 días para empresas: diagnóstico, capacitación aplicada y hackathon interna. Termina con prototipos funcionales construidos por tu propio equipo y un roadmap de 90 días.",
  alternates: {
    canonical: "https://www.repetto-a.com/sprint",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://www.repetto-a.com/sprint",
    title: "AI Execution Sprint: prototipos de IA construidos por tu equipo en 30 días",
    description:
      "Diagnóstico, capacitación aplicada y hackathon interna. Tu equipo termina con prototipos funcionando sobre sus propios procesos.",
    siteName: "Alejandro Repetto",
    images: [
      {
        url: "https://www.repetto-a.com/sprint/og.jpg",
        width: 1200,
        height: 630,
        alt: "Alejandro Repetto — AI Execution Sprint",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Execution Sprint: prototipos de IA construidos por tu equipo en 30 días",
    description:
      "Diagnóstico, capacitación aplicada y hackathon interna. Tu equipo termina con prototipos funcionando sobre sus propios procesos.",
    images: ["https://www.repetto-a.com/sprint/og.jpg"],
  },
  robots: { index: true, follow: true },
}

export default function SprintLayout({ children }: { children: ReactNode }) {
  return (
    <div
      lang="es"
      style={{ ["--sprint-accent" as string]: "oklch(0.62 0.19 38)" }}
      className="min-h-screen bg-background text-foreground"
    >
      {children}
    </div>
  )
}
