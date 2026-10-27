/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  output: "standalone",
  images: {
    unoptimized: false, // Habilitar la optimización de imágenes
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: process.env.PORT || "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Configuración para servir archivos estáticos
  async headers() {
    // En desarrollo, Next usa `eval` para HMR/react-refresh. Sin 'unsafe-eval'
    // la hidratación se rompe y nada interactivo funciona en local. En producción
    // Next no usa eval, así que la CSP se mantiene estricta.
    const isDev = process.env.NODE_ENV === "development"
    const scriptSrc = [
      "script-src 'self' 'unsafe-inline'",
      isDev ? "'unsafe-eval'" : null,
      "https://www.googletagmanager.com",
    ]
      .filter(Boolean)
      .join(" ")

    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          scriptSrc,
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: https:",
          "font-src 'self' https://fonts.gstatic.com",
          "connect-src 'self' https://*.vercel-insights.com https://*.analytics.vercel.com",
          "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
          "frame-ancestors 'none'",
          "form-action 'self'",
          "base-uri 'self'",
        ].join("; "),
      },
    ]

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/projects/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
}

export default nextConfig
