import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.schema';
import { Model } from 'mongoose';
import { ProjectDocument } from './project.schema';
import { Schemas } from '../app.constants';
import { SubmitProjectDTO } from './dto/submitProject.dto';
import { AttachmentService } from 'src/attachment/attachment.service';
import { User } from 'src/user/user.schema';
import { ProjectSubmissionStatus } from './project.schema';
import { LaunchProjectDTO } from './dto/launchProject.dto';
import { ServiceBase } from 'src/common/serviceBase';
import * as sharp from 'sharp';
import { MarketService } from 'src/market/market.service';

@Injectable()
export class ProjectService extends ServiceBase {
  constructor(@InjectModel(Schemas.Project) private readonly projectRepository: Model<ProjectDocument>,
    private readonly attachmentService: AttachmentService,
    private readonly marketService: MarketService) {
    super(ProjectService.name);
  }

  async submit(projectData: SubmitProjectDTO, file: any, user: User): Promise<Project> {
    this.logger.debug('saving new project data');
    const profiler = this.logger.startTimer();
    const project = await new this.projectRepository({ ...projectData, user: user.id });
    if (file) {
      const croppedFile = await sharp(file.buffer)
        .resize(1366, 440, {
          position: sharp.strategy.attention,
        }).toBuffer();
      const attachment = await this.attachmentService.create({
        filename: `${project.id}-${file.originalname}`,
        contentType: file.mimetype
      }, { buffer: croppedFile });
      project.featuredImage = attachment;
    }

    await project.save();
    profiler.done('project saved');
    return project.toObject();
  }

  async getProjects() {
    const projects = await this.projectRepository
      .find().or([{ status: ProjectSubmissionStatus.started }, { status: ProjectSubmissionStatus.ended }])
      .populate(Schemas.User, '-email -type -valid -blacklisted -createdAt -updatedAt');

    const enhancedProjects = await Promise.all(projects.map(p => p.toObject())
      .map(async p => {
        if (p.chainData.marketAddress !== '0x' && p.chainData.vaultAddress !== '0x') {
          const marketData = await this.marketService.getMarketData(p.chainData.marketAddress);
          const vaultData = await this.marketService.getVaultData(p.chainData.vaultAddress)
          return {
            ...p,
            marketData: marketData.marketData,
            vaultData: vaultData.vaultData,
          }
        } else {
          return p;
        }
      }))

    return enhancedProjects;
  }

  async getAllProjects() {
    this.logger.info('Getting all projects');
    const projects = await this.projectRepository.find().populate(Schemas.User);
    const enhancedProjects = await Promise.all(projects.map(p => p.toObject())
      .map(async p => {
        if (p.chainData.marketAddress !== '0x' && p.chainData.vaultAddress !== '0x') {
          const marketData = await this.marketService.getMarketData(p.chainData.marketAddress);
          const vaultData = await this.marketService.getVaultData(p.chainData.vaultAddress)
          return {
            ...p,
            marketData: marketData.marketData,
            vaultData: vaultData.vaultData,
          }
        } else {
          return p;
        }
      }))

    return enhancedProjects;
  }

  async getUserProjects(userId: string) {
    const projects = await this.projectRepository.find({ user: userId }).populate(Schemas.User);
    const enhancedProjects = await Promise.all(projects.map(p => p.toObject())
      .map(async p => {
        if (p.chainData.marketAddress !== '0x' && p.chainData.vaultAddress !== '0x') {
          const marketData = await this.marketService.getMarketData(p.chainData.marketAddress);
          const vaultData = await this.marketService.getVaultData(p.chainData.vaultAddress)
          return {
            ...p,
            marketData: marketData.marketData,
            vaultData: vaultData.vaultData,
          }
        } else {
          return p;
        }
      }))

    return enhancedProjects;
  }

  async findById(projectId: string) {
    const projectDoc = await this.projectRepository.findById(projectId);
    if (!projectDoc) {
      return false;
    } else {
      const project = projectDoc.toObject();
      if (project.chainData.marketAddress !== '0x' && project.chainData.vaultAddress !== '0x') {
        const marketData = await this.marketService.getMarketData(project.chainData.marketAddress);
        const vaultData = await this.marketService.getVaultData(project.chainData.vaultAddress)
        return {
          ...project,
          marketData: marketData.marketData,
          vaultData: vaultData.vaultData,
        }
      } else {
        return project;
      }
    }
  }

  async approveProject(projectId: any, user: User) {
    const project = await this.projectRepository.findById(projectId);
    project.status = ProjectSubmissionStatus.accepted;
    project.reviewedBy = user.id;
    await project.save();
    return project.toObject();
  }

  async rejectProject(projectId: any, user: User) {
    const project = await this.projectRepository.findById(projectId);
    project.status = ProjectSubmissionStatus.rejected;
    project.reviewedBy = user.id;
    await project.save();
    return project.toObject();
  }

  async launchProject(projectId: any, projectData: LaunchProjectDTO, user: User) {
    const project = await this.projectRepository.findById(projectId);
    project.chainData = { ...projectData };
    project.status = ProjectSubmissionStatus.started;
    await project.save();
    return project.toObject();
  }
}
