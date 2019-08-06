import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectSchema } from './project.schema';
import { Schemas } from '../app.constants';

@Module({
  imports: [MongooseModule.forFeature([{ name: Schemas.Project, schema: ProjectSchema }])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})

export class ProjectModule {}
