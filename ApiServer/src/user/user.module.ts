import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { Schemas } from '../app.constants';
import { MarketFactoryModule } from 'src/marketFactory/marketFactory.module';
import { MarketRegistryModule } from 'src/marketRegistry/marketRegistry.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Schemas.User, schema: UserSchema }]),
            MarketFactoryModule,
            MarketRegistryModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})

export class UserModule {}
