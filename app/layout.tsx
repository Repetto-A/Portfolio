import { type ReactNode } from "react"
import localFont from "next/font/local"
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

const inter = localFont({
  src: "../public/fonts/inter-latin.woff2",
  variable: "--font-inter",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: "Arial",
  weight: "100 900",
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
      className={`${inter.variable} dark`}
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
        <style
          dangerouslySetInnerHTML={{
            __html:
              "[data-hero-photo]{position:relative;width:100%;aspect-ratio:4/5}[data-hero-photo] img[data-lcp-photo]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 8%}@media (min-width:1024px){[data-hero-photo]{aspect-ratio:1}}",
          }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <I18nProvider>
            <SkipLink />
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
