import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.schema';
import { Model } from 'mongoose';
import { ProjectDocument } from './project.schema';
import { Schemas } from '../app.constants';
import { SubmitProjectDTO } from './dto/submitProject.dto';
import { AttachmentService } from 'src/attachment/attachment.service';
import { User } from 'src/user/user.schema';
import { ProjectSubmissionStatus } from './project.schema';
import { ServiceBase } from 'src/common/serviceBase';
import * as sharp from 'sharp';
import { MarketFactoryService } from 'src/marketFactory/marketFactory.service';
import { MarketService } from 'src/market/market.service';
import { Vault } from 'src/market/vault.schema';
import { PhaseState } from 'src/market/vault.reducer';

@Injectable()
export class ProjectService extends ServiceBase {
  constructor(@InjectModel(Schemas.Project) private readonly projectRepository: Model<ProjectDocument>,
    private readonly attachmentService: AttachmentService,
    private readonly marketFactoryService: MarketFactoryService,
    private readonly marketService: MarketService) {
    super(ProjectService.name);
  }

  async submit(projectData: SubmitProjectDTO, file1: any, file2: any, user: User): Promise<Project> {
    this.logger.debug('saving new project data');
    const profiler = this.logger.startTimer();
    const project = await new this.projectRepository({ ...projectData, user: user.id });
    if (file1) {
      const croppedFile = await sharp(file1.buffer)
        .resize(1366, 440, {
          position: sharp.strategy.attention,
        }).toBuffer();
      const attachment = await this.attachmentService.create({
        filename: `${project.id}-${file1.originalname}`,
        contentType: file1.mimetype,
      }, { buffer: croppedFile });
      project.featuredImage = attachment;
    }

    if (file2) {
      const croppedFile = await sharp(file2.buffer)
        .resize(300, 300, {
          position: sharp.strategy.attention,
        }).toBuffer();
      const attachment = await this.attachmentService.create({
        filename: `${project.id}-${file2.originalname}`,
        contentType: file2.mimetype,
      }, { buffer: croppedFile });
      project.organisationImage = attachment;
    }

    await project.save();
    profiler.done('project saved');
    return project.toObject();
  }

  async getProjects() {
    const projects = await this.projectRepository
      .find().or([{ status: ProjectSubmissionStatus.started }, { status: ProjectSubmissionStatus.ended }])
      .populate(Schemas.User, '-email -type -valid -blacklisted -createdAt -updatedAt');

    return Promise.all(projects.map(p => this.getMarketVaultData(p)));
  }

  async getAllProjects() {
    this.logger.info('Getting all projects');
    const projects = await this.projectRepository.find().populate(Schemas.User);
    return Promise.all(projects.map(p => this.getMarketVaultData(p)));
  }

  async getUserProjects(userId: string) {
    const projects = await this.projectRepository.find({ user: userId }).populate(Schemas.User);
    return Promise.all(projects.map(p => this.getMarketVaultData(p)));
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
      project.chainData = deploymentResult;
      project.status = ProjectSubmissionStatus.started;
      await project.save();
      return project.toObject();
    } catch (error) {
      this.logger.error(`Something went wrong deploying project ${project.id}`);
      this.logger.error(error);
      throw new InternalServerErrorException(`Something went wrong deploying project ${project.id}`, error);
    }
  }

  async addResearchUpdate(projectId: any, update: string, user: User) {
    const project = await this.projectRepository.findById(projectId).populate(Schemas.User);

    //@ts-ignore
    if (project.user.id !== user.id) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      this.logger.info(`Adding update to project ${projectId}`);
      project.researchUpdates.push({ update: update, date: new Date() })
      await project.save();
    } catch (error) {
      this.logger.error(`Something went wrong adding updates to project ${project.id}`);
      this.logger.error(error);
      throw new InternalServerErrorException(`Something went wrong adding updates to project ${project.id}`, error);
    }
  }

  private async getMarketVaultData(projectDoc: ProjectDocument): Promise<Project> {
    if (projectDoc.chainData.marketAddress !== '0x' && projectDoc.chainData.vaultAddress !== '0x') {
      const marketData = await this.marketService.getMarketData(projectDoc.chainData.marketAddress);
      const vaultData = await this.marketService.getVaultData(projectDoc.chainData.vaultAddress)
      if (projectDoc.status === ProjectSubmissionStatus.started) {
        await this.validateProjectStatus(projectDoc, vaultData);
      }
      return {
        ...projectDoc.toObject(),
        marketData: marketData.marketData,
        vaultData: vaultData.vaultData,
      }
    } else {
      return projectDoc.toObject();
    }
  }

  private async validateProjectStatus(project: ProjectDocument, vault: Vault): Promise<ProjectDocument> {
    try {
      // Check if there are any ongoing phases
      const ongoingPhases = vault.vaultData.phases.filter(value => value.state <= PhaseState.STARTED);
      if (!ongoingPhases.length) {
        this.logger.info(`Status for project ${project.id} updated to 'ended'`);
        project.status = ProjectSubmissionStatus.ended;
        await project.save();
      }
      return project;
    } catch (error) {
      this.logger.error(`Something went wrong validating status for project ${project.id}`);
      this.logger.error(error);
      return project;
    }
  }
}
