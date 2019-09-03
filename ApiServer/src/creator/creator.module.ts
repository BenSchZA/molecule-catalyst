import { Module } from '@nestjs/common';
import { CreatorController } from './creator.controller';
import { CreatorService } from './creator.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from 'src/app.constants';
import { CreatorApplicationSchema } from './creator.schema';
import { AttachmentModule } from 'src/attachment/attachment.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';
import { TokenSchema } from 'src/auth/token.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Schemas.Creator, schema: CreatorApplicationSchema }]),
    AttachmentModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = configService.get('jwt');
        return ({
          secret: jwtConfig.secret,
          signOptions: {},
        });
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Schemas.Token, schema: TokenSchema }]),
    UserModule
  ],
  controllers: [CreatorController],
  providers: [CreatorService]
})
export class CreatorModule { }
