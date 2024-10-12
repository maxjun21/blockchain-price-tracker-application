import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LessThanOrEqual } from 'typeorm';
import Moralis from 'moralis';
import { subHours, startOfHour, format } from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from './schema/price.entity';
import { AlertService } from '../alert/alert.service';
import config from './../../../config/configuration';
import { MailerService } from 'src/utils/mailer/mailer.service';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);
  private readonly emailConfig = config().email;
  private readonly moralisConfig = config().moralis;
  private readonly ethereumConfig = config().ethereum;
  private readonly polygonConfig = config().polygon;

  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    private readonly alertService: AlertService,
    private readonly mailerService: MailerService,
  ) {}

  async onModuleInit() {
    await Moralis.start({
      apiKey: this.moralisConfig.apiKey,
    });
  }

  private async fetchTokenPrice(chain: string, address: string): Promise<any> {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        chain,
        include: 'percent_change',
        address,
      });

      return response.raw;
    } catch (error) {
      this.logger.error(
        `Error fetching price for chain ${chain}: ${error.message}`,
      );
    }
  }

  @Cron('*/1 * * * *')
  async savePricesEvery5Minutes() {
    const ethereumPrice = await this.fetchTokenPrice(
      this.ethereumConfig.chainId,
      this.ethereumConfig.maticToken,
    );

    const polygonPrice = await this.fetchTokenPrice(
      this.polygonConfig.chainId,
      this.polygonConfig.nativeToken,
    );

    if (ethereumPrice) {
      this.logger.log('Ethereum Price: ' + JSON.stringify(ethereumPrice));
      await this.savePriceToDatabase(
        'ethereum',
        ethereumPrice.usdPrice,
        ethereumPrice.percent_change,
      );
      await this.checkPriceIncrease('ethereum', ethereumPrice.usdPrice);
      await this.alertService.checkAlertsForPrice(
        'ethereum',
        ethereumPrice.usdPrice,
      );
    }

    if (polygonPrice) {
      this.logger.log('Polygon Price: ' + JSON.stringify(polygonPrice));
      await this.savePriceToDatabase(
        'polygon',
        polygonPrice.usdPrice,
        polygonPrice.percent_change,
      );
      await this.checkPriceIncrease('polygon', polygonPrice.usdPrice);
      await this.alertService.checkAlertsForPrice(
        'polygon',
        polygonPrice.usdPrice,
      );
    }
  }

  private async savePriceToDatabase(
    chain: string,
    price: number,
    percentChange: number,
  ) {
    await this.priceRepository.save({
      chain,
      price,
      percent_change: percentChange,
    });
  }

  private async checkPriceIncrease(chain: string, newPrice: number) {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const oldPriceEntry = await this.priceRepository.findOne({
      where: {
        chain,
        timestamp: LessThanOrEqual(oneHourAgo),
      },
      order: { timestamp: 'DESC' },
    });

    if (!oldPriceEntry) {
      this.logger.warn(`No price found for ${chain} from 1 hour ago.`);
      return;
    }

    const oldPrice = oldPriceEntry.price;
    const priceIncreasePercentage = ((newPrice - oldPrice) / oldPrice) * 100;

    if (priceIncreasePercentage > 3) {
      this.logger.log(
        `${chain} price increased by ${priceIncreasePercentage.toFixed(2)}%`,
      );

      await this.mailerService.sendPriceIncreaseEmail(
        this.emailConfig.sendTo,
        chain,
        oldPrice,
        newPrice,
        priceIncreasePercentage.toFixed(2),
      );
    }
  }

  async getHourlyPrices(chain: string) {
    const twentyFourHoursAgo = subHours(new Date(), 24);

    const prices = await this.priceRepository
      .createQueryBuilder('price')
      .where('price.chain = :chain', { chain })
      .andWhere('price.timestamp > :twentyFourHoursAgo', { twentyFourHoursAgo })
      .orderBy('price.timestamp', 'DESC')
      .getMany();

    const hourlyPrices = [];
    const seenHours = new Set();

    for (const price of prices) {
      const hour = startOfHour(price.timestamp).toISOString();

      if (!seenHours.has(hour)) {
        hourlyPrices.push({
          ...price,
          hour: format(startOfHour(price.timestamp), 'yyyy-MM-dd HH:mm'),
        });
        seenHours.add(hour);
      }

      if (hourlyPrices.length >= 24) break;
    }

    return hourlyPrices;
  }
}
