import { Controller, UseGuards, Get, Post, UseInterceptors, Req, Body, UploadedFile } from '@nestjs/common';
import { ProjectService } from './project.service';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { UserType } from '../user/user.schema';
import { Project } from './project.schema';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptorHelper, FileOptions } from 'src/helpers/fileInterceptorHelper';
import { CreateProjectDTO } from './dto/createProject.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Standard)
  async getAllProjects(): Promise<Project[]> {
    const result = await this.projectService.getAllProjects();
    return result;
  }

  @Get('awaitingApproval')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Standard)
  async getAllAwaitingApprovalProjects(): Promise<Project[]> {
    const result = await this.projectService.getAllProjects();
    return result;
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptorHelper({
    name: 'featuredImage',
    maxCount: 1,
    type: FileOptions.PICTURE,
  }))
  async createProject(@Req() req: Request & { project: Project },
    @Body() reqBody: CreateProjectDTO,
    @UploadedFile() file) {
    const result = await this.projectService.create(reqBody, file, req.project);
    return result;
  }
}
