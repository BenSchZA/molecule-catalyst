import { Module } from '@nestjs/common';
import { MarketRegistryService } from './marketRegistry.service';

@Module({
  providers: [MarketRegistryService],
  exports: [MarketRegistryService],
})

export class MarketRegistryModule {}
