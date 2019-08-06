import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.schema';
import { Model } from 'mongoose';
import { ProjectDocument } from './project.schema';
import { Schemas } from '../app.constants';
import { CreateProjectDTO } from './dto/createProject.dto';
import { AttachmentService } from 'src/attachment/attachment.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.schema';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Schemas.Project) private readonly projectRepository: Model<ProjectDocument>,
              private readonly attachmentService: AttachmentService,
              private readonly userService: UserService) {}

  async submit(projectData: CreateProjectDTO, file: any, user: User): Promise<Project> {
    const project = await new this.projectRepository({...projectData, user: user.id});
    if (file) {
      const attachment = await this.attachmentService.create({
        filename: `${project.id}-${file.originalname}`,
        contentType: file.mimetype
      }, file);
      project.featuredImage = attachment;
    }

    await project.save();
    return project.toObject();
  }

  async getAllProjects(): Promise<Project[]> {
    const result = await this.projectRepository.find({}).populate(Schemas.Project);
    return result.map(r => r.toObject())
  }

  async findById(projectId: string): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);
    return project ? project.toObject() : false;
  }
}
