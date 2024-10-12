import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PriceService } from './price.service';

@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get(':chain')
  async getHourlyPrices(@Param('chain') chain: string) {
    const hourlyPrices = await this.priceService.getHourlyPrices(chain);

    if (hourlyPrices.length === 0) {
      throw new NotFoundException(`No prices found for chain: ${chain}`);
    }

    return hourlyPrices;
  }
}
