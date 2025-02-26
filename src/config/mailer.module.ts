import { Module } from '@nestjs/common';
import { MailerService } from './mailer.config';

@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
