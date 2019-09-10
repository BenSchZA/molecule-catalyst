import { Module } from '@nestjs/common';
import { MarketFactoryService } from './marketFactory.service';

@Module({
  providers: [MarketFactoryService],
  exports: [MarketFactoryService],
})

export class MarketFactoryModule {}
