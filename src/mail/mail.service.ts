import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl =
      `http://localhost:3000/auth/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verifica tu cuenta',
      html: `
        <h2>Verificación de cuenta</h2>
        <p>Haz click en el siguiente enlace:</p>
        <a href="${verificationUrl}">
          Verificar cuenta
        </a>
      `,
    });
  }
}