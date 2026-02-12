const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Solo configurar si las variables de entorno están presentes
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true para 465, false para otros puertos
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });

      this.isConfigured = true;
      logger.info('📧 Email service configured');
    } else {
      logger.warn('⚠️ Email service not configured. Set SMTP environment variables.');
    }
  }

  /**
   * Enviar email genérico
   */
  async sendEmail({ to, subject, html, text }) {
    if (!this.isConfigured) {
      logger.warn('Email service not configured. Email not sent.');
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to,
        subject,
        text,
        html
      });

      logger.info(`📧 Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Email de bienvenida
   */
  async sendWelcomeEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>¡Bienvenido a CV Generator!</h2>
        <p>Hola ${user.first_name || 'Usuario'},</p>
        <p>Gracias por registrarte en CV Generator. Para completar tu registro, por favor verifica tu dirección de email haciendo clic en el siguiente enlace:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}"
             style="background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verificar Email
          </a>
        </p>
        <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
        <p>El enlace expirará en 24 horas.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          CV Generator - Creador de CVs Profesionales<br>
          Este es un email automático, por favor no respondas.
        </p>
      </div>
    `;

    const text = `
      Bienvenido a CV Generator!

      Hola ${user.first_name || 'Usuario'},

      Gracias por registrarte. Para verificar tu email, visita:
      ${verificationUrl}

      Si no creaste esta cuenta, ignora este email.
      El enlace expirará en 24 horas.
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Verifica tu email - CV Generator',
      html,
      text
    });
  }

  /**
   * Email de recuperación de contraseña
   */
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Recuperar Contraseña</h2>
        <p>Hola ${user.first_name || 'Usuario'},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, ignora este email.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
             style="background-color: #dc004e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Restablecer Contraseña
          </a>
        </p>
        <p>Este enlace expirará en 1 hora por seguridad.</p>
        <p>Si no solicitaste restablecer tu contraseña, tu cuenta sigue siendo segura y puedes ignorar este email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          CV Generator - Creador de CVs Profesionales<br>
          Este es un email automático, por favor no respondas.
        </p>
      </div>
    `;

    const text = `
      Recuperar Contraseña - CV Generator

      Hola ${user.first_name || 'Usuario'},

      Recibimos una solicitud para restablecer tu contraseña.
      Para continuar, visita: ${resetUrl}

      Este enlace expirará en 1 hora.
      Si no solicitaste esto, ignora este email.
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Recuperar contraseña - CV Generator',
      html,
      text
    });
  }

  /**
   * Email de confirmación de cambio de contraseña
   */
  async sendPasswordChangedEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Contraseña Cambiada</h2>
        <p>Hola ${user.first_name || 'Usuario'},</p>
        <p>Te confirmamos que tu contraseña ha sido cambiada exitosamente.</p>
        <p>Si no realizaste este cambio, por favor contacta a soporte inmediatamente.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          CV Generator - Creador de CVs Profesionales<br>
          Este es un email automático, por favor no respondas.
        </p>
      </div>
    `;

    const text = `
      Contraseña Cambiada - CV Generator

      Hola ${user.first_name || 'Usuario'},

      Tu contraseña ha sido cambiada exitosamente.
      Si no realizaste este cambio, contacta a soporte.
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Contraseña cambiada - CV Generator',
      html,
      text
    });
  }

  /**
   * Verificar configuración del transporter
   */
  async verifyConnection() {
    if (!this.isConfigured) {
      return { success: false, message: 'Email service not configured' };
    }

    try {
      await this.transporter.verify();
      logger.info('✅ Email server connection verified');
      return { success: true, message: 'Email server ready' };
    } catch (error) {
      logger.error('Email server connection failed:', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = new EmailService();
