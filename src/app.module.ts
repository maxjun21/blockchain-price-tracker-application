// src/app.module.ts
import { Module } from '@nestjs/common';
import { PriceModule } from './api/v1/price/price.module';
import { AlertModule } from './api/v1/alert/alert.module';
import { DatabaseModule } from './database/database.module'; // Assuming database is used
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from './utils/mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PriceModule,
    AlertModule,
    DatabaseModule,
    MailerModule,
  ],
})
export class AppModule {}
