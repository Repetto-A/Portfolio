import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import nodemailer from "nodemailer"
import {
  checkRateLimit,
  contactFormSchema,
  generateEmailContent,
  sanitizeInput,
  validateCsrfToken,
} from "@/lib/email"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production"
      ? "https://repetto-a.com"
      : "http://localhost:3000",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-CSRF-Token",
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown"

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Demasiadas solicitudes. Por favor, inténtalo más tarde." },
      { status: 429, headers: CORS_HEADERS }
    )
  }

  const contentLength = request.headers.get("content-length")
  if (contentLength && parseInt(contentLength) > 10240) {
    return NextResponse.json(
      { success: false, error: "El contenido es demasiado grande." },
      { status: 413, headers: CORS_HEADERS }
    )
  }

  try {
    const csrfToken = request.headers.get("X-CSRF-Token")
    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get("__Host-csrf")?.value || cookieStore.get("csrf_token")?.value

    if (!validateCsrfToken(csrfToken, csrfCookie || null)) {
      return NextResponse.json(
        { success: false, error: "Token CSRF inválido." },
        { status: 403, headers: CORS_HEADERS }
      )
    }

    const body = await request.json()
    const parsed = contactFormSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Datos inválidos"
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const { name, email, subject, message } = parsed.data

    const payload = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      timestamp: new Date().toISOString(),
    }

    // Verificar variables de entorno
    const requiredEnvVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM"]
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Error de configuración del servidor. Por favor, contacta al administrador.",
        },
        { status: 500, headers: CORS_HEADERS }
      )
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
    })

    const { text, html } = generateEmailContent(payload)

    // Opciones del correo
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: "contact@repetto-a.com",
      replyTo: `${payload.name} <${payload.email}>`,
      subject: `[Portfolio] ${payload.subject}`,
      text,
      html,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      {
        success: true,
        message: "¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.",
      },
      { status: 200, headers: CORS_HEADERS }
    )
  } catch (error: unknown) {
    console.error("Error sending email:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.",
      },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: CORS_HEADERS,
  })
}
