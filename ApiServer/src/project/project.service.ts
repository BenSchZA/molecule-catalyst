import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { MarketFactoryService } from 'src/marketFactory/marketFactory.service';

@Injectable()
export class ProjectService extends ServiceBase {
  constructor(@InjectModel(Schemas.Project) private readonly projectRepository: Model<ProjectDocument>,
    private readonly attachmentService: AttachmentService,
    private readonly marketFactoryService: MarketFactoryService) {
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
    const result = await this.projectRepository
      .find().or([{ status: ProjectSubmissionStatus.started }, { status: ProjectSubmissionStatus.ended }])
      .populate(Schemas.User, '-email -type -valid -blacklisted -createdAt -updatedAt -chainData');
    return result.map(r => r.toObject())
  }

  async getAllProjects(): Promise<Project[]> {
    const result = await this.projectRepository.find().populate(Schemas.User);
    return result.map(r => r.toObject())
  }

  async getUserProjects(userId: string) {
    const result = await this.projectRepository.find({ user: userId }).populate(Schemas.User);
    return result.map(r => r.toObject());
  }

  async findById(projectId: string): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);
    return project ? project.toObject() : false;
  }

  async approveProject(projectId: any, user: User) {
    const project = await this.projectRepository.findById(projectId);
    project.status = ProjectSubmissionStatus.accepted;
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

  async launchProject(projectId: any, user: User) {
    this.logger.info(`Deploying market for project ${projectId}`);
    const project = await this.projectRepository.findById(projectId).populate(Schemas.User);
    project.reviewedBy = user.id;

    try {
      const deploymentResult = await this.marketFactoryService.deployMarket(
        project.researchPhases.map(value => value.fundingGoal),
        project.researchPhases.map(value => value.duration),
        //@ts-ignore
        project.user.ethAddress,
        0,
        15,
      );
      project.chainData.marketAddress = deploymentResult.marketAddress
      project.chainData.vaultAddress = deploymentResult.vaultAddress
      project.status = ProjectSubmissionStatus.started;
      await project.save();
      return project.toObject();
    } catch (error) {
      this.logger.error(`Something went wrong deploying project ${project.id}`);
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
