import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.schema';
import { Model } from 'mongoose';
import { ProjectDocument } from './project.schema';
import { Schemas } from '../app.constants';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Schemas.Project) private readonly projectRepository: Model<ProjectDocument>) {}

  async create(): Promise<Project> {
    const newProject = await new this.projectRepository({});
    await newProject.save();
    return newProject.toObject();
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
