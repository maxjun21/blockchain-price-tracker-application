import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './schema/alert.entity';
import { Price } from '../price/schema/price.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { MailerService } from 'src/utils/mailer/mailer.service';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    private readonly mailerService: MailerService,
  ) {}

  async createAlert(createAlertDto: CreateAlertDto): Promise<Alert> {
    const alert = this.alertRepository.create(createAlertDto);
    return this.alertRepository.save(alert);
  }

  async checkAlertsForPrice(chain: string, newPrice: number): Promise<void> {
    this.logger.log(`Checking alerts for ${chain} with new price ${newPrice}`);

    const alerts = await this.alertRepository.find({});

    for (const alert of alerts) {
      try {
        if (newPrice >= alert.targetPrice) {
          this.logger.log(
            `Alert triggered for ${alert.chain}: Current price ${newPrice} >= Target price ${alert.targetPrice}`,
          );

          await this.mailerService.sendTargetPriceEmail(
            alert.email,
            alert.chain,
            alert.targetPrice,
            newPrice,
          );

          await this.alertRepository.save(alert);
        }
      } catch (error) {
        this.logger.error(
          `Error checking alert ID ${alert.id}: ${error.message}`,
        );
      }
    }
  }

  async checkAlerts(): Promise<void> {
    this.logger.log('Checking all alerts...');

    const alerts = await this.alertRepository.find({});

    for (const alert of alerts) {
      try {
        const latestPrice = await this.priceRepository.findOne({
          where: { chain: alert.chain },
          order: { timestamp: 'DESC' },
        });

        if (!latestPrice) {
          this.logger.warn(`No price data found for chain: ${alert.chain}`);
          continue;
        }

        if (latestPrice.price >= alert.targetPrice) {
          this.logger.log(
            `Alert triggered for ${alert.chain}: Current price ${latestPrice.price} >= Target price ${alert.targetPrice}`,
          );

          await this.mailerService.sendTargetPriceEmail(
            alert.email,
            alert.chain,
            alert.targetPrice,
            latestPrice.price,
          );

          await this.alertRepository.save(alert);
        }
      } catch (error) {
        this.logger.error(
          `Error checking alert ID ${alert.id}: ${error.message}`,
        );
      }
    }
  }
}
