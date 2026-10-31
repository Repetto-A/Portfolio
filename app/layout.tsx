import { type ReactNode } from "react"
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n-context"
import {
  generateMetadata as genMetadata,
  generatePersonSchema,
  generateWebSiteSchema,
  siteConfig,
} from "@/lib/seo"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ScrollProvider } from "@/lib/scroll-context"
import { FloatingTitle } from "@/components/floating-title"
import { SkipLink } from "@/components/skip-link"

const showVercelTelemetry = process.env.VERCEL === "1"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
  fallback: ["Courier New", "monospace"],
})

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-sprint-display",
  display: "swap",
  axes: ["opsz"],
  adjustFontFallback: false,
})

export const metadata: Metadata = genMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  canonical: siteConfig.url,
  ogType: "profile",
  keywords: siteConfig.keywords,
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const personSchema = generatePersonSchema()
  const webSiteSchema = generateWebSiteSchema()

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${newsreader.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        {/* /sprint fuerza dark (default) o light (?theme=light) antes del paint. No toca otras rutas. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname.replace(/\\/+$/,"")||"/";if(p!=="/sprint")return;var t=new URLSearchParams(location.search).get("theme")==="light"?"light":"dark";var r=document.documentElement;r.classList.remove("light","dark","sprint-light");r.classList.add(t);if(t==="light")r.classList.add("sprint-light");r.style.colorScheme=t;r.lang="es";}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <SkipLink />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <I18nProvider>
            <ScrollProvider>
              <FloatingTitle />
              {children}
            </ScrollProvider>
            {showVercelTelemetry ? (
              <>
                <Analytics />
                <SpeedInsights />
              </>
            ) : null}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
