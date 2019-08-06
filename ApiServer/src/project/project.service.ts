import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.schema';
import { Model } from 'mongoose';
import { ProjectDocument } from './project.schema';
import { Schemas } from '../app.constants';
import { CreateProjectDTO } from './dto/createProject.dto';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Schemas.Project) private readonly projectRepository: Model<ProjectDocument>) {}

  async create(projectData: CreateProjectDTO, file: any, project: Project): Promise<Project> {
    const newProject = await new this.projectRepository({});
    await newProject.save();
    return newProject.toObject();
    // console.log('saving application');
    // const creator = await new this.creatorRepository({...applicationData, user: user.id});
    // if (file) {
    //   const attachment = await this.attachmentService.create({
    //     filename: `${creator.id}-${file.originalname}`,
    //     contentType: file.mimetype
    //   }, file);
    //   creator.profileImage = attachment;
    // }

    // await creator.save();

    // const token = await this.jwtService.signAsync({ userId: user.id }, { notBefore: Date.now(), expiresIn: 43200 });
    // await this.tokenRepository.create({userId: user.id, token});

    // try {
    //   const appConfig = this.configService.get('app');
    //   await this.sendgridService.send({
    //     to: creator.email,
    //     from: 'verify@mol.ai',
    //     subject: 'Mol.ai Please verify email',
    //     text: `Your email verification token is ${token}`,
    //     html: `<strong>Click <a href="${appConfig.webappUrl}/projects/becomeCreator?token=${token}">here</a> to verify your email</strong>`
    //   })

    //   creator.status = CreatorApplicationStatus.awaitingEmailVerification;
    //   creator.save()
    // } catch (error) {
    //   console.log('Error sending verification email to user');
    // }    
    // return creator.toObject();
  }

  async getAllProjects(): Promise<Project[]> {
    const result = await this.projectRepository.find({}).populate(Schemas.Project);
    return result.map(r => r.toObject())
  }

  async getAwaitingApprovalProjects(): Promise<Project[]> {
    const result = await this.projectRepository.find({status: 1}).populate(Schemas.Project);
    return result.map(r => r.toObject());
  }

  async findById(projectId: string): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);
    return project ? project.toObject() : false;
  }
}
