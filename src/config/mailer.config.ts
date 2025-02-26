import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendApprovalEmail(email: string, username: string) {
    await this.transporter.sendMail({
      from: '"Owner" dhfaisweet@gmail.com',
      to: email,
      subject: 'Akunmu telah di terima oleh Owner!',
      html: `
        <h3>Akunmu telah di terima oleh Owner!</h3>
        <p>Silahkan login menggunakan username berikut:</p>
        <ul>
          <li><b>Username:</b> ${username}</li>
        </ul>
      `,
    });
  }
}
