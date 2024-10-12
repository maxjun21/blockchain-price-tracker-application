import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { Price } from './schema/price.entity';
import { AlertModule } from '../alert/alert.module';
import { AlertService } from '../alert/alert.service';
import { Alert } from '../alert/schema/alert.entity';
import { MailerModule } from 'src/utils/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Price, Alert]),
    AlertModule,
    MailerModule,
  ],
  providers: [PriceService, AlertService],
  controllers: [PriceController],
})
export class PriceModule {}
