import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { checkRateLimit, generateCsrfToken } from "@/lib/email"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production"
      ? "https://repetto-a.com"
      : "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-CSRF-Token",
  "Access-Control-Allow-Credentials": "true",
}

const isProd = process.env.NODE_ENV === "production"

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown"

  if (!checkRateLimit(ip, 30, 60 * 1000)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes" },
      { status: 429, headers: CORS_HEADERS }
    )
  }

  const token = generateCsrfToken()
  const cookieStore = await cookies()

  cookieStore.set(isProd ? "__Host-csrf" : "csrf_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 3600,
  })

  return NextResponse.json({ token }, { status: 200, headers: CORS_HEADERS })
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS })
}
