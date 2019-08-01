import { Controller, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { User, UserType } from './user.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Admin)
  async getAllUsers(): Promise<User[]> {
    const result = await this.userService.getAllUsers();
    return result;
  }
}
