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
      from: '"dhfai" dhfaisweet@gmail.com',
      to: email,
      subject: 'Akunmu telah di terima/di setujuai!',
      html: `
        <h3>Selamat, akunmu telah di setujui silahkan menikmati layanan kami dan terima kasih telah bergabung🥳!</h3>
        <p>Silahkan login menggunakan username :</p>
        <ul>
          <li><b>Username:</b> ${username}</li>
        </ul>
      `,
    });
  }
}
