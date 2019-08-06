import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './project.controller';
import { UserService } from './project.service';
import { UserSchema } from './project.schema';
import { Schemas } from '../app.constants';

@Module({
  imports: [MongooseModule.forFeature([{ name: Schemas.User, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})

export class UserModule {}
