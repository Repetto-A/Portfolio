import nodemailer from "nodemailer"
import DOMPurify from "isomorphic-dompurify"

export interface EmailData {
  name: string
  email: string
  subject: string
  message: string
  timestamp: string
  ip?: string
}

export interface SMTPConfig {
  host: string
  port: number
  user: string
  password: string
  from: string
}

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(ip: string, maxRequests = 5, windowMs = 15 * 60 * 1000): boolean {
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

export function sanitizeInput(input: string): string {
  // Remove potential header injection characters
  const cleaned = input.replace(/[\r\n\t]/g, " ").trim()
  // Sanitize HTML content
  return DOMPurify.sanitize(cleaned, { ALLOWED_TAGS: [] })
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function createSMTPTransporter(config: SMTPConfig) {
  return nodemailer.createTransporter({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.password,
    },
    tls: {
      // Enable STARTTLS
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
  })
}

export function generateEmailContent(data: EmailData): { text: string; html: string } {
  const text = `
New message from portfolio contact form

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}
Timestamp: ${data.timestamp}
${data.ip ? `IP Address: ${data.ip}` : ""}

Message:
${data.message}
  `.trim()

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
        New Portfolio Contact Form Submission
      </h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Name:</td>
            <td style="padding: 8px 0;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
            <td style="padding: 8px 0;">${data.subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Timestamp:</td>
            <td style="padding: 8px 0;">${data.timestamp}</td>
          </tr>
          ${
            data.ip
              ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">IP Address:</td>
            <td style="padding: 8px 0;">${data.ip}</td>
          </tr>
          `
              : ""
          }
        </table>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
        <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; white-space: pre-wrap;">${data.message}</div>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
        <p>This email was sent from your portfolio contact form.</p>
      </div>
    </div>
  `

  return { text, html }
}

// Message queue for retry logic (in production, use Redis Queue or similar)
interface QueuedMessage {
  id: string
  data: EmailData
  attempts: number
  nextRetry: number
}

const messageQueue: QueuedMessage[] = []

export async function queueMessage(data: EmailData): Promise<string> {
  const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  messageQueue.push({
    id,
    data,
    attempts: 0,
    nextRetry: Date.now(),
  })
  return id
}

export async function processMessageQueue(config: SMTPConfig): Promise<void> {
  const now = Date.now()
  const transporter = createSMTPTransporter(config)

  for (let i = messageQueue.length - 1; i >= 0; i--) {
    const message = messageQueue[i]

    if (now < message.nextRetry) continue
    if (message.attempts >= 3) {
      console.error(`Failed to send message ${message.id} after 3 attempts`)
      messageQueue.splice(i, 1)
      continue
    }

    try {
      const { text, html } = generateEmailContent(message.data)

      await transporter.sendMail({
        from: config.from,
        to: "repettoalejandroing@gmail.com",
        replyTo: message.data.email,
        subject: "New message from portfolio contact form",
        text,
        html,
      })

      console.log(`Successfully sent queued message ${message.id}`)
      messageQueue.splice(i, 1)
    } catch (error) {
      message.attempts++
      // Exponential backoff: 1min, 5min, 15min
      const backoffMs = Math.pow(5, message.attempts) * 60 * 1000
      message.nextRetry = now + backoffMs

      console.error(`Failed to send message ${message.id}, attempt ${message.attempts}:`, error)
    }
  }
}
