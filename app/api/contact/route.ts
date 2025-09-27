import { type NextRequest, NextResponse } from "next/server"
import {
  checkRateLimit,
  sanitizeInput,
  validateEmail,
  createSMTPTransporter,
  generateEmailContent,
  queueMessage,
  processMessageQueue,
  type EmailData,
  type SMTPConfig,
} from "@/lib/email"

// Simple in-memory CAPTCHA store (in production, use Redis)
const captchaStore = new Map<string, { answer: number; expires: number }>()

function generateCaptcha(): { question: string; answer: number; token: string } {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  const answer = a + b
  const token = Math.random().toString(36).substr(2, 9)

  captchaStore.set(token, { answer, expires: Date.now() + 5 * 60 * 1000 }) // 5 minutes

  return { question: `${a} + ${b} = ?`, answer, token }
}

function verifyCaptcha(token: string, userAnswer: number): boolean {
  const stored = captchaStore.get(token)
  if (!stored || Date.now() > stored.expires) {
    captchaStore.delete(token)
    return false
  }

  captchaStore.delete(token)
  return stored.answer === userAnswer
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  if (realIP) {
    return realIP
  }
  return "unknown"
}

function getSMTPConfig(): SMTPConfig | null {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const password = process.env.SMTP_PASSWORD
  const from = process.env.SMTP_FROM

  if (!host || !port || !user || !password || !from) {
    console.error(
      "Missing SMTP configuration. Required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM",
    )
    return null
  }

  return {
    host,
    port: Number.parseInt(port, 10),
    user,
    password,
    from,
  }
}

export async function GET() {
  // Generate CAPTCHA for the form
  const captcha = generateCaptcha()
  return NextResponse.json({
    captcha: {
      question: captcha.question,
      token: captcha.token,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)

    // Rate limiting
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    const { name, email, subject, message, captchaToken, captchaAnswer } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate CAPTCHA
    if (!captchaToken || typeof captchaAnswer !== "number" || !verifyCaptcha(captchaToken, captchaAnswer)) {
      return NextResponse.json({ error: "Invalid CAPTCHA. Please try again." }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
    }

    // Validate email format
    if (!validateEmail(sanitizedData.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate input lengths
    if (sanitizedData.name.length > 100 || sanitizedData.subject.length > 200 || sanitizedData.message.length > 5000) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 })
    }

    const emailData: EmailData = {
      ...sanitizedData,
      timestamp: new Date().toISOString(),
      ip: clientIP,
    }

    const smtpConfig = getSMTPConfig()

    if (!smtpConfig) {
      // Development mode - just log the message
      if (process.env.NODE_ENV === "development") {
        console.log("📧 [DEV MODE] Contact form submission:", emailData)
        return NextResponse.json({ message: "Message logged successfully (dev mode)" }, { status: 200 })
      }

      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    try {
      // Try to send immediately
      const transporter = createSMTPTransporter(smtpConfig)
      const { text, html } = generateEmailContent(emailData)

      await transporter.sendMail({
        from: smtpConfig.from,
        to: "repettoalejandroing@gmail.com",
        replyTo: sanitizedData.email,
        subject: "New message from portfolio contact form",
        text,
        html,
      })

      console.log("✅ Email sent successfully to repettoalejandroing@gmail.com")
      return NextResponse.json({ message: "Message sent successfully" }, { status: 200 })
    } catch (emailError) {
      console.error("❌ Failed to send email immediately, queuing for retry:", emailError)

      // Queue for retry
      const messageId = await queueMessage(emailData)

      // Process queue in background (in production, use a proper job queue)
      setTimeout(() => processMessageQueue(smtpConfig), 1000)

      return NextResponse.json(
        {
          message: "Message queued for delivery",
          messageId,
        },
        { status: 202 },
      )
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
