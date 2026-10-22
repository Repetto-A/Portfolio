import { z } from "zod"
import crypto from "crypto"

export const contactFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100, "El nombre es demasiado largo"),
  email: z.string().email("Formato de email inválido").max(254, "El email es demasiado largo"),
  subject: z.string().min(1, "El asunto es obligatorio").max(200, "El asunto es demasiado largo"),
  message: z
    .string()
    .min(1, "El mensaje es obligatorio")
    .max(5000, "El mensaje es demasiado largo"),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export interface EmailData {
  name: string
  email: string
  subject: string
  message: string
  timestamp: string
  ip?: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  ip: string,
  maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "5", 10),
  windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10)
): boolean {
  const now = Date.now()
  const key = ip
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export function generateCsrfToken(): string {
  return crypto.randomUUID()
}

export function validateCsrfToken(token: string | null, expected: string | null): boolean {
  if (!token || !expected) return false
  if (token.length !== expected.length) return false
  const tokenBuf = Buffer.from(token)
  const expectedBuf = Buffer.from(expected)
  return crypto.timingSafeEqual(tokenBuf, expectedBuf)
}

export function sanitizeInput(input: string): string {
  const cleaned = input.replace(/[\0\r\n\t]/g, " ").trim()
  return cleaned.replace(/<[^>]*>/g, "")
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function generateEmailContent(data: EmailData): { text: string; html: string } {
  const text = `
New portfolio inquiry

From: ${data.name}
Email: ${data.email}
Subject: ${data.subject}
Timestamp: ${data.timestamp}
${data.ip ? `IP: ${data.ip}` : ""}

Message:
${data.message}

---
Alejandro Repetto
repetto-a.com
  `.trim()

  const rows = [
    ["From", escapeHtml(data.name)],
    [
      "Email",
      `<a href="mailto:${escapeHtml(data.email)}" style="color:#111111;text-decoration:none;">${escapeHtml(
        data.email
      )}</a>`,
    ],
    ["Subject", escapeHtml(data.subject)],
    ["Timestamp", escapeHtml(data.timestamp)],
    ...(data.ip ? ([["IP", escapeHtml(data.ip)]] as Array<[string, string]>) : []),
  ]

  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 16px 12px 0; width:120px; color:#666666; font-size:12px; text-transform:uppercase; letter-spacing:0.12em; border-bottom:1px solid #e5e5e5;">
            ${label}
          </td>
          <td style="padding:12px 0; color:#111111; font-size:14px; line-height:1.6; border-bottom:1px solid #e5e5e5;">
            ${value}
          </td>
        </tr>
      `
    )
    .join("")

  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br />")

  const html = `
    <div style="margin:0;background:#f5f5f5;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;color:#111111;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #111111;box-shadow:0 10px 30px rgba(0,0,0,.06);">
        <div style="padding:28px 28px 18px;border-bottom:1px solid #111111;background:#ffffff;">
          <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#666666;margin-bottom:10px;">
            Portfolio contact
          </div>
          <h1 style="margin:0;font-size:28px;line-height:1.1;font-weight:700;color:#111111;">
            New inquiry for Alejandro Repetto
          </h1>
          <p style="margin:12px 0 0;color:#666666;font-size:14px;line-height:1.7;max-width:52ch;">
            Someone reached out through the portfolio contact form. Reply directly to the sender or review the details below.
          </p>
        </div>

        <div style="padding:24px 28px;">
          <table role="presentation" style="width:100%;border-collapse:collapse;">
            ${htmlRows}
          </table>

          <div style="margin-top:24px;border:1px solid #d9d9d9;background:#fafafa;">
            <div style="padding:12px 16px;border-bottom:1px solid #d9d9d9;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#666666;">
              Message
            </div>
            <div style="padding:18px 16px;font-size:15px;line-height:1.8;color:#111111;white-space:normal;">
              ${safeMessage}
            </div>
          </div>
        </div>

        <div style="padding:16px 28px 28px;border-top:1px solid #e5e5e5;color:#666666;font-size:12px;line-height:1.7;">
          <div style="font-family:'Courier New',monospace;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px;">
            Alejandro Repetto
          </div>
          <div>Portfolio contact form · repetto-a.com</div>
        </div>
      </div>
    </div>
  `

  return { text, html }
}
