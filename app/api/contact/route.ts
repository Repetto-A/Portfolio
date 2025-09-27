import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validaciones básicas
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Formato de correo electrónico inválido" },
        { status: 400 }
      );
    }

    // Verificar variables de entorno
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Error de configuración del servidor. Por favor, contacta al administrador.`
        },
        { status: 500 }
      );
    }

    // Configuración del transporte SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Opciones del correo
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: "repettoalejandroing@gmail.com",
      replyTo: `${body.name} <${body.email}>`,
      subject: `[Portfolio] ${body.subject}`,
      text: `
        Nombre: ${body.name}
        Email: ${body.email}
        Asunto: ${body.subject}
        
        Mensaje:
        ${body.message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nuevo mensaje del formulario de contacto</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Nombre:</strong> ${body.name}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            <p><strong>Asunto:</strong> ${body.subject}</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p><strong>Mensaje:</strong></p>
              <p style="white-space: pre-line;">${body.message}</p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { 
        success: true,
        message: "¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde."
      },
      { status: 500 }
    );
  }
}

// Agregar método OPTIONS para CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
