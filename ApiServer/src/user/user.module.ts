import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { Schemas } from '../app.constants';
import { MarketFactoryModule } from 'src/marketFactory/marketFactory.module';
import { AttachmentModule } from 'src/attachment/attachment.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Schemas.User, schema: UserSchema }]),
    AttachmentModule,
    MarketFactoryModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})

export class UserModule { }
