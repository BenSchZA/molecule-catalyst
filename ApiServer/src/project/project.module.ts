import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectSchema } from './project.schema';
import { Schemas } from '../app.constants';
import { AttachmentModule } from 'src/attachment/attachment.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Schemas.Project, schema: ProjectSchema }]),
    AttachmentModule,
    UserModule
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})

export class ProjectModule {}
