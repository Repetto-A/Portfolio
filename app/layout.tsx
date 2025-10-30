import type React from "react"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n-context"

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
  icons: {
    icon: "/favicon.ico",
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
