import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './schema/alert.entity';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { Price } from '../price/schema/price.entity';
import { MailerModule } from 'src/utils/mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Alert, Price]), MailerModule],
  providers: [AlertService],
  controllers: [AlertController],
})
export class AlertModule {}
