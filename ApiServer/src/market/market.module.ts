import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from 'src/app.constants';
import { MarketSchema } from './market.schema';
import { VaultSchema } from './vault.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Schemas.Market, schema: MarketSchema },
      { name: Schemas.Vault, schema: VaultSchema }]),
  ],
  providers: [MarketService],
  exports: [MarketService],
})

export class MarketModule {}
