import type React from "react"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Alejandro Repetto - Systems Engineer & AI/ML Developer",
  description:
    "Portfolio of Alejandro Repetto, a 23-year-old systems engineering student specializing in management systems, automation, and AI/ML development.",
  keywords: ["systems engineering", "AI/ML", "automation", "web development", "portfolio"],
  authors: [{ name: "Alejandro Repetto" }],
  metadataBase: new URL("https://repetto-a.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Alejandro Repetto - Systems Engineer & AI/ML Developer",
    description: "Portfolio showcasing projects in management systems, automation, and AI/ML development.",
    type: "website",
    locale: "en_US",
    url: "https://repetto-a.com",
    siteName: "Alejandro Repetto Portfolio",
    images: [
      {
        url: 'https://repetto-a.com/og-image.png',
        width: 1200,
        height: 630,
        alt: "Alejandro Repetto - Systems Engineer & AI/ML Developer",
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alejandro Repetto - Systems Engineer & AI/ML Developer",
    description: "Portfolio showcasing projects in management systems, automation, and AI/ML development.",
    images: [new URL('/og-image.png', 'https://repetto-a.com').toString()],
    creator: '@tuusuario', // Reemplaza con tu usuario de Twitter si lo tienes
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Alejandro Repetto",
              jobTitle: "Systems Engineering Student",
              description:
                "Systems engineering student specializing in management systems, automation, and AI/ML development",
              url: "https://repetto-a.com",
              sameAs: ["https://github.com/Repetto-A", "https://linkedin.com/in/alex-repetto"],
              knowsAbout: [
                "Systems Engineering",
                "Artificial Intelligence",
                "Machine Learning",
                "Automation",
                "Web Development",
                "Management Systems",
              ],
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "Systems Engineering Program",
              },
            }),
          }}
        />
        <script defer data-domain="repetto-a.com" src="https://plausible.io/js/script.js"></script>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
