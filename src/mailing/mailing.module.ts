import { Module } from '@nestjs/common';
// import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  // controllers: [MailingController],
  providers: [MailingService, ConfigService],
  exports: [MailingService],
})
export class MailingModule {}
