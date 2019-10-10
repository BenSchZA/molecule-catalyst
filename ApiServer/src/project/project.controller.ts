import { Controller, UseGuards, Get, Post, UseInterceptors, Req, Body, Param, UploadedFiles } from '@nestjs/common';
import { ProjectService } from './project.service';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { UserType, User } from '../user/user.schema';
import { Project } from './project.schema';
import { AuthGuard } from '@nestjs/passport';
import { FileOptions, FileFieldsInterceptorHelper } from 'src/helpers/fileInterceptorHelper';
import { SubmitProjectDTO } from './dto/submitProject.dto';
import { Request } from 'express';
import { LaunchProjectDTO } from './dto/launchProject.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  // Public getter provides filtered list of projects that are displayed to all users.
  @Get()
  async getProjects() {
    const result = await this.projectService.getProjects();
    return result;
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Admin)
  async getAllProjects() {
    const result = await this.projectService.getAllProjects();
    return result;
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.ProjectCreator)
  async getUserProjects(@Req() req: Request & { user: User }) {
    const result = await this.projectService.getUserProjects(req.user.id);
    return result;
  }

  @Post('submit')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.ProjectCreator)
  @UseInterceptors(FileFieldsInterceptorHelper([{
    name: 'featuredImage',
    maxCount: 1,
    type: FileOptions.PICTURE,
  },
  {
    name: 'organisationImage',
    maxCount: 1,
    type: FileOptions.PICTURE,
  }]))
  async submitProject(@Req() req: Request & { user: User },
    @Body() reqBody: SubmitProjectDTO,
    @UploadedFiles() files) {
    const result = await this.projectService.submit(reqBody, files.featuredImage[0], files.organisationImage[0], req.user);
    return result;
  }

  @Get(':projectId/reject')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Admin)
  async rejectProject(@Param('projectId') projectId, @Req() req: Request & { user: User }) {
    const result = await this.projectService.rejectProject(projectId, req.user);
    return result;
  }

  @Post(':projectId/launch')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Admin)
  async launchProject(
    @Param('projectId') projectId,
    @Req() req: Request & { user: User }) {
    const result = await this.projectService.launchProject(projectId, req.user);
    return result;
  }

  @Post(':projectId/update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.ProjectCreator)
  async addResearchUpdate(
    @Param('projectId') projectId,
    @Body() body,
    @Req() req: Request & { user: User }) {
    const result = await this.projectService.addResearchUpdate(projectId, body.researchUpdate, req.user);
    return result;
  }
}
