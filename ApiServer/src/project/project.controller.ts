import { Controller, UseGuards, Get } from '@nestjs/common';
import { ProjectService } from './project.service';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { UserType } from '../user/user.schema';
import { Project } from './project.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
export class ProjectController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Standard)
  async getAllProjects(): Promise<Project[]> {
    const result = await this.userService.getAllUsers();
    return result;
  }
}
