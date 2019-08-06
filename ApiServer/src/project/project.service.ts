import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.schema';
import { Model } from 'mongoose';
import { ProjectDocument } from './project.schema';
import { Schemas } from '../app.constants';
import { CreateProjectDTO } from './dto/createProject.dto';
import { AttachmentService } from 'src/attachment/attachment.service';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Schemas.Project) private readonly projectRepository: Model<ProjectDocument>,
              private readonly attachmentService: AttachmentService) {}

  async create(projectData: CreateProjectDTO, file: any): Promise<Project> {
    const project = await new this.projectRepository({...projectData});
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
